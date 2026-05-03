CREATE TABLE IF NOT EXISTS proposal_biofloc_thematic_programs (
  id UUID PRIMARY KEY,
  entity_id BIGINT NOT NULL REFERENCES kdmp_entities(id),
  location_id BIGINT NOT NULL REFERENCES available_locations(id),

  -- Status & Review
  status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','approved','rejected','revision','converted')),
  user_id UUID REFERENCES auth.users(id),
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMPTZ,
  rejection_reason TEXT,
  admin_notes TEXT,

  -- Proposal-specific data (TIDAK ada di biofloc_thematic)
  land_slope DECIMAL(5,2),
  has_land_preparation_letter BOOLEAN DEFAULT FALSE,
  proposed_commodity TEXT,
  has_experienced_member BOOLEAN DEFAULT FALSE,
  commodity_potentials TEXT[],
  other_commodity_potential TEXT,
  proposal_path TEXT NOT NULL,
  fiscal_year INTEGER DEFAULT 2025,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXING: Agar pencarian status dan tahun secepat kilat
CREATE INDEX idx_proposals_status ON proposal_biofloc_thematic_programs (status);
CREATE INDEX idx_proposals_fiscal_year ON proposal_biofloc_thematic_programs (fiscal_year);
CREATE INDEX idx_proposals_entity ON proposal_biofloc_thematic_programs (entity_id);
CREATE INDEX idx_proposals_location ON proposal_biofloc_thematic_programs (location_id);

GRANT ALL ON TABLE proposal_biofloc_thematic_programs TO anon, authenticated, service_role;
