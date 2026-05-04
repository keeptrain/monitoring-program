-- Seeders for program_quotas
-- Year: 2026
-- Program Type: biofloc_thematic

INSERT INTO program_quotas (province_code, province_name, program_type, year, quota_limit)
VALUES
  ('11', 'Aceh', 'biofloc_thematic', 2026, 10),
  ('12', 'Sumatera Utara', 'biofloc_thematic', 2026, 15),
  ('13', 'Sumatera Barat', 'biofloc_thematic', 2026, 10),
  ('14', 'Riau', 'biofloc_thematic', 2026, 8),
  ('15', 'Jambi', 'biofloc_thematic', 2026, 5),
  ('16', 'Sumatera Selatan', 'biofloc_thematic', 2026, 12),
  ('17', 'Bengkulu', 'biofloc_thematic', 2026, 5),
  ('18', 'Lampung', 'biofloc_thematic', 2026, 15),
  ('19', 'Kepulauan Bangka Belitung', 'biofloc_thematic', 2026, 5),
  ('21', 'Kepulauan Riau', 'biofloc_thematic', 2026, 5),
  ('31', 'Daerah Khusus Ibukota Jakarta', 'biofloc_thematic', 2026, 5),
  ('32', 'Jawa Barat', 'biofloc_thematic', 2026, 30),
  ('33', 'Jawa Tengah', 'biofloc_thematic', 2026, 20),
  ('34', 'Daerah Istimewa Yogyakarta', 'biofloc_thematic', 2026, 10),
  ('35', 'Jawa Timur', 'biofloc_thematic', 2026, 25),
  ('36', 'Banten', 'biofloc_thematic', 2026, 15),
  ('51', 'Bali', 'biofloc_thematic', 2026, 10),
  ('52', 'Nusa Tenggara Barat', 'biofloc_thematic', 2026, 10),
  ('53', 'Nusa Tenggara Timur', 'biofloc_thematic', 2026, 8),
  ('61', 'Kalimantan Barat', 'biofloc_thematic', 2026, 10),
  ('62', 'Kalimantan Tengah', 'biofloc_thematic', 2026, 8),
  ('63', 'Kalimantan Selatan', 'biofloc_thematic', 2026, 10),
  ('64', 'Kalimantan Timur', 'biofloc_thematic', 2026, 10),
  ('65', 'Kalimantan Utara', 'biofloc_thematic', 2026, 5),
  ('71', 'Sulawesi Utara', 'biofloc_thematic', 2026, 10),
  ('72', 'Sulawesi Tengah', 'biofloc_thematic', 2026, 8),
  ('73', 'Sulawesi Selatan', 'biofloc_thematic', 2026, 15),
  ('74', 'Sulawesi Tenggara', 'biofloc_thematic', 2026, 8),
  ('75', 'Gorontalo', 'biofloc_thematic', 2026, 5),
  ('76', 'Sulawesi Barat', 'biofloc_thematic', 2026, 5),
  ('81', 'Maluku', 'biofloc_thematic', 2026, 8),
  ('82', 'Maluku Utara', 'biofloc_thematic', 2026, 5),
  ('91', 'Papua', 'biofloc_thematic', 2026, 10),
  ('92', 'Papua Barat', 'biofloc_thematic', 2026, 5),
  ('93', 'Papua Selatan', 'biofloc_thematic', 2026, 5),
  ('94', 'Papua Tengah', 'biofloc_thematic', 2026, 5),
  ('95', 'Papua Pegunungan', 'biofloc_thematic', 2026, 5),
  ('96', 'Papua Barat Daya', 'biofloc_thematic', 2026, 5)
ON CONFLICT (province_code, program_type, year) 
DO UPDATE SET quota_limit = EXCLUDED.quota_limit, province_name = EXCLUDED.province_name;
