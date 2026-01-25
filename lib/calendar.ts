/**
 * ICS Calendar Generation Utility
 * Generates iCalendar format files compatible with all calendar apps:
 * - iPhone Calendar
 * - Google Calendar (Android)
 * - Outlook
 * - Any standards-compliant calendar app
 *
 * Based on RFC 5545 (iCalendar specification)
 */

import { Client, StylistProfile } from '../types';

interface CalendarEvent {
  uid: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  status?: 'CONFIRMED' | 'TENTATIVE' | 'CANCELLED';
}

/**
 * Formats a Date object to ICS datetime format (YYYYMMDDTHHMMSS)
 */
function formatICSDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}${month}${day}T${hours}${minutes}${seconds}`;
}

/**
 * Formats a Date object to ICS datetime format in UTC (YYYYMMDDTHHMMSSZ)
 */
function formatICSDateUTC(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');

  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

/**
 * Escapes special characters in ICS text fields per RFC 5545
 * Backslashes, semicolons, and commas must be escaped
 * Newlines become literal \n
 */
function escapeICSText(text: string): string {
  if (!text) return '';
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

/**
 * Generates a single VEVENT component
 */
function generateVEvent(event: CalendarEvent): string {
  const lines: string[] = [];

  lines.push('BEGIN:VEVENT');
  lines.push(`UID:${event.uid}`);
  lines.push(`DTSTAMP:${formatICSDateUTC(new Date())}`);
  lines.push(`DTSTART:${formatICSDate(event.startDate)}`);
  lines.push(`DTEND:${formatICSDate(event.endDate)}`);
  lines.push(`SUMMARY:${escapeICSText(event.title)}`);

  if (event.description) {
    lines.push(`DESCRIPTION:${escapeICSText(event.description)}`);
  }

  if (event.location) {
    lines.push(`LOCATION:${escapeICSText(event.location)}`);
  }

  lines.push(`STATUS:${event.status || 'CONFIRMED'}`);
  lines.push('END:VEVENT');

  return lines.join('\r\n');
}

/**
 * Generates an ICS file content for a single appointment
 */
export function generateSingleAppointmentICS(
  client: Client,
  appointmentIndex: number,
  professional: StylistProfile
): string {
  const appointment = client.appointments[appointmentIndex];
  if (!appointment) return '';

  // Parse appointment date and create start/end times
  const startDate = new Date(appointment.date);

  // Validate date
  if (isNaN(startDate.getTime())) {
    console.error('Invalid appointment date:', appointment.date);
    return '';
  }

  const endDate = new Date(startDate);
  endDate.setHours(endDate.getHours() + 1); // Default 1 hour duration

  const description = [
    `Service: ${appointment.service}`,
    `Price: $${appointment.price}`,
    `Client: ${client.name}`,
    client.phone ? `Phone: ${client.phone}` : null,
  ].filter(Boolean).join('\n');

  const event: CalendarEvent = {
    uid: `apt-${client.id}-${appointmentIndex}-${Date.now()}@recur.app`,
    title: `${appointment.service} - ${client.name}`,
    description,
    startDate,
    endDate,
    location: professional.location || undefined,
    status: appointment.status === 'completed' ? 'CONFIRMED' : 'CONFIRMED',
  };

  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Recur//Appointment Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    generateVEvent(event),
    'END:VCALENDAR',
  ];

  return icsLines.join('\r\n');
}

/**
 * Generates an ICS file content for all of a client's appointments
 */
export function generateClientAppointmentsICS(
  client: Client,
  professional: StylistProfile
): string {
  const events: string[] = [];

  // Add all appointments
  if (client.appointments && client.appointments.length > 0) {
    client.appointments.forEach((appointment, index) => {
      const startDate = new Date(appointment.date);

      // Skip invalid dates
      if (isNaN(startDate.getTime())) {
        console.warn('Skipping appointment with invalid date:', appointment.date);
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

      const event: CalendarEvent = {
        uid: `apt-${client.id}-${index}-${startDate.getTime()}@recur.app`,
        title: `${appointment.service} - ${client.name}`,
        description,
        startDate,
        endDate,
        location: professional.location || undefined,
        status: 'CONFIRMED',
      };

      events.push(generateVEvent(event));
    });
  }

  // Add client events (birthdays, anniversaries, etc.)
  if (client.events && client.events.length > 0) {
    client.events.forEach((clientEvent, index) => {
      const startDate = new Date(clientEvent.date);

      // Skip invalid dates
      if (isNaN(startDate.getTime())) {
        console.warn('Skipping event with invalid date:', clientEvent.date);
        return;
      }

      const endDate = new Date(startDate);
      endDate.setHours(endDate.getHours() + 2); // Events are 2 hours

      const descriptionParts = [
        `Event: ${clientEvent.name}`,
        `Client: ${client.name}`,
      ];
      if (clientEvent.service) {
        descriptionParts.splice(1, 0, `Service: ${clientEvent.service.name}`);
      }

      const event: CalendarEvent = {
        uid: `evt-${client.id}-${index}-${startDate.getTime()}@recur.app`,
        title: `${clientEvent.name} - ${client.name}`,
        description: descriptionParts.join('\n'),
        startDate,
        endDate,
        location: professional.location || undefined,
        status: 'CONFIRMED',
      };

      events.push(generateVEvent(event));
    });
  }

  if (events.length === 0) {
    return '';
  }

  const calendarName = `${client.name} Appointments`;

  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Recur//Appointment Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeICSText(calendarName)}`,
    ...events,
    'END:VCALENDAR',
  ];

  return icsLines.join('\r\n');
}

/**
 * Generates an ICS file content for all clients' appointments
 * Includes ALL appointments (past, current, and future) for full calendar sync
 */
export function generateAllAppointmentsICS(
  clients: Client[],
  professional: StylistProfile
): string {
  const events: string[] = [];

  clients.forEach((client) => {
    // Add ALL appointments (not filtered by date)
    if (client.appointments && client.appointments.length > 0) {
      client.appointments.forEach((appointment, index) => {
        const startDate = new Date(appointment.date);

        // Skip invalid dates only
        if (isNaN(startDate.getTime())) {
          console.warn('Skipping appointment with invalid date:', appointment.date, 'for client:', client.name);
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

        const event: CalendarEvent = {
          uid: `apt-${client.id}-${index}-${startDate.getTime()}@recur.app`,
          title: `${appointment.service} - ${client.name}`,
          description,
          startDate,
          endDate,
          location: professional.location || undefined,
          status: appointment.status === 'completed' ? 'CONFIRMED' : 'CONFIRMED',
        };

        events.push(generateVEvent(event));
      });
    }

    // Add ALL client events (birthdays, anniversaries, etc.)
    if (client.events && client.events.length > 0) {
      client.events.forEach((clientEvent, index) => {
        const startDate = new Date(clientEvent.date);

        // Skip invalid dates only
        if (isNaN(startDate.getTime())) {
          console.warn('Skipping event with invalid date:', clientEvent.date, 'for client:', client.name);
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

        const event: CalendarEvent = {
          uid: `evt-${client.id}-${index}-${startDate.getTime()}@recur.app`,
          title: `${clientEvent.name} - ${client.name}`,
          description: descriptionParts.join('\n'),
          startDate,
          endDate,
          location: professional.location || undefined,
          status: 'CONFIRMED',
        };

        events.push(generateVEvent(event));
      });
    }
  });

  const calendarName = professional.businessName || 'Recur Appointments';

  // Always return a valid calendar, even if empty
  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Recur//Appointment Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeICSText(calendarName)}`,
    ...events,
    'END:VCALENDAR',
  ];

  return icsLines.join('\r\n');
}

/**
 * Downloads an ICS file to the user's device
 */
export function downloadICS(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.ics') ? filename : `${filename}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Opens the ICS content directly (useful for mobile devices)
 * This triggers the native calendar app to handle the .ics file
 */
export function openICS(content: string): void {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
  // Clean up after a delay to ensure the file is opened
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

/**
 * Creates a data URL for the ICS content (for use in anchor href)
 */
export function createICSDataUrl(content: string): string {
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(content)}`;
}
