CREATE TABLE program_priority_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  available_location_id UUID REFERENCES available_locations(id),
  name TEXT NOT NULL,
  provider_type TEXT CHECK(provider_type IN('private', 'institution')),
  percentage_of_work INTEGER CHECK (percentage_of_work BETWEEN 0 AND 100),
  status TEXT CHECK (status IN ('HUB', 'NON-HUB')),
  constraints TEXT,
  follow_up TEXT,
  documentations JSONB DEFAULT '[]', -- Structure: {id, image_before_path, image_after_path, created_at}
  created_at TIMESTAMPTZ DEFAULT NOW()
);
