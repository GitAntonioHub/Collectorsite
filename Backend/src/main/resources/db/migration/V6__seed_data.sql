-- ==== Demo Users ====
-- Passwords are all 'password123' hashed with BCrypt
INSERT INTO app_user (id, username, email, password_hash, display_name, created_at) 
VALUES  
  ('2c937e90-388e-4e0d-9b8d-863df7f25f63', 'alice', 'alice@example.com', 
   '$2a$10$Gj.08PTY4YLRNLAgRRbJCO1MyLUALG9K4CUItMNA74xf5UxSZd.BC', 'Alice Collector', NOW()),
  ('6d2cea90-a130-4d08-8eb1-69edfc307253', 'bob', 'bob@example.com', 
   '$2a$10$Gj.08PTY4YLRNLAgRRbJCO1MyLUALG9K4CUItMNA74xf5UxSZd.BC', 'Bob Trader', NOW()),
  ('930efd31-5a59-4473-9edf-1cbaa7b0d6aa', 'carol', 'carol@example.com', 
   '$2a$10$Gj.08PTY4YLRNLAgRRbJCO1MyLUALG9K4CUItMNA74xf5UxSZd.BC', 'Carol Admin', NOW());

-- Assign roles to users
INSERT INTO user_roles (user_id, role_id)
SELECT '2c937e90-388e-4e0d-9b8d-863df7f25f63'::uuid, id FROM role WHERE name = 'ROLE_USER'
UNION ALL
SELECT '6d2cea90-a130-4d08-8eb1-69edfc307253'::uuid, id FROM role WHERE name = 'ROLE_USER'
UNION ALL
SELECT '930efd31-5a59-4473-9edf-1cbaa7b0d6aa'::uuid, id FROM role WHERE name = 'ROLE_USER'
UNION ALL
SELECT '930efd31-5a59-4473-9edf-1cbaa7b0d6aa'::uuid, id FROM role WHERE name = 'ROLE_ADMIN';

-- ==== Demo Categories ====
INSERT INTO category (id, name, parent_id)
VALUES
    ('afd24b05-5bdd-4ffe-b7ed-51a26e34a6fc', 'Stamps', NULL),
    ('5bd391e5-7f3c-4195-a949-45f99c2b183b', 'Coins', NULL),
    ('fd69c8f3-c9ef-4971-a2df-b402d112677d', 'Trading Cards', NULL),
    ('43ae5d35-51e4-4f20-8fe4-48a8b21bf6ec', 'Antiques', NULL),
    ('e874c65d-11c7-4c2c-9e65-c5f5b7f76bd3', 'Postal', 'afd24b05-5bdd-4ffe-b7ed-51a26e34a6fc'),
    ('7af6bcb4-7aaf-47ed-a652-14c9fb922ef7', 'Commemorative', 'afd24b05-5bdd-4ffe-b7ed-51a26e34a6fc');

-- ==== Demo Items ====
INSERT INTO collector_item (id, owner_id, category_id, title, description, condition, year, estimated_value, status, created_at)
VALUES
    ('a7d98a8f-eac5-4d7e-9f1b-465f8100b5b7', '2c937e90-388e-4e0d-9b8d-863df7f25f63'::uuid, 'e874c65d-11c7-4c2c-9e65-c5f5b7f76bd3'::uuid, 
    'Penny Black Stamp', 'Original penny black stamp from 1840, first adhesive postal stamp', 'EXCELLENT', 1840, 1200.00, 'VERIFIED', NOW()),
    
    ('b48cfc3e-c8e6-4722-a0e2-10e45d93c06f', '2c937e90-388e-4e0d-9b8d-863df7f25f63'::uuid, '5bd391e5-7f3c-4195-a949-45f99c2b183b'::uuid, 
    '1909 VDB Lincoln Cent', 'Rare penny with designer initials VDB, good condition', 'GOOD', 1909, 950.00, 'LISTED', NOW()),
    
    ('d543a9d0-eb3f-4b73-92c0-23d8202d913d', '6d2cea90-a130-4d08-8eb1-69edfc307253'::uuid, 'fd69c8f3-c9ef-4971-a2df-b402d112677d'::uuid, 
    'Charizard First Edition Holographic', 'Original Pokémon card from 1999, holographic', 'NEAR_MINT', 1999, 5000.00, 'LISTED', NOW()),
    
    ('f091a880-cd0f-4fa1-9772-3a367d9c0f47', '6d2cea90-a130-4d08-8eb1-69edfc307253'::uuid, '43ae5d35-51e4-4f20-8fe4-48a8b21bf6ec'::uuid, 
    'Victorian Pocket Watch', 'Sterling silver pocket watch, still working', 'USED', 1880, 750.00, 'DRAFT', NOW());

-- ==== Demo Images ====
INSERT INTO item_image (id, item_id, url, is_primary)
VALUES
    ('b0ae221d-fc11-4709-a2cf-c553a6ef6c2a', 'a7d98a8f-eac5-4d7e-9f1b-465f8100b5b7'::uuid, 'https://via.placeholder.com/300?text=Penny+Black+Stamp', true),
    ('c24850a3-eb7a-4e68-90b7-2f05c8094f40', 'b48cfc3e-c8e6-4722-a0e2-10e45d93c06f'::uuid, 'https://via.placeholder.com/300?text=1909+VDB+Lincoln+Cent', true),
    ('2e3c5b36-1e3a-47df-8d3e-8c9e06c14e33', 'd543a9d0-eb3f-4b73-92c0-23d8202d913d'::uuid, 'https://via.placeholder.com/300?text=Charizard+Card', true),
    ('4e64ac47-6a31-47b8-9617-a2a643e053ee', 'f091a880-cd0f-4fa1-9772-3a367d9c0f47'::uuid, 'https://via.placeholder.com/300?text=Pocket+Watch', true);
    
-- ==== Demo Listings ====
INSERT INTO listing (id, item_id, seller_id, listing_type, price, currency, status, start_date)
VALUES
    ('71e2dae8-7f20-4948-adb3-895cc64a028e', 'a7d98a8f-eac5-4d7e-9f1b-465f8100b5b7'::uuid, '2c937e90-388e-4e0d-9b8d-863df7f25f63'::uuid, 'SALE', 1200.00, 'USD', 'ACTIVE', NOW()),
    ('039c4fe9-9c0a-4251-8138-6ae266f508fd', 'b48cfc3e-c8e6-4722-a0e2-10e45d93c06f'::uuid, '2c937e90-388e-4e0d-9b8d-863df7f25f63'::uuid, 'SALE', 950.00, 'USD', 'ACTIVE', NOW()),
    ('f3dbf14a-b9ed-46bb-ae08-7f9eb06e3370', 'd543a9d0-eb3f-4b73-92c0-23d8202d913d'::uuid, '6d2cea90-a130-4d08-8eb1-69edfc307253'::uuid, 'SALE', 5000.00, 'USD', 'ACTIVE', NOW());

-- ==== Demo Trade Offers ====
INSERT INTO trade_offer (id, offering_user_id, receiving_user_id, offered_item_id, requested_item_id, status, created_at)
VALUES
    ('2db694d1-3aa5-4859-b4a3-97ae8113d7fa', '2c937e90-388e-4e0d-9b8d-863df7f25f63'::uuid, '6d2cea90-a130-4d08-8eb1-69edfc307253'::uuid, 
    'a7d98a8f-eac5-4d7e-9f1b-465f8100b5b7'::uuid, 'd543a9d0-eb3f-4b73-92c0-23d8202d913d'::uuid, 'PENDING',
    NOW()); 