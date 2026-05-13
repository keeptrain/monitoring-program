-- 5 Seeders for Minapadi Thematic Programs 2025

INSERT INTO kdmp_entities (id, name, kusuka_number, kusuka_verified, nib, legal_entity_number, chairman_name, chairman_phone, companion_name, companion_phone, board_member_count, member_count)
VALUES
  (100, 'Koperasi Minapadi Makmur Satu', '3246353979210001', false, '91294121001', 'AHU-11111.AH.01.01.2025', 'Agus Supriyanto', '08123456789', 'Budi Santoso', '08123456789', 3, 20),
  (101, 'Koperasi Minapadi Makmur Dua', '3246353979210002', false, '91294121002', 'AHU-22222.AH.01.01.2025', 'Joko Widodo', '08123456789', 'Budi Santoso', '08123456789', 4, 25),
  (102, 'Koperasi Minapadi Makmur Tiga', '3246353979210003', false, '91294121003', 'AHU-33333.AH.01.01.2025', 'Ahmad Dhani', '08123456789', 'Budi Santoso', '08123456789', 5, 30),
  (103, 'Koperasi Minapadi Makmur Empat', '3246353979210004', false, '91294121004', 'AHU-44444.AH.01.01.2025', 'Susi Pudjiastuti', '08123456789', 'Budi Santoso', '08123456789', 3, 15),
  (104, 'Koperasi Minapadi Makmur Lima', '3246353979210005', false, '91294121005', 'AHU-55555.AH.01.01.2025', 'Iwan Fals', '08123456789', 'Budi Santoso', '08123456789', 5, 22)
ON CONFLICT (id) DO NOTHING;

INSERT INTO available_locations (id, province_code, province_name, regency_code, district_code, village_code, type, name, latitude, longitude)
VALUES
  (100, '32', 'Jawa Barat', '32.17', '32.17.10', '32.17.10.2005', 'minapadi_thematic', 'Koperasi Minapadi Makmur Satu', -6.930958, 107.467557),
  (101, '33', 'Jawa Tengah', '33.02', '33.02.18', '33.02.18.2012', 'minapadi_thematic', 'Koperasi Minapadi Makmur Dua', -7.381342, 109.187218),
  (102, '35', 'Jawa Timur', '35.10', '35.10.23', '35.10.23.2001', 'minapadi_thematic', 'Koperasi Minapadi Makmur Tiga', -8.413615, 114.14276),
  (103, '34', 'Daerah Istimewa Yogyakarta', '34.02', '34.02.02', '34.02.02.2001', 'minapadi_thematic', 'Koperasi Minapadi Makmur Empat', 7.968132, 110.253772),
  (104, '32', 'Jawa Barat', '32.17', '32.17.12', '32.17.12.2011', 'minapadi_thematic', 'Koperasi Minapadi Makmur Lima', -6.936992, 107.373418)
ON CONFLICT (id) DO NOTHING;

INSERT INTO minapadi_thematic_programs (id, entity_id, location_id, status, fiscal_year, progress_percent, commodity_aid, commodity_potential, land_area, distribution_amount, production_value, sppg_partner, address, s_curve_path)
VALUES
  ('018f3d8e-2000-7000-8000-000000000001', 100, 100, 'active', 2025, 100, 'Nila', 'Padi', '1000 m2', 200000000, '5 Ton', 'Dinas Kelautan dan Perikanan', 'Alamat Minapadi Satu', NULL),
  ('018f3d8e-2000-7000-8000-000000000002', 101, 101, 'active', 2025, 80, 'Ikan Mas', 'Padi', '1500 m2', 250000000, '8 Ton', 'Dinas Kelautan dan Perikanan', 'Alamat Minapadi Dua', NULL),
  ('018f3d8e-2000-7000-8000-000000000003', 102, 102, 'potential', 2025, 0, 'Lele', 'Padi', '2000 m2', 150000000, '0 Ton', 'Dinas Kelautan dan Perikanan', 'Alamat Minapadi Tiga', NULL),
  ('018f3d8e-2000-7000-8000-000000000004', 103, 103, 'active', 2025, 50, 'Nila', 'Padi', '1200 m2', 180000000, '2 Ton', 'Dinas Kelautan dan Perikanan', 'Alamat Minapadi Empat', NULL),
  ('018f3d8e-2000-7000-8000-000000000005', 104, 104, 'inactive', 2025, 10, 'Nila', 'Padi', '800 m2', 120000000, '1 Ton', 'Dinas Kelautan dan Perikanan', 'Alamat Minapadi Lima', NULL)
ON CONFLICT (id) DO NOTHING;

SELECT setval(pg_get_serial_sequence('kdmp_entities', 'id'), COALESCE(MAX(id), 0) + 1, false) FROM kdmp_entities;
SELECT setval(pg_get_serial_sequence('available_locations', 'id'), COALESCE(MAX(id), 0) + 1, false) FROM available_locations;
