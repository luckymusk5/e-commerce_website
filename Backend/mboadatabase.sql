-- Mboa Market / mboadatabase
-- PostgreSQL schema for authentication and purchase history.
-- Django creates its built-in auth_user and session tables through migrations.

CREATE DATABASE mboadatabase;

\connect mboadatabase;

CREATE TABLE IF NOT EXISTS mboa_accounts_customerprofile (
    id BIGSERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE REFERENCES auth_user(id) ON DELETE CASCADE,
    phone VARCHAR(30) NOT NULL DEFAULT '',
    city VARCHAR(100) NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mboa_accounts_purchase (
    id BIGSERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES auth_user(id) ON DELETE CASCADE,
    reference VARCHAR(40) NOT NULL UNIQUE,
    total_amount NUMERIC(12, 2) NOT NULL CHECK (total_amount >= 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'XAF',
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS mboa_purchase_user_created_idx
    ON mboa_accounts_purchase (user_id, created_at DESC);

-- Never store raw passwords in application tables.
-- Django stores password hashes in auth_user.password.
