import { supabase, isSupabaseConfigured } from './supabase';
import type { Client, Service, StylistProfile, BookingSettings, BookingRequest, RotationType, IndustryType } from '../types';

// ============ PROFILE FUNCTIONS ============

export async function fetchProfile(): Promise<StylistProfile | null> {
  if (!isSupabaseConfigured) return null;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile, error } = await supabase
    .from('professionals')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error || !profile) return null;

  // Fetch services for this professional
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('professional_id', profile.id);

  return dbToProfile(profile, services || []);
}

export async function saveProfile(profile: StylistProfile): Promise<{ error: Error | null; profileId?: string }> {
  if (!isSupabaseConfigured) {
    return { error: new Error('Supabase not configured') };
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: new Error('Not authenticated') };

  // Check if profile exists
  const { data: existing } = await supabase
    .from('professionals')
    .select('id')
    .eq('user_id', user.id)
    .single();

  const profileData = {
    user_id: user.id,
    name: profile.name,
    business_name: profile.businessName || null,
    email: profile.email,
    phone: profile.phone || null,
    location: profile.location || null,
    years_in_business: profile.yearsInBusiness,
    specialties: profile.specialties,
    industry: profile.industry || 'hair',
    annual_goal: profile.annualGoal,
    monthly_goal: profile.monthlyGoal,
    default_rotation: profile.defaultRotation,
    updated_at: new Date().toISOString(),
  };

  let profileId: string;

  if (existing) {
    const { error } = await supabase
      .from('professionals')
      .update(profileData)
      .eq('id', existing.id);

    if (error) return { error };
    profileId = existing.id;
  } else {
    // New user - set 14-day trial
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 14);

    const { data, error } = await supabase
      .from('professionals')
      .insert({
        ...profileData,
        trial_ends_at: trialEndsAt.toISOString(),
        subscription_status: 'none',
      })
      .select('id')
      .single();

    if (error || !data) return { error: error || new Error('Failed to create profile') };
    profileId = data.id;
  }

  // Sync services
  await syncServices(profileId, profile.services);

  return { error: null, profileId };
}

async function syncServices(professionalId: string, services: Service[]): Promise<void> {
  // Delete existing services
  await supabase
    .from('services')
    .delete()
    .eq('professional_id', professionalId);

  // Insert new services
  if (services.length > 0) {
    const serviceData = services.map(s => ({
      id: s.id,
      professional_id: professionalId,
      name: s.name,
      price: s.price,
      category: s.category,
    }));

    await supabase.from('services').insert(serviceData);
  }
}

// ============ CLIENT FUNCTIONS ============

export async function fetchClients(): Promise<Client[]> {
  if (!isSupabaseConfigured) return [];

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  // Get professional ID
  const { data: profile } = await supabase
    .from('professionals')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!profile) return [];

  // Fetch clients with related data
  const { data: clients } = await supabase
    .from('clients')
    .select('*')
    .eq('professional_id', profile.id)
    .order('created_at', { ascending: false });

  if (!clients) return [];

  // Fetch services for mapping
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('professional_id', profile.id);

  const serviceMap = new Map((services || []).map((s: any) => [s.id, dbToService(s)]));

  // Fetch addons, events, and appointments for all clients
  const clientIds = clients.map((c: any) => c.id);

  const [addonsResult, eventsResult, appointmentsResult] = await Promise.all([
    supabase.from('client_addons').select('*').in('client_id', clientIds),
    supabase.from('client_events').select('*').in('client_id', clientIds),
    supabase.from('appointments').select('*').in('client_id', clientIds),
  ]);

  const addonsMap = new Map<string, any[]>();
  (addonsResult.data || []).forEach((a: any) => {
    const list = addonsMap.get(a.client_id) || [];
    list.push(a);
    addonsMap.set(a.client_id, list);
  });

  const eventsMap = new Map<string, any[]>();
  (eventsResult.data || []).forEach((e: any) => {
    const list = eventsMap.get(e.client_id) || [];
    list.push(e);
    eventsMap.set(e.client_id, list);
  });

  const appointmentsMap = new Map<string, any[]>();
  (appointmentsResult.data || []).forEach((a: any) => {
    const list = appointmentsMap.get(a.client_id) || [];
    list.push(a);
    appointmentsMap.set(a.client_id, list);
  });

  return clients.map((c: any) => dbToClient(
    c,
    serviceMap,
    addonsMap.get(c.id) || [],
    eventsMap.get(c.id) || [],
    appointmentsMap.get(c.id) || []
  ));
}

export async function saveClient(client: Client): Promise<{ error: Error | null }> {
  if (!isSupabaseConfigured) {
    return { error: new Error('Supabase not configured') };
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: new Error('Not authenticated') };

  const { data: profile } = await supabase
    .from('professionals')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!profile) return { error: new Error('Profile not found') };

  const clientData = {
    id: client.id,
    professional_id: profile.id,
    name: client.name,
    phone: client.phone || null,
    email: client.email || null,
    notes: client.notes || null,
    status: client.status,
    rotation: client.rotation.toString().toUpperCase() as 'PRIORITY' | 'STANDARD' | 'FLEX',
    rotation_weeks: client.rotationWeeks,
    annual_value: client.annualValue,
    base_service_id: client.baseService?.id || null,
    client_since: client.clientSince,
    next_appointment: client.nextAppointment || null,
    preferred_days: client.preferredDays,
    preferred_time: client.preferredTime || null,
    contact_method: client.contactMethod,
    occupation: client.occupation || null,
    client_facing: client.clientFacing,
    morning_time: client.morningTime || null,
    photographed: client.photographed || null,
    concerns: client.concerns || null,
    service_goal: client.serviceGoal || null,
    maintenance_level: client.maintenanceLevel || null,
    additional_notes: client.additionalNotes || null,
    industry_data: client.industryData || {},
    updated_at: new Date().toISOString(),
  };

  // Upsert client
  const { error } = await supabase
    .from('clients')
    .upsert(clientData, { onConflict: 'id' });

  if (error) return { error };

  // Sync addons
  await supabase.from('client_addons').delete().eq('client_id', client.id);
  if (client.addOns.length > 0) {
    const addonsData = client.addOns.map(a => ({
      client_id: client.id,
      service_id: a.service.id,
      frequency: a.frequency,
    }));
    await supabase.from('client_addons').insert(addonsData);
  }

  // Sync events
  await supabase.from('client_events').delete().eq('client_id', client.id);
  if (client.events.length > 0) {
    const eventsData = client.events.map(e => ({
      client_id: client.id,
      name: e.name,
      date: e.date,
      service_id: e.service?.id || null,
    }));
    await supabase.from('client_events').insert(eventsData);
  }

  // Sync appointments
  await supabase.from('appointments').delete().eq('client_id', client.id);
  if (client.appointments.length > 0) {
    const appointmentsData = client.appointments.map(a => ({
      client_id: client.id,
      date: a.date,
      service_name: a.service,
      price: a.price,
      status: a.status,
    }));
    await supabase.from('appointments').insert(appointmentsData);
  }

  return { error: null };
}

export async function deleteClient(clientId: string): Promise<{ error: Error | null }> {
  if (!isSupabaseConfigured) {
    return { error: new Error('Supabase not configured') };
  }

  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', clientId);

  return { error };
}

// ============ SERVICES FUNCTIONS ============

export async function fetchServices(): Promise<Service[]> {
  if (!isSupabaseConfigured) return [];

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: profile } = await supabase
    .from('professionals')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!profile) return [];

  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('professional_id', profile.id);

  return (services || []).map((s: any) => dbToService(s));
}

// ============ BOOKING FUNCTIONS ============

export async function fetchBookingRequests(): Promise<BookingRequest[]> {
  if (!isSupabaseConfigured) return [];

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: profile } = await supabase
    .from('professionals')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!profile) return [];

  const { data: requests } = await supabase
    .from('booking_requests')
    .select('*')
    .eq('professional_id', profile.id)
    .order('created_at', { ascending: false });

  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('professional_id', profile.id);

  const serviceMap = new Map((services || []).map((s: any) => [s.id, dbToService(s)]));

  return (requests || []).map((r: any) => dbToBookingRequest(r, serviceMap));
}

export async function updateBookingRequest(
  id: string,
  status: 'confirmed' | 'declined' | 'cancelled'
): Promise<{ error: Error | null }> {
  if (!isSupabaseConfigured) {
    return { error: new Error('Supabase not configured') };
  }

  const { error } = await supabase
    .from('booking_requests')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);

  return { error };
}

export async function fetchBookingSettings(): Promise<BookingSettings | null> {
  if (!isSupabaseConfigured) return null;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('professionals')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!profile) return null;

  const { data: settings } = await supabase
    .from('booking_settings')
    .select('*')
    .eq('professional_id', profile.id)
    .single();

  if (!settings) return null;

  return dbToBookingSettings(settings);
}

export async function saveBookingSettings(settings: BookingSettings): Promise<{ error: Error | null }> {
  if (!isSupabaseConfigured) {
    return { error: new Error('Supabase not configured') };
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: new Error('Not authenticated') };

  const { data: profile } = await supabase
    .from('professionals')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!profile) return { error: new Error('Profile not found') };

  const settingsData = {
    professional_id: profile.id,
    profile_slug: settings.profileSlug || null,
    bio: settings.bio || null,
    show_prices: settings.showPrices,
    taking_new_clients: settings.takingNewClients,
    waitlist_mode: settings.waitlistMode,
    require_deposit: settings.requireDeposit,
    deposit_amount: settings.depositAmount,
    deposit_type: settings.depositType,
    minimum_lead_time: settings.minimumLeadTime,
    maximum_advance_booking: settings.maximumAdvanceBooking,
    auto_confirm_existing: settings.autoConfirmExisting,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from('booking_settings')
    .upsert(settingsData, { onConflict: 'professional_id' });

  return { error };
}

// Public function to fetch booking settings by slug (no auth required)
export async function fetchPublicBookingSettings(slug: string): Promise<{
  settings: BookingSettings | null;
  profile: StylistProfile | null;
  services: Service[];
}> {
  if (!isSupabaseConfigured) {
    return { settings: null, profile: null, services: [] };
  }

  const { data: settings } = await supabase
    .from('booking_settings')
    .select('*, professionals(*)')
    .eq('profile_slug', slug)
    .single();

  if (!settings) {
    return { settings: null, profile: null, services: [] };
  }

  const professional = (settings as any).professionals;

  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('professional_id', settings.professional_id);

  return {
    settings: dbToBookingSettings(settings),
    profile: dbToProfile(professional, services || []),
    services: (services || []).map((s: any) => dbToService(s)),
  };
}

// Public function to submit booking request (no auth required)
export async function submitBookingRequest(
  professionalId: string,
  request: Omit<BookingRequest, 'id' | 'status' | 'createdAt'>
): Promise<{ error: Error | null }> {
  if (!isSupabaseConfigured) {
    return { error: new Error('Supabase not configured') };
  }

  const requestData = {
    professional_id: professionalId,
    client_name: request.clientName,
    client_phone: request.clientPhone || null,
    client_email: request.clientEmail || null,
    referral_source: request.referralSource || null,
    contact_method: request.contactMethod || null,
    preferred_days: request.preferredDays,
    preferred_time: request.preferredTime || null,
    occupation: request.occupation || null,
    upcoming_events: request.upcomingEvents || null,
    morning_time: request.morningTime || null,
    service_goal: request.serviceGoal || null,
    maintenance_level: request.maintenanceLevel || null,
    concerns: request.concerns || null,
    requested_service_id: request.requestedService?.id || null,
    requested_date: request.requestedDate || null,
    requested_time_slot: request.requestedTimeSlot || null,
    has_card_on_file: request.hasCardOnFile,
    deposit_paid: request.depositPaid,
    card_last4: request.cardLast4 || null,
    additional_notes: request.additionalNotes || null,
    industry_data: request.industryData || {},
  };

  const { error } = await supabase
    .from('booking_requests')
    .insert(requestData);

  return { error };
}

// ============ CONVERSION HELPERS ============

function dbToProfile(db: any, services: any[]): StylistProfile {
  return {
    name: db.name,
    businessName: db.business_name || '',
    email: db.email,
    phone: db.phone || '',
    location: db.location || '',
    yearsInBusiness: db.years_in_business,
    specialties: db.specialties || [],
    industry: (db.industry || 'hair-stylist') as IndustryType,
    annualGoal: Number(db.annual_goal),
    monthlyGoal: Number(db.monthly_goal),
    defaultRotation: db.default_rotation,
    services: services.map(dbToService),
    // Subscription fields
    stripeCustomerId: db.stripe_customer_id || undefined,
    subscriptionId: db.subscription_id || undefined,
    subscriptionStatus: db.subscription_status || 'none',
    subscriptionCurrentPeriodEnd: db.subscription_current_period_end || undefined,
    trialEndsAt: db.trial_ends_at || undefined,
  };
}

function dbToService(db: any): Service {
  return {
    id: db.id,
    name: db.name,
    price: Number(db.price),
    category: db.category,
  };
}

function dbToClient(
  db: any,
  serviceMap: Map<string, Service>,
  addons: any[],
  events: any[],
  appointments: any[]
): Client {
  const rotationMap: Record<string, RotationType> = {
    'PRIORITY': 'Priority' as unknown as RotationType,
    'STANDARD': 'Standard' as unknown as RotationType,
    'FLEX': 'Flex' as unknown as RotationType,
  };

  return {
    id: db.id,
    name: db.name,
    phone: db.phone || '',
    email: db.email || '',
    rotation: rotationMap[db.rotation] || ('Standard' as unknown as RotationType),
    rotationWeeks: db.rotation_weeks,
    baseService: db.base_service_id ? serviceMap.get(db.base_service_id) || null : null,
    addOns: addons.map(a => ({
      service: serviceMap.get(a.service_id) || { id: a.service_id, name: 'Unknown', price: 0, category: 'addon' as const },
      frequency: a.frequency,
    })),
    annualValue: Number(db.annual_value),
    nextAppointment: db.next_appointment || '',
    clientSince: db.client_since,
    preferredDays: db.preferred_days || [],
    preferredTime: db.preferred_time || '',
    contactMethod: db.contact_method,
    occupation: db.occupation || '',
    clientFacing: db.client_facing,
    morningTime: db.morning_time || '',
    events: events.map(e => ({
      name: e.name,
      date: e.date,
      service: e.service_id ? serviceMap.get(e.service_id) || null : null,
    })),
    photographed: db.photographed || '',
    concerns: db.concerns || '',
    serviceGoal: db.service_goal || '',
    maintenanceLevel: db.maintenance_level || '',
    additionalNotes: db.additional_notes || '',
    industryData: (db.industry_data as Record<string, string>) || {},
    appointments: appointments.map(a => ({
      date: a.date,
      service: a.service_name || '',
      price: Number(a.price),
      status: a.status as 'completed' | 'upcoming' | 'scheduled' | 'event',
    })),
    notes: db.notes || '',
    status: db.status,
  };
}

function dbToBookingRequest(db: any, serviceMap: Map<string, Service>): BookingRequest {
  return {
    id: db.id,
    status: db.status,
    createdAt: db.created_at,
    clientName: db.client_name,
    clientPhone: db.client_phone || '',
    clientEmail: db.client_email || '',
    referralSource: db.referral_source || '',
    contactMethod: db.contact_method || '',
    preferredDays: db.preferred_days || [],
    preferredTime: db.preferred_time || '',
    occupation: db.occupation || '',
    upcomingEvents: db.upcoming_events || '',
    morningTime: db.morning_time || '',
    serviceGoal: db.service_goal || '',
    maintenanceLevel: db.maintenance_level || '',
    concerns: db.concerns || '',
    requestedService: db.requested_service_id ? serviceMap.get(db.requested_service_id) || null : null,
    requestedAddOns: [],
    requestedDate: db.requested_date || '',
    requestedTimeSlot: db.requested_time_slot || '',
    additionalNotes: db.additional_notes || '',
    hasCardOnFile: db.has_card_on_file,
    depositPaid: db.deposit_paid,
    cardLast4: db.card_last4 || undefined,
    industryData: (db.industry_data as Record<string, string>) || {},
  };
}

function dbToBookingSettings(db: any): BookingSettings {
  return {
    profileSlug: db.profile_slug || '',
    bio: db.bio || '',
    showPrices: db.show_prices,
    takingNewClients: db.taking_new_clients,
    waitlistMode: db.waitlist_mode,
    requireDeposit: db.require_deposit,
    depositAmount: Number(db.deposit_amount),
    depositType: db.deposit_type,
    minimumLeadTime: db.minimum_lead_time as '24' | '48' | '72' | '168',
    maximumAdvanceBooking: db.maximum_advance_booking as '14' | '30' | '60' | '90',
    autoConfirmExisting: db.auto_confirm_existing,
  };
}
