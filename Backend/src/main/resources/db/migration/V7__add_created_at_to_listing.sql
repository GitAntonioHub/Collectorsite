-- Add the created_at column to the listing table
ALTER TABLE listing ADD COLUMN created_at TIMESTAMP;

-- Update existing records to have the same value as start_date
UPDATE listing SET created_at = start_date;

-- Make the column not nullable after populating it
ALTER TABLE listing ALTER COLUMN created_at SET NOT NULL; 