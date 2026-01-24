-- Stripe Connect Integration Schema
-- Run this in Supabase SQL Editor to add the necessary tables

-- Stripe Connect accounts for professionals
CREATE TABLE IF NOT EXISTS stripe_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID REFERENCES professionals(id) ON DELETE CASCADE UNIQUE,
  stripe_account_id TEXT NOT NULL UNIQUE,
  charges_enabled BOOLEAN DEFAULT FALSE,
  payouts_enabled BOOLEAN DEFAULT FALSE,
  details_submitted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE stripe_accounts ENABLE ROW LEVEL SECURITY;

-- Policy: Professionals can only view their own stripe account
CREATE POLICY "View own stripe account" ON stripe_accounts
  FOR SELECT USING (
    professional_id IN (SELECT id FROM professionals WHERE user_id = auth.uid())
  );

-- Stripe customers (clients who have made payments to a professional)
CREATE TABLE IF NOT EXISTS stripe_customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID REFERENCES professionals(id) ON DELETE CASCADE,
  client_email TEXT NOT NULL,
  stripe_customer_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(professional_id, client_email)
);

ALTER TABLE stripe_customers ENABLE ROW LEVEL SECURITY;

-- Policy: Professionals can manage their own customers
CREATE POLICY "Manage own customers" ON stripe_customers
  FOR ALL USING (
    professional_id IN (SELECT id FROM professionals WHERE user_id = auth.uid())
  );

-- Payment records
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_request_id UUID REFERENCES booking_requests(id),
  professional_id UUID REFERENCES professionals(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT UNIQUE,
  amount INTEGER NOT NULL, -- Amount in cents
  currency TEXT DEFAULT 'usd',
  status TEXT DEFAULT 'pending', -- pending, succeeded, failed, canceled
  payment_type TEXT DEFAULT 'deposit', -- deposit or full
  client_email TEXT,
  card_last4 TEXT,
  card_brand TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Policy: Professionals can view their own payments
CREATE POLICY "View own payments" ON payments
  FOR SELECT USING (
    professional_id IN (SELECT id FROM professionals WHERE user_id = auth.uid())
  );

-- Add payment fields to booking_requests if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'booking_requests' AND column_name = 'stripe_payment_intent_id'
  ) THEN
    ALTER TABLE booking_requests ADD COLUMN stripe_payment_intent_id TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'booking_requests' AND column_name = 'payment_status'
  ) THEN
    ALTER TABLE booking_requests ADD COLUMN payment_status TEXT DEFAULT 'none';
  END IF;
END $$;

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_stripe_accounts_professional ON stripe_accounts(professional_id);
CREATE INDEX IF NOT EXISTS idx_payments_professional ON payments(professional_id);
CREATE INDEX IF NOT EXISTS idx_payments_booking_request ON payments(booking_request_id);
CREATE INDEX IF NOT EXISTS idx_stripe_customers_professional ON stripe_customers(professional_id);
