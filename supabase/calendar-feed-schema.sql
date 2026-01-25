-- Calendar Feed Token for Auto-Sync
-- This allows users to subscribe to their calendar feed without authentication
-- The token provides secure, revocable access to the calendar data

-- Add calendar_feed_token column to professionals table
ALTER TABLE professionals
ADD COLUMN IF NOT EXISTS calendar_feed_token TEXT;

-- Create an index for faster token lookups
CREATE INDEX IF NOT EXISTS idx_professionals_calendar_feed_token
ON professionals(calendar_feed_token)
WHERE calendar_feed_token IS NOT NULL;

-- Optional: Add a comment for documentation
COMMENT ON COLUMN professionals.calendar_feed_token IS 'Secure token for calendar subscription feed access. Can be regenerated to revoke access.';
