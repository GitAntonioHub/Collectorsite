-- Rename columns to match JPA entity field names with proper _id suffixes
-- First drop existing foreign key constraints
ALTER TABLE verification_request DROP CONSTRAINT IF EXISTS verification_request_item_id_fkey;
ALTER TABLE verification_request DROP CONSTRAINT IF EXISTS verification_request_requested_by_fkey;
ALTER TABLE verification_request DROP CONSTRAINT IF EXISTS verification_request_verified_by_fkey;

-- Rename the columns to include _id suffix for consistency
ALTER TABLE verification_request RENAME COLUMN requested_by TO requested_by_id;
ALTER TABLE verification_request RENAME COLUMN verified_by TO verified_by_id;

-- Recreate the foreign key constraints with the new column names
ALTER TABLE verification_request 
    ADD CONSTRAINT verification_request_item_id_fkey 
    FOREIGN KEY (item_id) REFERENCES collector_item(id) ON DELETE CASCADE;

ALTER TABLE verification_request 
    ADD CONSTRAINT verification_request_requested_by_id_fkey 
    FOREIGN KEY (requested_by_id) REFERENCES app_user(id) ON DELETE CASCADE;

ALTER TABLE verification_request 
    ADD CONSTRAINT verification_request_verified_by_id_fkey 
    FOREIGN KEY (verified_by_id) REFERENCES app_user(id) ON DELETE SET NULL; 