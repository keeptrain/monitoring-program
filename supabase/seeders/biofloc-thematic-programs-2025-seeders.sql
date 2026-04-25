-- Seeders for Biofloc Thematic Programs 2025
-- Including Documentations referencing program ids

-- Row 1: Koperasi Desa Merah Putih Mekarmukti
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Kp Cicalengka, Desa Mekarmukti', -6.93095800, 107.46755700)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-001', 'Koperasi Desa Merah Putih Mekarmukti', 100, 
        'Nila', 'Kp Cicalengka, Desa Mekarmukti, Kecamatan Cihampelas, Mekarmukti, Cihampelas, Kab. Bandung Barat, Jawa Barat, 40562', '1,250 kg', 5, 2100, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 2: Koperasi Desa Merah Putih Mekarsari
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Mekarsari', -6.93699167, 107.37341833)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-002', 'Koperasi Desa Merah Putih Mekarsari', 100, 
        'Lele', 'Jl. Desa Mekarsari, Desa Mekarsari, Kecamatan Cipongkor, Bandung Barat, Mekarsari, Cipongkor, Kab. Bandung Barat, Jawa Barat, 40564', '980 kg', 3, 4500, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 3: Koperasi Desa Merah Putih Babakan
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Babakan', -7.38134200, 109.18721800)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-003', 'Koperasi Desa Merah Putih Babakan', 100, 
        'Lele', 'Jl. Raya Babakan, Desa Babakan, Kecamatan Karawelas, Babakan, Karanglewas, Kab. Banyumas, Jawa Tengah, 53161', '1,120 kg', 8, 3200, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 4: Koperasi Desa Merah Putih Dawuhan
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Dawuhan', -7.51902000, 109.26344500)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-004', 'Koperasi Desa Merah Putih Dawuhan', 100, 
        'Lele', 'Jl. Pesarean Adipati Mrapat, Desa Dawuhan, Kec. Banyumas, Banyumas, Dawuhan, Banyumas, Kab. Banyumas, Jawa Tengah, 53192', '1,050 kg', 4, 1500, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 5: Koperasi Desa Merah Putih Wiradadi
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Wiradadi', -7.47024700, 109.26086400)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-005', 'Koperasi Desa Merah Putih Wiradadi', 100, 
        'Lele', 'KDMP Wiradadi, Kecamatan Sokaraja, Kab. Banyumas', '850 kg', 6, 2800, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 6: Koperasi Desa Merah Putih Karangrau
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Karangrau', -7.470247, 109.260864)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-006', 'Koperasi Desa Merah Putih Karangrau', 100, 
        'Lele', 'Jl. Raya Karangrau, Desa Karangrau, Kec. Banyumas, Banyumas, Karangrau, Banyumas, Kab. Banyumas, Jawa Tengah, 53192', '1,769 kg', 10, 3921, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 7: Koperasi Desa Merah Putih Jatisaba
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Jatisaba', -7.380426, 109.128271)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-007', 'Koperasi Desa Merah Putih Jatisaba', 100, 
        'Lele', 'Jl. Raya Jatisaba, Desa Jatisaba, Kec. Cilongok, Banyumas, Jatisaba, Cilongok, Kab. Banyumas, Jawa Tengah, 53162', '1,174 kg', 1, 1515, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 8: Koperasi Desa Merah Putih Banyuputih
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Banyuputih', -6.99845, 109.755866)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-008', 'Koperasi Desa Merah Putih Banyuputih', 100, 
        'Lele', 'Jl. Raya Banyuputih, Desa Banyuputih, Kec. Banyuputih, Batang, Banyuputih, Banyuputih, Kab. Batang, Jawa Tengah, 51271', '1,663 kg', 1, 2525, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 9: Koperasi Desa Merah Putih Sembung
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Sembung', -6.99572, 109.781935)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-009', 'Koperasi Desa Merah Putih Sembung', 100, 
        'Lele', 'Jl. Raya Sembung, Desa Sembung, Kec. Banyuputih, Batang, Sembung, Banyuputih, Kab. Batang, Jawa Tengah, 51271', '1,066 kg', 2, 4976, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 10: Koperasi Desa Merah Putih Karangdinoyo
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Karangdinoyo', -7.1639444, 111.5662222)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-010', 'Koperasi Desa Merah Putih Karangdinoyo', 100, 
        'Lele', 'Jl. Raya Karangdinoyo, Desa Karangdinoyo, Kec. Sumberrejo, Bojonegoro, Karangdinoyo, Sumberrejo, Kab. Bojonegoro, Jawa Timur, 62191', '1,931 kg', 4, 3969, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 11: Koperasi Desa Merah Putih Kedungrejo
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Kedungrejo', -6.9784, 111.319)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-011', 'Koperasi Desa Merah Putih Kedungrejo', 100, 
        'Lele', 'Jl. Raya Kedungrejo, Desa Kedungrejo, Kec. Malo, Bojonegoro, Kedungrejo, Malo, Kab. Bojonegoro, Jawa Timur, 62152', '1,152 kg', 7, 3907, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 12: Koperasi Desa Merah Putih Ngraho
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Ngraho', -6.9555721, 111.4110661)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-012', 'Koperasi Desa Merah Putih Ngraho', 100, 
        'Lele', 'Jl. Raya Ngraho, Desa Ngraho, Kec. Ngraho, Bojonegoro, Ngraho, Ngraho, Kab. Bojonegoro, Jawa Timur, 62165', '1,823 kg', 10, 1968, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 13: Koperasi Desa Merah Putih Tambakrejo
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Tambakrejo', -6.9957222, 111.417)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-013', 'Koperasi Desa Merah Putih Tambakrejo', 100, 
        'Lele', 'Jl. Raya Tambakrejo, Desa Tambakrejo, Kec. Tambakrejo, Bojonegoro, Tambakrejo, Tambakrejo, Kab. Bojonegoro, Jawa Timur, 62161', '1,714 kg', 1, 3721, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 14: Koperasi Desa Merah Putih Kebonagung
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Kebonagung', -7.5044316, 110.7155962)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-014', 'Koperasi Desa Merah Putih Kebonagung', 100, 
        'Lele', 'Jl. Raya Kebonagung, Desa Kebonagung, Kec. Ngemplak, Boyolali, Kebonagung, Ngemplak, Kab. Boyolali, Jawa Tengah, 57191', '1,343 kg', 10, 3110, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 15: Koperasi Desa Merah Putih Donohudan
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Donohudan', -7.3244764, 110.6188918)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-015', 'Koperasi Desa Merah Putih Donohudan', 100, 
        'Lele', 'Jl. Raya Donohudan, Desa Donohudan, Kec. Ngemplak, Boyolali, Donohudan, Ngemplak, Kab. Boyolali, Jawa Tengah, 57191', '1,858 kg', 10, 4771, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 16: Koperasi Desa Merah Putih Sawahan
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Sawahan', -7.3771504, 110.7690012)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-016', 'Koperasi Desa Merah Putih Sawahan', 100, 
        'Lele', 'Jl. Raya Sawahan, Desa Sawahan, Kec. Ngemplak, Boyolali, Sawahan, Ngemplak, Kab. Boyolali, Jawa Tengah, 57191', '1,257 kg', 9, 3968, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 17: Koperasi Desa Merah Putih Ngandul
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Ngandul', -7.0297222, 110.6799444)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-017', 'Koperasi Desa Merah Putih Ngandul', 100, 
        'Lele', 'Jl. Raya Ngandul, Desa Ngandul, Kec. Sumberlawang, Sragen, Ngandul, Sumberlawang, Kab. Sragen, Jawa Tengah, 57272', '1,173 kg', 9, 3925, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 18: Koperasi Desa Merah Putih Pagung
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Pagung', -7.0985278, 110.9448611)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-018', 'Koperasi Desa Merah Putih Pagung', 100, 
        'Lele', 'Jl. Raya Pagung, Desa Pagung, Kec. Bratang, Grobogan, Pagung, Bratang, Kab. Grobogan, Jawa Tengah, 58152', '1,957 kg', 1, 1944, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 19: Koperasi Desa Merah Putih Karanganyar
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Karanganyar', -7.0375833, 110.6709722)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-019', 'Koperasi Desa Merah Putih Karanganyar', 100, 
        'Lele', 'Jl. Raya Karanganyar, Desa Karanganyar, Kec. Geyer, Grobogan, Karanganyar, Geyer, Kab. Grobogan, Jawa Tengah, 58172', '1,273 kg', 4, 3927, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 20: Koperasi Desa Merah Putih Jatipuro
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Jatipuro', -7.646179, 111.0088168)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-020', 'Koperasi Desa Merah Putih Jatipuro', 100, 
        'Lele', 'Jl. Raya Jatipuro, Desa Jatipuro, Kec. Jatipuro, Karanganyar, Jatipuro, Jatipuro, Kab. Karanganyar, Jawa Tengah, 57176', '1,130 kg', 10, 1137, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 21: Koperasi Desa Merah Putih Jatiyoso
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Jatiyoso', -7.5083776, 111.0633916)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-021', 'Koperasi Desa Merah Putih Jatiyoso', 100, 
        'Lele', 'Jl. Raya Jatiyoso, Desa Jatiyoso, Kec. Jatiyoso, Karanganyar, Jatiyoso, Jatiyoso, Kab. Karanganyar, Jawa Tengah, 57177', '1,308 kg', 1, 3345, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 22: Koperasi Desa Merah Putih Kebumen
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Kebumen', -7.638042, 109.547596)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-022', 'Koperasi Desa Merah Putih Kebumen', 100, 
        'Lele', 'Jl. Raya Kebumen, Desa Kebumen, Kec. Kebumen, Kebumen, Kebumen, Kebumen, Kab. Kebumen, Jawa Tengah, 54311', '1,457 kg', 1, 1374, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 23: Koperasi Desa Merah Putih Pejagoan
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Pejagoan', -7.797238, 109.717095)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-023', 'Koperasi Desa Merah Putih Pejagoan', 100, 
        'Lele', 'Jl. Raya Pejagoan, Desa Pejagoan, Kec. Pejagoan, Kebumen, Pejagoan, Pejagoan, Kab. Kebumen, Jawa Tengah, 54361', '1,149 kg', 1, 4832, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 24: Koperasi Desa Merah Putih Sruweng
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Sruweng', -7.750513, 109.599663)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-024', 'Koperasi Desa Merah Putih Sruweng', 100, 
        'Lele', 'Jl. Raya Sruweng, Desa Sruweng, Kec. Sruweng, Kebumen, Sruweng, Sruweng, Kab. Kebumen, Jawa Tengah, 54362', '1,252 kg', 10, 3968, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 25: Koperasi Desa Merah Putih Boja
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Boja', -7.149997, 110.296857)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-025', 'Koperasi Desa Merah Putih Boja', 100, 
        'Lele', 'Jl. Raya Boja, Desa Boja, Kec. Boja, Kendal, Boja, Boja, Kab. Kendal, Jawa Tengah, 51381', '1,595 kg', 1, 1085, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 26: Koperasi Desa Merah Putih Gebang
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Gebang', -6.8681944, 110.8662778)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-026', 'Koperasi Desa Merah Putih Gebang', 100, 
        'Lele', 'Jl. Raya Gebang, Desa Gebang, Kec. Bonang, Demak, Gebang, Bonang, Kab. Demak, Jawa Tengah, 59552', '1,844 kg', 10, 1690, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 27: Koperasi Desa Merah Putih Karangmlati
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Karangmlati', -6.8644167, 110.8222778)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-027', 'Koperasi Desa Merah Putih Karangmlati', 100, 
        'Lele', 'Jl. Raya Karangmlati, Desa Karangmlati, Kec. Demak, Demak, Karangmlati, Demak, Kab. Demak, Jawa Tengah, 59511', '1,014 kg', 4, 1637, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 28: Koperasi Desa Merah Putih Borobudur
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Borobudur', -7.431257, 110.24358)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-028', 'Koperasi Desa Merah Putih Borobudur', 100, 
        'Lele', 'Jl. Raya Borobudur, Desa Borobudur, Kec. Borobudur, Magelang, Borobudur, Borobudur, Kab. Magelang, Jawa Tengah, 56553', '1,104 kg', 1, 3131, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 29: Koperasi Desa Merah Putih Mertoyudan
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Mertoyudan', -7.549646, 110.240297)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-029', 'Koperasi Desa Merah Putih Mertoyudan', 100, 
        'Lele', 'Jl. Raya Mertoyudan, Desa Mertoyudan, Kec. Mertoyudan, Magelang, Mertoyudan, Mertoyudan, Kab. Magelang, Jawa Tengah, 56172', '1,967 kg', 5, 3426, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 30: Koperasi Desa Merah Putih Mungkid
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Mungkid', -7.549658, 110.26627)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-030', 'Koperasi Desa Merah Putih Mungkid', 100, 
        'Lele', 'Jl. Raya Mungkid, Desa Mungkid, Kec. Mungkid, Magelang, Mungkid, Mungkid, Kab. Magelang, Jawa Tengah, 56511', '1,455 kg', 4, 3811, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 31: Koperasi Desa Merah Putih Muntilan
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Muntilan', -7.582121, 110.250253)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-031', 'Koperasi Desa Merah Putih Muntilan', 100, 
        'Lele', 'Jl. Raya Muntilan, Desa Muntilan, Kec. Muntilan, Magelang, Muntilan, Muntilan, Kab. Magelang, Jawa Tengah, 56411', '1,836 kg', 1, 3816, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 32: Koperasi Desa Merah Putih Salam
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Salam', -7.594123, 110.252737)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-032', 'Koperasi Desa Merah Putih Salam', 100, 
        'Lele', 'Jl. Raya Salam, Desa Salam, Kec. Salam, Magelang, Salam, Salam, Kab. Magelang, Jawa Tengah, 56484', '1,586 kg', 6, 2195, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 33: Koperasi Desa Merah Putih Kajen
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Kajen', -6.868312, 109.617668)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-033', 'Koperasi Desa Merah Putih Kajen', 100, 
        'Lele', 'Jl. Raya Kajen, Desa Kajen, Kec. Kajen, Pekalongan, Kajen, Kajen, Kab. Pekalongan, Jawa Tengah, 51161', '1,085 kg', 8, 4526, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 34: Koperasi Desa Merah Putih Kedungwuni
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Kedungwuni', -6.873769, 109.628078)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-034', 'Koperasi Desa Merah Putih Kedungwuni', 100, 
        'Lele', 'Jl. Raya Kedungwuni, Desa Kedungwuni, Kec. Kedungwuni, Pekalongan, Kedungwuni, Kedungwuni, Kab. Pekalongan, Jawa Tengah, 51173', '1,712 kg', 6, 4471, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 35: Koperasi Desa Merah Putih Kesesi
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Kesesi', -7.1877852, 109.6036235)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-035', 'Koperasi Desa Merah Putih Kesesi', 100, 
        'Lele', 'Jl. Raya Kesesi, Desa Kesesi, Kec. Kesesi, Pekalongan, Kesesi, Kesesi, Kab. Pekalongan, Jawa Tengah, 51162', '1,061 kg', 2, 4519, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 36: Koperasi Desa Merah Putih Wiradesa
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Wiradesa', -7.396798, 109.547965)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-036', 'Koperasi Desa Merah Putih Wiradesa', 100, 
        'Lele', 'Jl. Raya Wiradesa, Desa Wiradesa, Kec. Wiradesa, Pekalongan, Wiradesa, Wiradesa, Kab. Pekalongan, Jawa Tengah, 51152', '1,349 kg', 10, 4679, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 37: Koperasi Desa Merah Putih Bagelen
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Bagelen', -7.780285, 109.9122)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-037', 'Koperasi Desa Merah Putih Bagelen', 100, 
        'Lele', 'Jl. Raya Bagelen, Desa Bagelen, Kec. Bagelen, Purworejo, Bagelen, Bagelen, Kab. Purworejo, Jawa Tengah, 54174', '1,029 kg', 7, 3624, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 38: Koperasi Desa Merah Putih Kaligesing
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Kaligesing', -7.740863, 110.067985)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-038', 'Koperasi Desa Merah Putih Kaligesing', 100, 
        'Lele', 'Jl. Raya Kaligesing, Desa Kaligesing, Kec. Kaligesing, Purworejo, Kaligesing, Kaligesing, Kab. Purworejo, Jawa Tengah, 54175', '1,515 kg', 10, 1633, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 39: Koperasi Desa Merah Putih Loano
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Loano', -7.734381, 109.96826)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-039', 'Koperasi Desa Merah Putih Loano', 100, 
        'Lele', 'Jl. Raya Loano, Desa Loano, Kec. Loano, Purworejo, Loano, Loano, Kab. Purworejo, Jawa Tengah, 54181', '1,714 kg', 9, 3968, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 40: Koperasi Desa Merah Putih Purworejo
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Purworejo', -7.740849, 110.067985)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-040', 'Koperasi Desa Merah Putih Purworejo', 100, 
        'Lele', 'Jl. Raya Purworejo, Desa Purworejo, Kec. Purworejo, Purworejo, Purworejo, Purworejo, Kab. Purworejo, Jawa Tengah, 54111', '1,074 kg', 10, 1085, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 41: Koperasi Desa Merah Putih Lasem
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Lasem', -6.72376, 111.444395)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-041', 'Koperasi Desa Merah Putih Lasem', 100, 
        'Lele', 'Jl. Raya Lasem, Desa Lasem, Kec. Lasem, Rembang, Lasem, Lasem, Kab. Rembang, Jawa Tengah, 59271', '1,123 kg', 9, 1690, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 42: Koperasi Desa Merah Putih Salatiga
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Salatiga', -7.3043922, 110.5129206)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-042', 'Koperasi Desa Merah Putih Salatiga', 100, 
        'Lele', 'Jl. Raya Salatiga, Desa Salatiga, Kec. Sidorejo, Salatiga, Salatiga, Sidorejo, Kab. Salatiga, Jawa Tengah, 50711', '1,637 kg', 1, 3131, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 43: Koperasi Desa Merah Putih Selo
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Selo', -7.417172, 110.62805)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-043', 'Koperasi Desa Merah Putih Selo', 100, 
        'Lele', 'Jl. Raya Selo, Desa Selo, Kec. Selo, Boyolali, Selo, Selo, Kab. Boyolali, Jawa Tengah, 57363', '1,426 kg', 5, 3426, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 44: Koperasi Desa Merah Putih Ungaran
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Ungaran', -7.1917843, 110.4637048)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-044', 'Koperasi Desa Merah Putih Ungaran', 100, 
        'Lele', 'Jl. Raya Ungaran, Desa Ungaran, Kec. Ungaran Barat, Semarang, Ungaran, Ungaran Barat, Kab. Semarang, Jawa Tengah, 50511', '1,811 kg', 4, 3811, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 45: Koperasi Desa Merah Putih Slawi
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Slawi', -6.944365, 109.179865)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-045', 'Koperasi Desa Merah Putih Slawi', 100, 
        'Lele', 'Jl. Raya Slawi, Desa Slawi, Kec. Slawi, Tegal, Slawi, Slawi, Kab. Tegal, Jawa Tengah, 52411', '1,816 kg', 1, 3816, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 46: Koperasi Desa Merah Putih Adiwerna
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Adiwerna', -6.969814, 109.121179)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-046', 'Koperasi Desa Merah Putih Adiwerna', 100, 
        'Lele', 'Jl. Raya Adiwerna, Desa Adiwerna, Kec. Adiwerna, Tegal, Adiwerna, Adiwerna, Kab. Tegal, Jawa Tengah, 52413', '1,195 kg', 6, 4526, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 47: Koperasi Desa Merah Putih Wonogiri
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Wonogiri', -7.8019133, 110.8650367)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-047', 'Koperasi Desa Merah Putih Wonogiri', 100, 
        'Lele', 'Jl. Raya Wonogiri, Desa Wonogiri, Kec. Wonogiri, Wonogiri, Wonogiri, Wonogiri, Kab. Wonogiri, Jawa Tengah, 57611', '1,471 kg', 6, 4519, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 48: Koperasi Desa Merah Putih Banyuwangi
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Banyuwangi', -8.413615, 114.14276)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-048', 'Koperasi Desa Merah Putih Banyuwangi', 100, 
        'Lele', 'Jl. Raya Banyuwangi, Desa Banyuwangi, Kec. Banyuwangi, Banyuwangi, Banyuwangi, Banyuwangi, Kab. Banyuwangi, Jawa Timur, 68411', '1,519 kg', 2, 4679, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 49: Koperasi Desa Merah Putih Bangkalan
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Bangkalan', 14.0708647, 14.0414113)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-049', 'Koperasi Desa Merah Putih Bangkalan', 100, 
        'Lele', 'Jl. Raya Bangkalan, Desa Bangkalan, Kec. Bangkalan, Bangkalan, Bangkalan, Bangkalan, Kab. Bangkalan, Jawa Timur, 69111', '1,679 kg', 10, 3624, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 50: Koperasi Desa Merah Putih Blitar
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Blitar', 10.7303583, 10.4349129)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-050', 'Koperasi Desa Merah Putih Blitar', 100, 
        'Lele', 'Jl. Raya Blitar, Desa Blitar, Kec. Blitar, Blitar, Blitar, Blitar, Kab. Blitar, Jawa Timur, 66111', '1,624 kg', 7, 1633, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 51: Koperasi Desa Merah Putih Bojonegoro
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Bojonegoro', 9.4895528, 9.2922359)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-051', 'Koperasi Desa Merah Putih Bojonegoro', 100, 
        'Lele', 'Jl. Raya Bojonegoro, Desa Bojonegoro, Kec. Bojonegoro, Bojonegoro, Bojonegoro, Bojonegoro, Kab. Bojonegoro, Jawa Timur, 62111', '1,633 kg', 10, 3968, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 52: Koperasi Desa Merah Putih Bondowoso
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Bondowoso', 12.5275703, 12.3139253)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-052', 'Koperasi Desa Merah Putih Bondowoso', 100, 
        'Lele', 'Jl. Raya Bondowoso, Desa Bondowoso, Kec. Bondowoso, Bondowoso, Bondowoso, Bondowoso, Kab. Bondowoso, Jawa Timur, 68211', '1,968 kg', 9, 1085, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 53: Koperasi Desa Merah Putih Gresik
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Gresik', 13.9594761, 13.5734114)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-053', 'Koperasi Desa Merah Putih Gresik', 100, 
        'Lele', 'Jl. Raya Gresik, Desa Gresik, Kec. Gresik, Gresik, Gresik, Gresik, Kab. Gresik, Jawa Timur, 61111', '1,085 kg', 10, 1690, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 54: Koperasi Desa Merah Putih Jember
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Jember', -7.1319444, 112.1029722)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-054', 'Koperasi Desa Merah Putih Jember', 100, 
        'Lele', 'Jl. Raya Jember, Desa Jember, Kec. Jember, Jember, Jember, Jember, Kab. Jember, Jawa Timur, 68111', '1,690 kg', 1, 3131, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 55: Koperasi Desa Merah Putih Jombang
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Jombang', -7.095721, 112.022816)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-055', 'Koperasi Desa Merah Putih Jombang', 100, 
        'Lele', 'Jl. Raya Jombang, Desa Jombang, Kec. Jombang, Jombang, Jombang, Jombang, Kab. Jombang, Jawa Timur, 61411', '1,131 kg', 5, 3426, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 56: Koperasi Desa Merah Putih Kediri
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Kediri', -7.990631, 113.953963)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-056', 'Koperasi Desa Merah Putih Kediri', 100, 
        'Lele', 'Jl. Raya Kediri, Desa Kediri, Kec. Kediri, Kediri, Kediri, Kediri, Kab. Kediri, Jawa Timur, 64111', '1,426 kg', 4, 3811, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 57: Koperasi Desa Merah Putih Lamongan
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Lamongan', -7.282748, 112.53967)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-057', 'Koperasi Desa Merah Putih Lamongan', 100, 
        'Lele', 'Jl. Raya Lamongan, Desa Lamongan, Kec. Lamongan, Lamongan, Lamongan, Lamongan, Kab. Lamongan, Jawa Timur, 62211', '1,811 kg', 1, 3816, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 58: Koperasi Desa Merah Putih Lumajang
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Lumajang', -7.04589, 112.647767)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-058', 'Koperasi Desa Merah Putih Lumajang', 100, 
        'Lele', 'Jl. Raya Lumajang, Desa Lumajang, Kec. Lumajang, Lumajang, Lumajang, Lumajang, Kab. Lumajang, Jawa Timur, 67311', '1,816 kg', 6, 4526, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 59: Koperasi Desa Merah Putih Madiun
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Madiun', -8.278214, 113.58521)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-059', 'Koperasi Desa Merah Putih Madiun', 100, 
        'Lele', 'Jl. Raya Madiun, Desa Madiun, Kec. Madiun, Madiun, Madiun, Madiun, Kab. Madiun, Jawa Timur, 63111', '1,526 kg', 8, 4471, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 60: Koperasi Desa Merah Putih Magetan
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Magetan', -8.207336, 113.83999)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-060', 'Koperasi Desa Merah Putih Magetan', 100, 
        'Lele', 'Jl. Raya Magetan, Desa Magetan, Kec. Magetan, Magetan, Magetan, Magetan, Kab. Magetan, Jawa Timur, 63311', '1,471 kg', 6, 4519, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 61: Koperasi Desa Merah Putih Malang
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Malang', 13.9594761, 13.5734114)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-061', 'Koperasi Desa Merah Putih Malang', 100, 
        'Lele', 'Jl. Raya Malang, Desa Malang, Kec. Malang, Malang, Malang, Malang, Kab. Malang, Jawa Timur, 65111', '1,519 kg', 2, 4679, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 62: Koperasi Desa Merah Putih Mojokerto
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Mojokerto', -7.813912, 113.210496)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-062', 'Koperasi Desa Merah Putih Mojokerto', 100, 
        'Lele', 'Jl. Raya Mojokerto, Desa Mojokerto, Kec. Mojokerto, Mojokerto, Mojokerto, Mojokerto, Kab. Mojokerto, Jawa Timur, 61311', '1,679 kg', 10, 3624, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 63: Koperasi Desa Merah Putih Nganjuk
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Nganjuk', -7.019019, 112.328637)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-063', 'Koperasi Desa Merah Putih Nganjuk', 100, 
        'Lele', 'Jl. Raya Nganjuk, Desa Nganjuk, Kec. Nganjuk, Nganjuk, Nganjuk, Nganjuk, Kab. Nganjuk, Jawa Timur, 64411', '1,624 kg', 7, 1633, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 64: Koperasi Desa Merah Putih Ngawi
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Ngawi', -7.098715, 112.312883)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-064', 'Koperasi Desa Merah Putih Ngawi', 100, 
        'Lele', 'Jl. Raya Ngawi, Desa Ngawi, Kec. Ngawi, Ngawi, Ngawi, Ngawi, Kab. Ngawi, Jawa Timur, 63211', '1,633 kg', 10, 3968, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 65: Koperasi Desa Merah Putih Pacitan
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Pacitan', -7.099603, 112.390582)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-065', 'Koperasi Desa Merah Putih Pacitan', 100, 
        'Lele', 'Jl. Raya Pacitan, Desa Pacitan, Kec. Pacitan, Pacitan, Pacitan, Pacitan, Kab. Pacitan, Jawa Timur, 63511', '1,968 kg', 9, 1085, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 66: Koperasi Desa Merah Putih Pamekasan
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Pamekasan', -7.156006, 112.26409)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-066', 'Koperasi Desa Merah Putih Pamekasan', 100, 
        'Lele', 'Jl. Raya Pamekasan, Desa Pamekasan, Kec. Pamekasan, Pamekasan, Pamekasan, Pamekasan, Kab. Pamekasan, Jawa Timur, 69311', '1,085 kg', 10, 1690, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 67: Koperasi Desa Merah Putih Pasuruan
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Pasuruan', -8.21042, 113.142896)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-067', 'Koperasi Desa Merah Putih Pasuruan', 100, 
        'Lele', 'Jl. Raya Pasuruan, Desa Pasuruan, Kec. Pasuruan, Pasuruan, Pasuruan, Pasuruan, Kab. Pasuruan, Jawa Timur, 67111', '1,690 kg', 1, 3131, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 68: Koperasi Desa Merah Putih Ponorogo
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Ponorogo', -7.4773056, 111.6158611)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-068', 'Koperasi Desa Merah Putih Ponorogo', 100, 
        'Lele', 'Jl. Raya Ponorogo, Desa Ponorogo, Kec. Ponorogo, Ponorogo, Ponorogo, Ponorogo, Kab. Ponorogo, Jawa Timur, 63411', '1,131 kg', 5, 3426, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 69: Koperasi Desa Merah Putih Probolinggo
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Probolinggo', -7.540796, 111.644619)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-069', 'Koperasi Desa Merah Putih Probolinggo', 100, 
        'Lele', 'Jl. Raya Probolinggo, Desa Probolinggo, Kec. Probolinggo, Probolinggo, Probolinggo, Probolinggo, Kab. Probolinggo, Jawa Timur, 67211', '1,426 kg', 4, 3811, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 70: Koperasi Desa Merah Putih Sampang
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Sampang', -7.4674444, 111.6441667)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-070', 'Koperasi Desa Merah Putih Sampang', 100, 
        'Lele', 'Jl. Raya Sampang, Desa Sampang, Kec. Sampang, Sampang, Sampang, Sampang, Kab. Sampang, Jawa Timur, 69211', '1,811 kg', 1, 3816, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 71: Koperasi Desa Merah Putih Sidoarjo
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Sidoarjo', -7.554725, 111.566723)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-071', 'Koperasi Desa Merah Putih Sidoarjo', 100, 
        'Lele', 'Jl. Raya Sidoarjo, Desa Sidoarjo, Kec. Sidoarjo, Sidoarjo, Sidoarjo, Sidoarjo, Kab. Sidoarjo, Jawa Timur, 61211', '1,816 kg', 6, 4526, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 72: Koperasi Desa Merah Putih Situbondo
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Situbondo', -7.7064167, 111.4165)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-072', 'Koperasi Desa Merah Putih Situbondo', 100, 
        'Lele', 'Jl. Raya Situbondo, Desa Situbondo, Kec. Situbondo, Situbondo, Situbondo, Situbondo, Kab. Situbondo, Jawa Timur, 68311', '1,526 kg', 8, 4471, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 73: Koperasi Desa Merah Putih Sumenep
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Sumenep', -7.5644444, 111.4575278)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-073', 'Koperasi Desa Merah Putih Sumenep', 100, 
        'Lele', 'Jl. Raya Sumenep, Desa Sumenep, Kec. Sumenep, Sumenep, Sumenep, Sumenep, Kab. Sumenep, Jawa Timur, 69411', '1,471 kg', 6, 4519, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 74: Koperasi Desa Merah Putih Trenggalek
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Trenggalek', -7.7650348, 111.347754)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-074', 'Koperasi Desa Merah Putih Trenggalek', 100, 
        'Lele', 'Jl. Raya Trenggalek, Desa Trenggalek, Kec. Trenggalek, Trenggalek, Trenggalek, Trenggalek, Kab. Trenggalek, Jawa Timur, 66311', '1,519 kg', 2, 4679, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 75: Koperasi Desa Merah Putih Tuban
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Tuban', -7.5475556, 111.4275278)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-075', 'Koperasi Desa Merah Putih Tuban', 100, 
        'Lele', 'Jl. Raya Tuban, Desa Tuban, Kec. Tuban, Tuban, Tuban, Tuban, Kab. Tuban, Jawa Timur, 62311', '1,679 kg', 10, 3624, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 76: Koperasi Desa Merah Putih Tulungagung
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Tulungagung', -7.455109, 112.390816)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-076', 'Koperasi Desa Merah Putih Tulungagung', 100, 
        'Lele', 'Jl. Raya Tulungagung, Desa Tulungagung, Kec. Tulungagung, Tulungagung, Tulungagung, Tulungagung, Kab. Tulungagung, Jawa Timur, 66211', '1,624 kg', 7, 1633, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 77: Koperasi Desa Merah Putih Batu
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Batu', -7.474184, 112.550452)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-077', 'Koperasi Desa Merah Putih Batu', 100, 
        'Lele', 'Jl. Raya Batu, Desa Batu, Kec. Batu, Batu, Batu, Batu, Kab. Batu, Jawa Timur, 65311', '1,633 kg', 10, 3968, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
-- Row 78: Koperasi Desa Merah Putih Surabaya
WITH loc AS (
    INSERT INTO available_locations (type, name, latitude, longitude)
    VALUES ('biofloc_thematic', 'Desa Surabaya', 16.9069722, 16.542531)
    RETURNING id
),
prog AS (
    INSERT INTO biofloc_thematic_programs (
        location_id, status, kusuka_number, name, progress_percent, 
        commodity, land_area, production, total_admin, distribution_amount, 
        sppg_partner, s_curve_path
    )
    SELECT 
        id, 'active', 'KUSUKA-2025-078', 'Koperasi Desa Merah Putih Surabaya', 100, 
        'Lele', 'Jl. Raya Surabaya, Desa Surabaya, Kec. Surabaya, Surabaya, Surabaya, Surabaya, Kab. Surabaya, Jawa Timur, 60111', '1,816 kg', 6, 4526, 
        'Satker Sekretariat Ditjen Perikanan Budi Daya', '/assets/docs/seed_scurve.pdf'
    FROM loc
    RETURNING id
)
INSERT INTO documentations (program_type, program_id, group_id, type, path, file_name)
SELECT 'biofloc_thematic', id, 'seed-group-1', 'before', 'documentations/biofloc-thematic/bioflok_thematic_1.webp', 'bioflok_thematic_1.webp' FROM prog
UNION ALL
SELECT 'biofloc_thematic', id, 'seed-group-1', 'after', 'documentations/biofloc-thematic/bioflok_thematic_2.webp', 'bioflok_thematic_2.webp' FROM prog;
