-- Rename collector_item table to collectoritem
ALTER TABLE collector_item RENAME TO collectoritem;

-- Update foreign key constraints
ALTER TABLE item_image RENAME CONSTRAINT item_image_item_id_fkey TO item_image_item_id_fkey_new;
ALTER TABLE item_document RENAME CONSTRAINT item_document_item_id_fkey TO item_document_item_id_fkey_new;
ALTER TABLE verification_request RENAME CONSTRAINT verification_request_item_id_fkey TO verification_request_item_id_fkey_new;

-- Update indexes
ALTER INDEX ix_item_owner RENAME TO ix_item_owner_new;
ALTER INDEX ix_item_category RENAME TO ix_item_category_new; 