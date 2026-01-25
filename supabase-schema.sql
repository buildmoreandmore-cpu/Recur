-- Recur App Database Schema
-- Run this in your Supabase SQL Editor

-- ============================================
-- CORE TABLES
-- ============================================

-- Professionals (users)
CREATE TABLE professionals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  name TEXT NOT NULL,
  business_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  location TEXT,
  years_in_business INTEGER DEFAULT 0,
  specialties TEXT[] DEFAULT '{}',
  industry TEXT DEFAULT 'hair',
  annual_goal NUMERIC DEFAULT 0,
  monthly_goal NUMERIC DEFAULT 0,
  default_rotation INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services offered by professionals
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID REFERENCES professionals(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  category TEXT CHECK (category IN ('base', 'addon', 'event')) DEFAULT 'base',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clients
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID REFERENCES professionals(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  notes TEXT,
  status TEXT CHECK (status IN ('confirmed', 'pending', 'at-risk')) DEFAULT 'confirmed',
  rotation TEXT CHECK (rotation IN ('PRIORITY', 'STANDARD', 'FLEX', 'CUSTOM')) DEFAULT 'STANDARD',
  rotation_weeks INTEGER DEFAULT 10,
  annual_value NUMERIC DEFAULT 0,
  base_service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  client_since DATE DEFAULT CURRENT_DATE,
  next_appointment DATE,
  preferred_days TEXT[] DEFAULT '{}',
  preferred_time TEXT,
  contact_method TEXT DEFAULT 'Text',
  occupation TEXT,
  client_facing BOOLEAN DEFAULT FALSE,
  morning_time TEXT,
  photographed TEXT,
  concerns TEXT,
  service_goal TEXT,
  maintenance_level TEXT,
  additional_notes TEXT,
  industry_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Client add-ons (many-to-many with frequency)
CREATE TABLE client_addons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  frequency TEXT DEFAULT 'Every visit',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Client events
CREATE TABLE client_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  date DATE NOT NULL,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Appointments
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  service_name TEXT,
  price NUMERIC DEFAULT 0,
  status TEXT CHECK (status IN ('completed', 'upcoming', 'scheduled', 'event', 'cancelled')) DEFAULT 'scheduled',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Booking requests (from public booking page)
CREATE TABLE booking_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID REFERENCES professionals(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'declined', 'cancelled')) DEFAULT 'pending',
  client_name TEXT NOT NULL,
  client_phone TEXT,
  client_email TEXT,
  referral_source TEXT,
  contact_method TEXT,
  preferred_days TEXT[] DEFAULT '{}',
  preferred_time TEXT,
  occupation TEXT,
  upcoming_events TEXT,
  morning_time TEXT,
  service_goal TEXT,
  maintenance_level TEXT,
  concerns TEXT,
  requested_service_id UUID REFERENCES services(id),
  requested_date DATE,
  requested_time_slot TEXT,
  has_card_on_file BOOLEAN DEFAULT FALSE,
  deposit_paid BOOLEAN DEFAULT FALSE,
  card_last4 TEXT,
  additional_notes TEXT,
  industry_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Booking settings
CREATE TABLE booking_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID REFERENCES professionals(id) ON DELETE CASCADE UNIQUE,
  profile_slug TEXT UNIQUE,
  bio TEXT,
  show_prices BOOLEAN DEFAULT TRUE,
  taking_new_clients BOOLEAN DEFAULT TRUE,
  waitlist_mode BOOLEAN DEFAULT FALSE,
  require_deposit BOOLEAN DEFAULT FALSE,
  deposit_amount NUMERIC DEFAULT 50,
  deposit_type TEXT CHECK (deposit_type IN ('fixed', 'percentage')) DEFAULT 'fixed',
  minimum_lead_time TEXT DEFAULT '24',
  maximum_advance_booking TEXT DEFAULT '30',
  auto_confirm_existing BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User preferences
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID REFERENCES professionals(id) ON DELETE CASCADE UNIQUE,
  email_notifications BOOLEAN DEFAULT TRUE,
  overdue_alerts BOOLEAN DEFAULT TRUE,
  weekly_summary BOOLEAN DEFAULT TRUE,
  payment_confirmations BOOLEAN DEFAULT TRUE,
  currency TEXT DEFAULT 'USD',
  date_format TEXT DEFAULT 'MM/DD/YYYY',
  start_of_week TEXT DEFAULT 'Sunday',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Waitlist entries
CREATE TABLE waitlist_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID REFERENCES professionals(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  service_interested TEXT,
  notes TEXT,
  date_added DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist_entries ENABLE ROW LEVEL SECURITY;

-- Professionals: users can only access their own profile
CREATE POLICY "Users can view own profile" ON professionals
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON professionals
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON professionals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow public to view professional info for public booking pages
CREATE POLICY "Public can view professionals for booking" ON professionals
  FOR SELECT USING (
    id IN (SELECT professional_id FROM booking_settings WHERE profile_slug IS NOT NULL)
  );

-- Services: professionals can manage their own services
CREATE POLICY "Professionals can manage own services" ON services
  FOR ALL USING (
    professional_id IN (SELECT id FROM professionals WHERE user_id = auth.uid())
  );

-- Allow public to view services for booking pages
CREATE POLICY "Public can view services for booking" ON services
  FOR SELECT USING (
    professional_id IN (SELECT professional_id FROM booking_settings WHERE profile_slug IS NOT NULL)
  );

-- Clients: professionals can manage their own clients
CREATE POLICY "Professionals can manage own clients" ON clients
  FOR ALL USING (
    professional_id IN (SELECT id FROM professionals WHERE user_id = auth.uid())
  );

-- Client addons
CREATE POLICY "Manage own client_addons" ON client_addons
  FOR ALL USING (
    client_id IN (SELECT id FROM clients WHERE professional_id IN
      (SELECT id FROM professionals WHERE user_id = auth.uid()))
  );

-- Client events
CREATE POLICY "Manage own client_events" ON client_events
  FOR ALL USING (
    client_id IN (SELECT id FROM clients WHERE professional_id IN
      (SELECT id FROM professionals WHERE user_id = auth.uid()))
  );

-- Appointments
CREATE POLICY "Manage own appointments" ON appointments
  FOR ALL USING (
    client_id IN (SELECT id FROM clients WHERE professional_id IN
      (SELECT id FROM professionals WHERE user_id = auth.uid()))
  );

-- Booking requests - professionals can manage their own
CREATE POLICY "Manage own booking_requests" ON booking_requests
  FOR ALL USING (
    professional_id IN (SELECT id FROM professionals WHERE user_id = auth.uid())
  );

-- Public can submit booking requests (insert only)
CREATE POLICY "Public can submit booking requests" ON booking_requests
  FOR INSERT WITH CHECK (true);

-- Booking settings - public read for booking flow
CREATE POLICY "Public can view booking settings by slug" ON booking_settings
  FOR SELECT USING (true);

CREATE POLICY "Manage own booking_settings" ON booking_settings
  FOR ALL USING (
    professional_id IN (SELECT id FROM professionals WHERE user_id = auth.uid())
  );

-- User preferences
CREATE POLICY "Manage own preferences" ON user_preferences
  FOR ALL USING (
    professional_id IN (SELECT id FROM professionals WHERE user_id = auth.uid())
  );

-- Waitlist entries
CREATE POLICY "Manage own waitlist" ON waitlist_entries
  FOR ALL USING (
    professional_id IN (SELECT id FROM professionals WHERE user_id = auth.uid())
  );

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX idx_professionals_user_id ON professionals(user_id);
CREATE INDEX idx_services_professional_id ON services(professional_id);
CREATE INDEX idx_clients_professional_id ON clients(professional_id);
CREATE INDEX idx_client_addons_client_id ON client_addons(client_id);
CREATE INDEX idx_client_events_client_id ON client_events(client_id);
CREATE INDEX idx_appointments_client_id ON appointments(client_id);
CREATE INDEX idx_booking_requests_professional_id ON booking_requests(professional_id);
CREATE INDEX idx_booking_settings_professional_id ON booking_settings(professional_id);
CREATE INDEX idx_booking_settings_slug ON booking_settings(profile_slug);

-- Add payment tracking columns to appointments (run if table exists)
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS payment_method TEXT;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS payment_amount NUMERIC;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS payment_note TEXT;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS arrived_late BOOLEAN DEFAULT false;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS missed_reason TEXT CHECK (missed_reason IN ('no-show', 'late-cancel', 'cancelled', 'rescheduled'));
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ;

-- Update status check to include new statuses
ALTER TABLE appointments DROP CONSTRAINT IF EXISTS appointments_status_check;
ALTER TABLE appointments ADD CONSTRAINT appointments_status_check
  CHECK (status IN ('completed', 'upcoming', 'scheduled', 'event', 'cancelled', 'no-show', 'late-cancel'));
