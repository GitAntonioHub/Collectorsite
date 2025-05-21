-- Fix LOB column types for PostgreSQL compatibility
-- payload_json field should be TEXT

ALTER TABLE notification 
    ALTER COLUMN payload_json TYPE TEXT;

-- Fix any other TEXT/CLOB fields that need explicit type definition
ALTER TABLE collector_item
    ALTER COLUMN description TYPE TEXT;

ALTER TABLE verification_request
    ALTER COLUMN notes TYPE text USING notes::text;
