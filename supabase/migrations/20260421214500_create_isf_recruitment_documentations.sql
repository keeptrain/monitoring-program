-- Create recruitment documentations table 
-- phase: 1: Sosialisasi, 2: Seleksi, 3: Pelatihan, 4: Penempatan
CREATE TABLE IF NOT EXISTS isf_recruitment_documentations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phase SMALLINT NOT NULL, -- 1: Sosialisasi, 2: Seleksi, 3: Pelatihan, 4: Penempatan
    file_path TEXT NOT NULL,
    file_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexing for fast lookups by phase
CREATE INDEX IF NOT EXISTS idx_isf_recruitment_documentations_phase ON isf_recruitment_documentations(phase);

-- Allow public delete access
CREATE POLICY "Allow public delete access" ON isf_recruitment_documentations
    FOR DELETE USING (true);

-- Grant permissions to roles
GRANT ALL ON TABLE isf_recruitment_documentations TO anon, authenticated, service_role;

-- Enable RLS
ALTER TABLE isf_recruitment_documentations ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON isf_recruitment_documentations
    FOR SELECT USING (true);

-- Allow public insert access
CREATE POLICY "Allow public insert access" ON isf_recruitment_documentations
    FOR INSERT WITH CHECK (true);
