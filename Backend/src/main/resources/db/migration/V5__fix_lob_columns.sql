ALTER TABLE collector_item
    ALTER COLUMN description TYPE text USING description::text;

ALTER TABLE verification_request
    ALTER COLUMN notes TYPE text USING notes::text;

ALTER TABLE notification
    ALTER COLUMN payload_json TYPE text USING payload_json::text;
