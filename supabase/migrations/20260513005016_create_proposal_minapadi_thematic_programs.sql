CREATE TABLE IF NOT EXISTS proposal_minapadi_thematic_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id BIGINT NOT NULL REFERENCES kdmp_entities(id),
  location_id BIGINT NOT NULL REFERENCES available_locations(id),

  -- Status & Review
  status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','approved','rejected','revision','converted')),
  user_id UUID REFERENCES public.users(id),
  reviewed_by UUID REFERENCES public.users(id) DEFAULT NULL,
  reviewed_at TIMESTAMPTZ DEFAULT NULL,
  rejection_reason TEXT DEFAULT NULL,
  admin_notes TEXT DEFAULT NULL,

  -- Proposal-specific data
  land_slope DECIMAL(5,2),
  has_land_preparation_letter BOOLEAN DEFAULT FALSE,
  proposed_commodity TEXT,
  has_experienced_member BOOLEAN DEFAULT FALSE,
  commodity_potentials TEXT[],
  other_commodity_potential TEXT,
  proposal_path TEXT NOT NULL,
  fiscal_year INTEGER DEFAULT 2026,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXING for proposals
CREATE INDEX idx_minapadi_proposals_status ON proposal_minapadi_thematic_programs (status);
CREATE INDEX idx_minapadi_proposals_year ON proposal_minapadi_thematic_programs (fiscal_year);
CREATE INDEX idx_minapadi_proposals_entity ON proposal_minapadi_thematic_programs (entity_id);
CREATE INDEX idx_minapadi_proposals_location ON proposal_minapadi_thematic_programs (location_id);

GRANT ALL ON TABLE proposal_minapadi_thematic_programs TO anon, authenticated, service_role;


