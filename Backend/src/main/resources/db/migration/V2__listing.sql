/********************************************************************
 *  V2 -- Listings (fixed‑price + auction) and basic indices
 *******************************************************************/
CREATE TYPE listing_type    AS ENUM ('SALE', 'AUCTION');
CREATE TYPE listing_status  AS ENUM ('ACTIVE', 'CLOSED', 'CANCELLED');

CREATE TABLE listing (
                         id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                         item_id      UUID UNIQUE NOT NULL,                -- one live listing per item
                         seller_id    UUID NOT NULL,
                         listing_type listing_type NOT NULL DEFAULT 'SALE',
                         price        NUMERIC(12,2) NOT NULL,
                         currency     CHAR(3)      NOT NULL DEFAULT 'USD',
                         start_date   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
                         end_date     TIMESTAMPTZ,
                         status       listing_status NOT NULL DEFAULT 'ACTIVE',

                         FOREIGN KEY (item_id)   REFERENCES collector_item(id) ON DELETE CASCADE,
                         FOREIGN KEY (seller_id) REFERENCES app_user(id)       ON DELETE CASCADE
);

CREATE INDEX ix_listing_status     ON listing (status);
CREATE INDEX ix_listing_start_date ON listing (start_date);
/********************************************************************/
