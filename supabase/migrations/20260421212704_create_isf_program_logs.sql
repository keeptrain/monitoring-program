CREATE TABLE IF NOT EXISTS isf_program_logs (
  id UUID PRIMARY KEY,
  step_id INTEGER NOT NULL CHECK (step_id BETWEEN 1 AND 7),

  progress_percent INTEGER CHECK (progress_percent BETWEEN 0 AND 100),
  progress_date DATE NOT NULL,
  reporting_week DATE NOT NULL,

  name TEXT NOT NULL,
  status TEXT NOT NULL,
  provider_name TEXT NOT NULL,
  production TEXT NOT NULL,
  intervention TEXT NOT NULL,
  total_worker INTEGER NOT NULL CHECK (total_worker >= 0),

  outcome TEXT NOT NULL,
  constraints TEXT NOT NULL,
  follow_up TEXT NOT NULL,

  s_curve_path TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(step_id, progress_date)
);

-- Trigger untuk update updated_at otomatis
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_isf_program_logs_updated_at
    BEFORE UPDATE ON isf_program_logs
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- Index yang dioptimalkan untuk View (sesuai urutan ORDER BY)
CREATE INDEX idx_logs_step_reporting_latest 
ON isf_program_logs (step_id, reporting_week DESC, created_at DESC);

CREATE INDEX idx_logs_date 
ON isf_program_logs (progress_date);

-- View untuk mengambil log terbaru per step
CREATE OR REPLACE VIEW latest_isf_logs AS
SELECT DISTINCT ON (step_id)
  id,
  step_id,
  progress_percent,
  progress_date,
  reporting_week,
  name,
  status,
  provider_name,
  production,
  intervention,
  total_worker,
  outcome,
  constraints,
  follow_up,
  s_curve_path,
  created_at,
  updated_at
FROM isf_program_logs
ORDER BY step_id, reporting_week DESC, created_at DESC;

GRANT ALL ON TABLE isf_program_logs TO anon, authenticated, service_role;
GRANT SELECT ON latest_isf_logs TO anon, authenticated, service_role;