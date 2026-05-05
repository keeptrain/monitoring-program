-- === PROVINSI ===
CREATE TABLE IF NOT EXISTS ref_provinces (
  code TEXT PRIMARY KEY,       -- '11', '32', '33'
  name TEXT NOT NULL            -- 'Aceh', 'Jawa Barat'
);
CREATE INDEX IF NOT EXISTS idx_ref_provinces_name ON ref_provinces (name);

-- === KABUPATEN/KOTA ===
CREATE TABLE IF NOT EXISTS ref_regencies (
  code TEXT PRIMARY KEY,                              -- '11.01', '32.01'
  province_code TEXT NOT NULL REFERENCES ref_provinces(code),
  name TEXT NOT NULL                                   -- 'Kabupaten Aceh Selatan'
);
CREATE INDEX IF NOT EXISTS idx_ref_regencies_province ON ref_regencies (province_code);
CREATE INDEX IF NOT EXISTS idx_ref_regencies_name ON ref_regencies (name);

-- === KECAMATAN ===
CREATE TABLE IF NOT EXISTS ref_districts (
  code TEXT PRIMARY KEY,                              -- '11.01.01', '32.01.01'
  regency_code TEXT NOT NULL REFERENCES ref_regencies(code),
  name TEXT NOT NULL                                   -- 'Bakongan'
);
CREATE INDEX IF NOT EXISTS idx_ref_districts_regency ON ref_districts (regency_code);
CREATE INDEX IF NOT EXISTS idx_ref_districts_name ON ref_districts (name);

-- === DESA/KELURAHAN ===
CREATE TABLE IF NOT EXISTS ref_villages (
  code TEXT PRIMARY KEY,                              -- '11.01.01.2001'
  district_code TEXT NOT NULL REFERENCES ref_districts(code),
  name TEXT NOT NULL                                   -- 'Keude Bakongan'
);
CREATE INDEX IF NOT EXISTS idx_ref_villages_district ON ref_villages (district_code);
CREATE INDEX IF NOT EXISTS idx_ref_villages_name ON ref_villages (name);

GRANT SELECT ON TABLE ref_provinces, ref_regencies, ref_districts, ref_villages
  TO anon, authenticated, service_role;
