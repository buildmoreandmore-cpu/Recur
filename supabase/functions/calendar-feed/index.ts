import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.47.0';

// This function must be publicly accessible (no JWT verification)
// Authentication is handled via the token parameter in the URL

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ICS date format: YYYYMMDDTHHMMSS
function formatICSDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}${month}${day}T${hours}${minutes}${seconds}`;
}

// ICS UTC date format: YYYYMMDDTHHMMSSZ
function formatICSDateUTC(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

// Escape special characters for ICS
function escapeICSText(text: string): string {
  if (!text) return '';
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

interface Appointment {
  date: string;
  service: string;
  price: number;
  status: string;
}

interface ClientEvent {
  name: string;
  date: string;
  service?: { name: string } | null;
}

interface Client {
  id: string;
  name: string;
  phone?: string;
  appointments?: Appointment[];
  events?: ClientEvent[];
}

interface Professional {
  id: string;
  business_name?: string;
  location?: string;
}

function generateVEvent(
  uid: string,
  title: string,
  description: string,
  startDate: Date,
  endDate: Date,
  location?: string
): string {
  const lines: string[] = [];
  lines.push('BEGIN:VEVENT');
  lines.push(`UID:${uid}`);
  lines.push(`DTSTAMP:${formatICSDateUTC(new Date())}`);
  lines.push(`DTSTART:${formatICSDate(startDate)}`);
  lines.push(`DTEND:${formatICSDate(endDate)}`);
  lines.push(`SUMMARY:${escapeICSText(title)}`);
  if (description) {
    lines.push(`DESCRIPTION:${escapeICSText(description)}`);
  }
  if (location) {
    lines.push(`LOCATION:${escapeICSText(location)}`);
  }
  lines.push('STATUS:CONFIRMED');
  lines.push('END:VEVENT');
  return lines.join('\r\n');
}

function generateCalendarFeed(
  clients: Client[],
  professional: Professional
): string {
  const events: string[] = [];

  clients.forEach((client) => {
    // Add all appointments
    if (client.appointments && client.appointments.length > 0) {
      client.appointments.forEach((appointment, index) => {
        const startDate = new Date(appointment.date);

        // Skip invalid dates
        if (isNaN(startDate.getTime())) {
          return;
        }

        const endDate = new Date(startDate);
        endDate.setHours(endDate.getHours() + 1);

        const description = [
          `Service: ${appointment.service}`,
          `Price: $${appointment.price}`,
          `Client: ${client.name}`,
          client.phone ? `Phone: ${client.phone}` : null,
        ].filter(Boolean).join('\n');

        events.push(generateVEvent(
          `apt-${client.id}-${index}-${startDate.getTime()}@recur.app`,
          `${appointment.service} - ${client.name}`,
          description,
          startDate,
          endDate,
          professional.location
        ));
      });
    }

    // Add client events
    if (client.events && client.events.length > 0) {
      client.events.forEach((clientEvent, index) => {
        const startDate = new Date(clientEvent.date);

        if (isNaN(startDate.getTime())) {
          return;
        }

        const endDate = new Date(startDate);
        endDate.setHours(endDate.getHours() + 2);

        const descriptionParts = [
          `Event: ${clientEvent.name}`,
          `Client: ${client.name}`,
        ];
        if (clientEvent.service) {
          descriptionParts.splice(1, 0, `Service: ${clientEvent.service.name}`);
        }

        events.push(generateVEvent(
          `evt-${client.id}-${index}-${startDate.getTime()}@recur.app`,
          `${clientEvent.name} - ${client.name}`,
          descriptionParts.join('\n'),
          startDate,
          endDate,
          professional.location
        ));
      });
    }
  });

  const calendarName = professional.business_name || 'Recur Appointments';

  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Recur//Appointment Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeICSText(calendarName)}`,
    // Refresh interval hint for calendar apps (1 hour)
    'X-PUBLISHED-TTL:PT1H',
    'REFRESH-INTERVAL;VALUE=DURATION:PT1H',
    ...events,
    'END:VCALENDAR',
  ];

  return icsLines.join('\r\n');
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const feedToken = url.searchParams.get('token');
    const professionalId = url.searchParams.get('id');

    if (!feedToken || !professionalId) {
      throw new Error('Missing required parameters: token and id');
    }

    // Use service role to bypass RLS since this is a public calendar feed
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify the feed token matches the professional's stored token
    const { data: professional, error: profError } = await supabaseClient
      .from('professionals')
      .select('id, business_name, location, calendar_feed_token')
      .eq('id', professionalId)
      .single();

    if (profError || !professional) {
      throw new Error('Professional not found');
    }

    // Validate token
    if (professional.calendar_feed_token !== feedToken) {
      throw new Error('Invalid feed token');
    }

    // Fetch all clients for this professional
    const { data: clients, error: clientsError } = await supabaseClient
      .from('clients')
      .select('id, name, phone')
      .eq('professional_id', professionalId);

    if (clientsError) {
      console.error('Error fetching clients:', clientsError);
      throw new Error('Failed to fetch clients');
    }

    // Fetch appointments for all clients
    const clientIds = (clients || []).map((c: any) => c.id);

    let appointments: any[] = [];
    let clientEvents: any[] = [];

    if (clientIds.length > 0) {
      const { data: appts, error: apptsError } = await supabaseClient
        .from('appointments')
        .select('client_id, date, service_name, price, status')
        .in('client_id', clientIds);

      if (apptsError) {
        console.error('Error fetching appointments:', apptsError);
      } else {
        appointments = appts || [];
      }

      const { data: events, error: eventsError } = await supabaseClient
        .from('client_events')
        .select('client_id, name, date, service_id')
        .in('client_id', clientIds);

      if (eventsError) {
        console.error('Error fetching events:', eventsError);
      } else {
        clientEvents = events || [];
      }
    }

    // Map appointments and events to clients
    const clientsWithData = (clients || []).map((client: any) => ({
      ...client,
      appointments: appointments
        .filter((a: any) => a.client_id === client.id)
        .map((a: any) => ({
          date: a.date,
          service: a.service_name,
          price: a.price,
          status: a.status,
        })),
      events: clientEvents
        .filter((e: any) => e.client_id === client.id)
        .map((e: any) => ({
          name: e.name,
          date: e.date,
          service: e.service_id ? { name: 'Event Service' } : null,
        })),
    }));

    // Generate the ICS feed
    const icsContent = generateCalendarFeed(clientsWithData, professional);

    // Return ICS with proper headers for calendar subscription
    return new Response(icsContent, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': 'attachment; filename="recur-appointments.ics"',
        // Cache for 5 minutes to allow frequent updates while reducing load
        'Cache-Control': 'public, max-age=300',
      },
      status: 200,
    });
  } catch (error) {
    console.error('Error in calendar-feed:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
