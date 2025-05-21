-- Adjust the payload_json column type to TEXT to fix validation failure
ALTER TABLE IF EXISTS notification ALTER COLUMN payload_json TYPE TEXT; 