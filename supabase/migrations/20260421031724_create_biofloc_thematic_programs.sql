CREATE TABLE IF NOT EXISTS biofloc_thematic_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id BIGINT NOT NULL REFERENCES kdmp_entities(id),
  location_id BIGINT REFERENCES available_locations(id),
  proposal_id UUID UNIQUE REFERENCES proposal_biofloc_thematic_programs(id),

  -- Status & Tahun
  status VARCHAR(20) NOT NULL CHECK (status IN ('potential','active','inactive')),
  fiscal_year INTEGER NOT NULL DEFAULT 2026,

  -- Program Operational (TIDAK ada di proposal)
  progress_percent INTEGER CHECK (progress_percent BETWEEN 0 AND 100) DEFAULT 0,
  commodity_aid TEXT NOT NULL,
  commodity_potential TEXT,
  land_area TEXT NOT NULL,
  distribution_amount INTEGER NOT NULL DEFAULT 0,
  production_value TEXT NOT NULL,
  sppg_partner TEXT NOT NULL,
  address TEXT NOT NULL DEFAULT '',
  s_curve_path TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for relationship
CREATE INDEX idx_biofloc_programs_location ON biofloc_thematic_programs (location_id);
CREATE INDEX idx_biofloc_programs_entity ON biofloc_thematic_programs (entity_id);
CREATE INDEX idx_biofloc_programs_proposal_unique ON biofloc_thematic_programs (proposal_id);

-- Index for searching and filtering
CREATE INDEX idx_biofloc_programs_status ON biofloc_thematic_programs (status);
CREATE INDEX idx_biofloc_programs_year ON biofloc_thematic_programs (fiscal_year);

GRANT ALL ON TABLE biofloc_thematic_programs TO anon, authenticated, service_role;
