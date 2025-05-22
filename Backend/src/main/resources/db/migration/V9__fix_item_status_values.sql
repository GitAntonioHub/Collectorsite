-- Fix any items with incorrect status 'ACTIVE' to the correct 'AVAILABLE' status
UPDATE collector_item SET status = 'AVAILABLE' WHERE status = 'ACTIVE';

-- Add a comment explaining the status values
COMMENT ON COLUMN collector_item.status IS 'Valid values: DRAFT, AVAILABLE, LISTED, SOLD, TRADED'; 