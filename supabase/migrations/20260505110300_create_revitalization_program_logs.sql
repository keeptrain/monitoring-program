-- Create revitalization program logs table
CREATE TABLE IF NOT EXISTS revitalization_program_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  area_id INTEGER NOT NULL, -- 1: bekasi, 2: karawang, 3: subang, 4: indramayu
  
  progress_percent INTEGER CHECK (progress_percent BETWEEN 0 AND 100),
  progress_date DATE NOT NULL,
  reporting_week DATE NOT NULL,

  name TEXT NOT NULL,
  status TEXT NOT NULL,
  provider_name TEXT NOT NULL,
  production TEXT NOT NULL,
  intervention TEXT NOT NULL,

  total_worker INTEGER NOT NULL CHECK (total_worker >= 0),
  total_production_value INTEGER NOT NULL CHECK (total_production_value >= 0),
  limit_point_measurement TEXT NOT NULL,
  limit_pal INTEGER NOT NULL CHECK (limit_pal >= 0),

  outcome TEXT NOT NULL,
  constraints TEXT NOT NULL,
  follow_up TEXT NOT NULL,

  design_path TEXT NULL,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID NULL REFERENCES public.users(id),

  UNIQUE(area_id, progress_date)
);

-- Automatic updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_revitalization_program_logs_updated_at
    BEFORE UPDATE ON revitalization_program_logs
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- Optimized index for latest lookup
CREATE INDEX idx_revit_logs_area_reporting_latest 
ON revitalization_program_logs (area_id, reporting_week DESC, created_at DESC);

-- View to get the latest log for each revitalization area
CREATE OR REPLACE VIEW latest_revitalization_logs AS
SELECT DISTINCT ON (area_id)
  id,
  area_id,
  progress_percent,
  progress_date,
  reporting_week,
  name,
  status,
  provider_name,
  production,
  intervention,
  total_worker,
  total_production_value,
  limit_point_measurement,
  limit_pal,
  outcome,
  constraints,
  follow_up,
  design_path,
  created_at,
  updated_at,
  created_by
FROM revitalization_program_logs
ORDER BY area_id, reporting_week DESC, created_at DESC;

-- Permissions
GRANT ALL ON TABLE revitalization_program_logs TO anon, authenticated, service_role;
GRANT SELECT ON latest_revitalization_logs TO anon, authenticated, service_role;
