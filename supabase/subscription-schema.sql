-- Subscription fields for professionals table
-- Run this in Supabase SQL Editor

-- Add subscription columns to professionals table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'professionals' AND column_name = 'stripe_customer_id'
  ) THEN
    ALTER TABLE professionals ADD COLUMN stripe_customer_id TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'professionals' AND column_name = 'subscription_id'
  ) THEN
    ALTER TABLE professionals ADD COLUMN subscription_id TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'professionals' AND column_name = 'subscription_status'
  ) THEN
    ALTER TABLE professionals ADD COLUMN subscription_status TEXT DEFAULT 'none';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'professionals' AND column_name = 'subscription_current_period_end'
  ) THEN
    ALTER TABLE professionals ADD COLUMN subscription_current_period_end TIMESTAMPTZ;
  END IF;
END $$;

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_professionals_stripe_customer ON professionals(stripe_customer_id);
