-- Create new V3__create_trade_offer.sql
CREATE TABLE trade_offer (
                             id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                             offering_user_id UUID NOT NULL,
                             receiving_user_id UUID NOT NULL,
                             offered_item_id UUID NOT NULL,
                             requested_item_id UUID NOT NULL,
                             status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
                             created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                             updated_at TIMESTAMPTZ,
                             FOREIGN KEY (offering_user_id) REFERENCES app_user(id),
                             FOREIGN KEY (receiving_user_id) REFERENCES app_user(id),
                             FOREIGN KEY (offered_item_id) REFERENCES collector_item(id),
                             FOREIGN KEY (requested_item_id) REFERENCES collector_item(id)
);