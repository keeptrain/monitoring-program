-- Seeder for Users and Assignments using UUID v7 format
-- This matches the MOCK_USERS in auth-actions.ts

DO $$ 
BEGIN
    -- Function to handle both inserts
    CREATE OR REPLACE FUNCTION tmp_insert_user(u_id UUID, u_email TEXT, u_role TEXT, u_scope TEXT) 
    RETURNS void AS $inner$
    BEGIN
        INSERT INTO public.users (id, email, password, name)
        VALUES (u_id, u_email, '$2b$10$butL0aioHOGw.SirhrTBaOXXSzXXj28Ykw3fPk4oWTVcpLogNAveu', INITCAP(REPLACE(SPLIT_PART(u_email, '@', 1), 'pm', 'PMO ')))
        ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;

        INSERT INTO public.user_assignments (user_id, role, program_scope)
        VALUES (u_id, u_role, u_scope)
        ON CONFLICT (user_id, role, program_scope) DO NOTHING;
    END;
    $inner$ LANGUAGE plpgsql;

    -- PMO Users (UUID v7 format)
    PERFORM tmp_insert_user('018f32a0-0001-7000-8000-000000000001', 'pmobioflok@test.com', 'pmo', 'biofloc');
    PERFORM tmp_insert_user('018f32a0-0002-7000-8000-000000000002', 'pmominapadi@test.com', 'pmo', 'minapadi');
    PERFORM tmp_insert_user('018f32a0-0003-7000-8000-000000000003', 'pmoisf@test.com', 'pmo', 'isf');
    PERFORM tmp_insert_user('018f32a0-0004-7000-8000-000000000004', 'pmorevitalisasi@test.com', 'pmo', 'revitalisasi');

    -- Officer Users
    PERFORM tmp_insert_user('018f32a0-0005-7000-8000-000000000005', 'petugasbioflok@test.com', 'officer', 'biofloc');
    PERFORM tmp_insert_user('018f32a0-0006-7000-8000-000000000006', 'petugasminapadi@test.com', 'officer', 'minapadi');
    PERFORM tmp_insert_user('018f32a0-0007-7000-8000-000000000007', 'petugasisf@test.com', 'officer', 'isf');
    PERFORM tmp_insert_user('018f32a0-0008-7000-8000-000000000008', 'petugasrevitalisasi@test.com', 'officer', 'revitalisasi');

    -- Admin Users
    PERFORM tmp_insert_user('018f32a0-0009-7000-8000-000000000009', 'adminbioflok@test.com', 'admin', 'biofloc');
    PERFORM tmp_insert_user('018f32a0-000a-7000-8000-00000000000a', 'adminminapadi@test.com', 'admin', 'minapadi');
    PERFORM tmp_insert_user('018f32a0-000b-7000-8000-00000000000b', 'adminisf@test.com', 'admin', 'isf');
    PERFORM tmp_insert_user('018f32a0-000c-7000-8000-00000000000c', 'adminrevitalisasi@test.com', 'admin', 'revitalisasi');

    -- Super Admin
    PERFORM tmp_insert_user('018f32a0-000d-7000-8000-00000000000d', 'admin@test.com', 'admin', 'all');

    -- Cleanup
    DROP FUNCTION tmp_insert_user(UUID, TEXT, TEXT, TEXT);
END $$;
