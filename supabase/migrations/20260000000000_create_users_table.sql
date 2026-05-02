-- Create Users table with scoped role management
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

-- Partial unique index to allow multiple soft-deleted users with same email
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_active ON public.users(email) WHERE (deleted_at IS NULL);

-- Disable RLS
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE users TO anon, authenticated, service_role;
