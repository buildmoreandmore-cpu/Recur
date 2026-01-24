-- Add trial_ends_at column to professionals table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'professionals' AND column_name = 'trial_ends_at'
  ) THEN
    ALTER TABLE professionals ADD COLUMN trial_ends_at TIMESTAMPTZ;
  END IF;
END $$;

-- Set default trial for new signups (14 days from now)
-- This will be set by the application when creating new professionals
