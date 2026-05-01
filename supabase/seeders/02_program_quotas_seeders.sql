-- Seeders for program_quotas
-- Year: 2026
-- Program Type: biofloc_thematic

INSERT INTO program_quotas (province_id, program_type, year, quota_limit)
VALUES
  ('11', 'biofloc_thematic', 2026, 10),
  ('12', 'biofloc_thematic', 2026, 15),
  ('13', 'biofloc_thematic', 2026, 10),
  ('14', 'biofloc_thematic', 2026, 8),
  ('15', 'biofloc_thematic', 2026, 5),
  ('16', 'biofloc_thematic', 2026, 12),
  ('17', 'biofloc_thematic', 2026, 5),
  ('18', 'biofloc_thematic', 2026, 15),
  ('19', 'biofloc_thematic', 2026, 5),
  ('21', 'biofloc_thematic', 2026, 5),
  ('31', 'biofloc_thematic', 2026, 5),
  ('32', 'biofloc_thematic', 2026, 30),
  ('33', 'biofloc_thematic', 2026, 20),
  ('34', 'biofloc_thematic', 2026, 10),
  ('35', 'biofloc_thematic', 2026, 25),
  ('36', 'biofloc_thematic', 2026, 15),
  ('51', 'biofloc_thematic', 2026, 10),
  ('52', 'biofloc_thematic', 2026, 10),
  ('53', 'biofloc_thematic', 2026, 8),
  ('61', 'biofloc_thematic', 2026, 10),
  ('62', 'biofloc_thematic', 2026, 8),
  ('63', 'biofloc_thematic', 2026, 10),
  ('64', 'biofloc_thematic', 2026, 10),
  ('65', 'biofloc_thematic', 2026, 5),
  ('71', 'biofloc_thematic', 2026, 10),
  ('72', 'biofloc_thematic', 2026, 8),
  ('73', 'biofloc_thematic', 2026, 15),
  ('74', 'biofloc_thematic', 2026, 8),
  ('75', 'biofloc_thematic', 2026, 5),
  ('76', 'biofloc_thematic', 2026, 5),
  ('81', 'biofloc_thematic', 2026, 8),
  ('82', 'biofloc_thematic', 2026, 5),
  ('91', 'biofloc_thematic', 2026, 10),
  ('92', 'biofloc_thematic', 2026, 5),
  ('93', 'biofloc_thematic', 2026, 5),
  ('94', 'biofloc_thematic', 2026, 5),
  ('95', 'biofloc_thematic', 2026, 5),
  ('96', 'biofloc_thematic', 2026, 5)
ON CONFLICT (province_id, program_type, year) 
DO UPDATE SET quota_limit = EXCLUDED.quota_limit;
