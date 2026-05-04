-- =============================================================================
-- SEEDERS FOR FISCAL YEAR 2026 (BIOFLOC PROPOSALS & POTENTIAL PROGRAMS)
-- Normalized Structure: Entities -> Locations -> Proposals -> Potential Programs
-- =============================================================================

-- 1. SEED KDMP ENTITIES (Identity)
INSERT INTO kdmp_entities (id, name, kusuka_number, member_count, board_member_count)
VALUES
  (2000, 'KDMP Gandaria', '3603000000002000', 10, 5),
  (2001, 'KDMP Buaran', '3674000000002001', 12, 4),
  (2002, 'KDMP Aweh', '3602000000002002', 15, 7),
  (2003, 'KDMP Tambak', '3602000000002003', 11, 3),
  (2004, 'KDMP Curugbitung', '3602000000002004', 18, 6)
ON CONFLICT (id) DO NOTHING;

-- 2. SEED AVAILABLE LOCATIONS (Geography linked to ref_wilayah)
INSERT INTO available_locations (id, province_code, province_name, regency_code, type, name, latitude, longitude)
VALUES
  (2000, '36', 'Banten', '36.03', 'biofloc_thematic', 'KDMP Gandaria', -6.097327, 106.408187),
  (2001, '36', 'Banten', '36.74', 'biofloc_thematic', 'KDMP Buaran', -6.340005, 106.692447),
  (2002, '36', 'Banten', '36.02', 'biofloc_thematic', 'KDMP Aweh', -6.368215, 106.229359),
  (2003, '36', 'Banten', '36.02', 'biofloc_thematic', 'KDMP Tambak', -6.445566, 106.29631),
  (2004, '36', 'Banten', '36.02', 'biofloc_thematic', 'KDMP Curugbitung', -6.43304, 106.39379)
ON CONFLICT (id) DO NOTHING;

-- 3. SEED PROPOSALS (Step 3 fields included)
INSERT INTO proposal_biofloc_thematic_programs (id, entity_id, location_id, status, proposal_path, fiscal_year, land_slope, proposed_commodity)
VALUES
  ('018f3d8e-2026-7000-8000-000000002000', 2000, 2000, 'pending', 'proposals/sample_1.pdf', 2026, 2.5, 'Lele'),
  ('018f3d8e-2026-7000-8000-000000002001', 2001, 2001, 'pending', 'proposals/sample_2.pdf', 2026, 1.0, 'Nila'),
  ('018f3d8e-2026-7000-8000-000000002002', 2002, 2002, 'pending', 'proposals/sample_3.pdf', 2026, 0.5, 'Lele'),
  ('018f3d8e-2026-7000-8000-000000002003', 2003, 2003, 'pending', 'proposals/sample_4.pdf', 2026, 3.0, 'Nila'),
  ('018f3d8e-2026-7000-8000-000000002004', 2004, 2004, 'pending', 'proposals/sample_5.pdf', 2026, 1.5, 'Lele')
ON CONFLICT (id) DO NOTHING;

-- 4. SEED POTENTIAL PROGRAMS (Fiscal Year 2026)
-- These are proposals that have been converted to potential programs
INSERT INTO biofloc_thematic_programs (id, entity_id, location_id, proposal_id, status, fiscal_year, commodity_aid, land_area, sppg_partner, address)
VALUES
  ('018f3d8e-3000-7000-8000-000000002000', 2000, 2000, '018f3d8e-2026-7000-8000-000000002000', 'potential', 2026, 'Lele', '100 m2', 'Satker Pusat', 'Gandaria, Mekar Baru'),
  ('018f3d8e-3000-7000-8000-000000002001', 2001, 2001, '018f3d8e-2026-7000-8000-000000002001', 'potential', 2026, 'Nila', '100 m2', 'Satker Pusat', 'Buaran, Serpong')
ON CONFLICT (id) DO NOTHING;
