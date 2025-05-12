/********************************************************************
 *  Flyway  V1__initial_schema.sql
 *  Collector‑Items Marketplace – core schema
 *  Compatible with PostgreSQL 13+
 *******************************************************************/

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========= 1. Security & Identity =========

CREATE TABLE app_user (
                          id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                          username         VARCHAR(50)  NOT NULL,
                          email            VARCHAR(255) NOT NULL,
                          password_hash    VARCHAR(255) NOT NULL,
                          display_name     VARCHAR(100),
                          avatar_url       TEXT,
                          rating           NUMERIC(3,2) DEFAULT 0,           -- 0.00 – 5.00
                          created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
                          last_login       TIMESTAMPTZ
);

CREATE UNIQUE INDEX ux_user_username ON app_user (username);
CREATE UNIQUE INDEX ux_user_email    ON app_user (email);

CREATE TABLE role (
                      id   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                      name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE user_roles (
                            user_id UUID NOT NULL,
                            role_id UUID NOT NULL,
                            PRIMARY KEY (user_id, role_id),
                            FOREIGN KEY (user_id) REFERENCES app_user(id) ON DELETE CASCADE,
                            FOREIGN KEY (role_id) REFERENCES role(id)     ON DELETE CASCADE
);

CREATE TABLE address (
                         id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                         user_id      UUID  NOT NULL,
                         line1        VARCHAR(120) NOT NULL,
                         line2        VARCHAR(120),
                         city         VARCHAR(60)  NOT NULL,
                         state        VARCHAR(60),
                         country      VARCHAR(60)  NOT NULL,
                         postal_code  VARCHAR(20),
                         is_default   BOOLEAN DEFAULT FALSE,
                         FOREIGN KEY (user_id) REFERENCES app_user(id) ON DELETE CASCADE
);

CREATE INDEX ix_address_user  ON address (user_id);

-- ========= 2. Catalogue =========

CREATE TABLE category (
                          id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                          name       VARCHAR(100) NOT NULL,
                          parent_id  UUID,
                          FOREIGN KEY (parent_id) REFERENCES category(id) ON DELETE SET NULL
);

CREATE UNIQUE INDEX ux_category_name_parent ON category (name, parent_id);

CREATE TABLE collector_item (
                                id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                                owner_id        UUID NOT NULL,
                                category_id     UUID,
                                title           VARCHAR(150) NOT NULL,
                                description     TEXT,
                                condition       VARCHAR(30),      -- consider enum later
                                year            INT,
                                estimated_value NUMERIC(12,2),
                                status          VARCHAR(30) DEFAULT 'DRAFT',
                                created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                                FOREIGN KEY (owner_id)    REFERENCES app_user(id)   ON DELETE CASCADE,
                                FOREIGN KEY (category_id) REFERENCES category(id)   ON DELETE SET NULL
);

CREATE INDEX ix_item_owner     ON collector_item (owner_id);
CREATE INDEX ix_item_category  ON collector_item (category_id);

CREATE TABLE item_image (
                            id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                            item_id    UUID NOT NULL,
                            url        TEXT NOT NULL,
                            is_primary BOOLEAN DEFAULT FALSE,
                            FOREIGN KEY (item_id) REFERENCES collector_item(id) ON DELETE CASCADE
);

CREATE INDEX ix_image_item ON item_image (item_id);

CREATE TABLE item_document (
                               id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                               item_id     UUID NOT NULL,
                               type        VARCHAR(50) NOT NULL,
                               file_path   TEXT NOT NULL,
                               uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                               FOREIGN KEY (item_id) REFERENCES collector_item(id) ON DELETE CASCADE
);

CREATE INDEX ix_doc_item ON item_document (item_id);

-- ========= 3. Verification Workflow =========

CREATE TABLE verification_request (
                                      id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                                      item_id       UUID NOT NULL,
                                      requested_by  UUID NOT NULL,
                                      status        VARCHAR(30) NOT NULL DEFAULT 'PENDING',
                                      verified_by   UUID,
                                      requested_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                                      verified_at   TIMESTAMPTZ,
                                      notes         TEXT,
                                      FOREIGN KEY (item_id)      REFERENCES collector_item(id) ON DELETE CASCADE,
                                      FOREIGN KEY (requested_by) REFERENCES app_user(id)       ON DELETE CASCADE,
                                      FOREIGN KEY (verified_by)  REFERENCES app_user(id)       ON DELETE SET NULL
);

CREATE INDEX ix_verif_status ON verification_request (status);
CREATE INDEX ix_verif_item   ON verification_request (item_id);

-- ========= 4. Seed basic roles =========

INSERT INTO role (id, name) VALUES
                                (uuid_generate_v4(), 'ROLE_USER'),
                                (uuid_generate_v4(), 'ROLE_ADMIN'),
                                (uuid_generate_v4(), 'ROLE_VERIFIER');

/********************************************************************
 *  End of V1 migration
 *******************************************************************/
