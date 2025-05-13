/********************************************************************
 *  V4 -- Transactions & basic payment status
 *******************************************************************/
CREATE TYPE payment_status AS ENUM ('PENDING','PAID','REFUNDED','FAILED');

CREATE TABLE transaction (
                             id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                             listing_id      UUID,
                             trade_offer_id  UUID,
                             buyer_id        UUID NOT NULL,
                             seller_id       UUID NOT NULL,
                             total_price     NUMERIC(12,2) NOT NULL,
                             payment_status  payment_status NOT NULL DEFAULT 'PENDING',
                             shipped_at      TIMESTAMPTZ,
                             delivered_at    TIMESTAMPTZ,
                             completed_at    TIMESTAMPTZ,

                             CONSTRAINT fk_listing      FOREIGN KEY (listing_id)     REFERENCES listing(id),
                             CONSTRAINT fk_trade_offer  FOREIGN KEY (trade_offer_id) REFERENCES trade_offer(id),
                             CONSTRAINT fk_buyer        FOREIGN KEY (buyer_id)       REFERENCES app_user(id),
                             CONSTRAINT fk_seller       FOREIGN KEY (seller_id)      REFERENCES app_user(id)
);

CREATE INDEX ix_tx_buyer   ON transaction (buyer_id);
CREATE INDEX ix_tx_seller  ON transaction (seller_id);
CREATE INDEX ix_tx_status  ON transaction (payment_status);
/********************************************************************/
