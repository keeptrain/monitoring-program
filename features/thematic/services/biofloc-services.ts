import { TABLES } from "@/lib/constants/tables";
import { createClient } from "@/utils/supabase";
import { BioflocProgramFormValues } from "../forms/biofloc-program-schema";
import {
  BioflocProgramListItem,
  BioflocProgramsPaginatedResult,
  ThematicProgramDetail,
  ThematicProgramIndex,
} from "../types/thematic";
import { BioflocProgramsPaginatedParams } from "../forms/biofloc-program-query-schema";
import { saveDocumentationsAction } from "@/features/documentation/actions";

type NormalizedDocumentation = {
  id: string;
  image_before_path: string;
  image_after_path: string;
};

const LIST_SELECT = `
      id,
      location_id,
      name,
      progress_percent,
      updated_at,
      available_locations (
        name
      )
      ` as const;

const DETAIL_SELECT = `
      *,
      kdmp_entities (
        name,
        kusuka_number,
        nib,
        legal_entity_number,
        board_member_count,
        member_count,
        chairman_name,
        chairman_phone,
        companion_name,
        companion_phone
      ),
      available_locations (
        name,
        latitude,
        longitude,
        province_code,
        province_name,
        regency_code,
        district_code,
        village_code
      ),
      proposal_biofloc_thematic_programs (
        land_slope
      )
    ` as const;

export function normalizeDocumentations(
  data: BioflocProgramFormValues["documentations"],
): NormalizedDocumentation[] {
  return (data ?? []).map((doc) => ({
    id: crypto.randomUUID(),
    image_before_path: doc.image_before_paths?.[0]?.path ?? "",
    image_after_path: doc.image_after_paths?.[0]?.path ?? "",
  }));
}

export async function getBioflocThematicProgramsService() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLES.BIOFLOC_THEMATIC_PROGRAMS)
    .select(LIST_SELECT)
    .order("updated_at", { ascending: false })
    .limit(10);

  if (error) {
    throw error;
  }

  return data as unknown as ThematicProgramIndex[];
}

const INTERNAL_PAGINATED_SELECT = `
  id,
  status,
  commodity_aid,
  progress_percent,
  distribution_amount,
  created_at,
  updated_at,
  kdmp_entities!inner (
    name,
    kusuka_number,
    board_member_count,
    member_count
  ),
  available_locations!inner (
    name,
    province_code,
    province_name
  )
` as const;

const PUBLIC_PAGINATED_SELECT = `
  id,
  status,
  commodity_aid,
  progress_percent,
  distribution_amount,
  created_at,
  updated_at,
  kdmp_entities!inner (
    name,
    board_member_count,
    member_count
  ),
  available_locations!inner (
    name,
    province_code,
    province_name
  )
` as const;

type BioflocProgramListRow = {
  id: string;
  status: string;
  commodity_aid: string;
  progress_percent: number;
  distribution_amount: number;
  created_at: string;
  updated_at: string;
  kdmp_entities: {
    name: string;
    kusuka_number?: string | null;
    board_member_count: number | null;
    member_count: number | null;
  } | null;
  available_locations: {
    name: string | null;
    province_code: string;
    province_name: string;
  } | null;
};

export async function getBioflocProgramsPaginatedService(
  params: BioflocProgramsPaginatedParams,
): Promise<BioflocProgramsPaginatedResult> {
  const supabase = await createClient();
  const { page, pageSize, province, scope, search, year } = params;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const selectColumns =
    scope === "internal" ? INTERNAL_PAGINATED_SELECT : PUBLIC_PAGINATED_SELECT;

  let query = supabase
    .from(TABLES.BIOFLOC_THEMATIC_PROGRAMS)
    .select(selectColumns, { count: "exact" });

  if (search.length > 0) {
    query = query.ilike("kdmp_entities.name", `%${search}%`);
  }

  if (province.length > 0) {
    query = query.eq("available_locations.province_code", province);
  }

  if (year && year > 0) {
    query = query.eq("fiscal_year", year);
  }

  const { data, error, count } = await query
    .order("updated_at", { ascending: false })
    .range(from, to);

  if (error) {
    throw error;
  }

  const rows = (data ?? []) as unknown as BioflocProgramListRow[];
  const mappedRows: BioflocProgramListItem[] = rows.map((row) => ({
    id: row.id,
    status: row.status,
    entity_name: row.kdmp_entities?.name ?? "Tidak Diketahui",
    location_name: row.available_locations?.name ?? "-",
    commodity_aid: row.commodity_aid,
    progress_percent: row.progress_percent,
    distribution_amount: row.distribution_amount,
    total_management: row.kdmp_entities?.board_member_count ?? 0,
    created_at: row.created_at,
    updated_at: row.updated_at,
    year: new Date(row.created_at).getUTCFullYear(),
    ...(scope === "internal"
      ? { kusuka_number: row.kdmp_entities?.kusuka_number ?? "" }
      : {}),
  }));

  const total = count ?? 0;
  return {
    data: mappedRows,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getBioflocThematicProgramByIdService(
  id: string | number,
): Promise<ThematicProgramDetail> {
  const supabase = await createClient();

  // 1. Fetch program data
  const { data: program, error: programError } = await supabase
    .from(TABLES.BIOFLOC_THEMATIC_PROGRAMS)
    .select(DETAIL_SELECT)
    .eq("id", id)
    .single();

  if (programError) {
    throw programError;
  }

  // 2. Fetch documentations from the documentations table
  const { data: docs, error: docsError } = await supabase
    .from("documentations")
    .select("*")
    .eq("program_type", "biofloc_thematic")
    .eq("program_id", id);

  if (docsError) {
    console.error("Error fetching documentations:", docsError);
    // Continue even if docs fail, just return empty list
  }

  // 3. Group documentations by group_id
  interface DocGroup {
    id: string;
    image_before_path: string | null;
    image_after_path: string | null;
    created_at: string;
    updated_at: string;
  }
  const docGroups: Record<string, DocGroup> = {};
  (docs || []).forEach((d) => {
    if (!docGroups[d.group_id]) {
      docGroups[d.group_id] = {
        id: d.group_id,
        image_before_path: null,
        image_after_path: null,
        created_at: d.created_at,
        updated_at: d.updated_at,
      };
    }
    if (d.type === "before") {
      docGroups[d.group_id].image_before_path = d.path;
    } else {
      docGroups[d.group_id].image_after_path = d.path;
    }
  });

  const entity = program.kdmp_entities;
  const location = program.available_locations;

  return {
    ...program,
    name: entity?.name ?? "Tidak Diketahui",
    kusuka_number: entity?.kusuka_number ?? "",
    nib: entity?.nib ?? "",
    legal_entity_number: entity?.legal_entity_number ?? "",
    total_management: entity?.board_member_count ?? 0,
    total_members: entity?.member_count ?? 0,
    chairman_name: entity?.chairman_name ?? "",
    chairman_phone: entity?.chairman_phone ?? "",
    companion_name: entity?.companion_name ?? "",
    companion_phone: entity?.companion_phone ?? "",
    location_name: location?.name ?? "",
    latitude: location?.latitude ?? "",
    longitude: location?.longitude ?? "",
    province_code: location?.province_code ?? "",
    regency_code: location?.regency_code ?? "",
    district_code: location?.district_code ?? "",
    village_code: location?.village_code ?? "",
    documentations: Object.values(docGroups),
  } as unknown as ThematicProgramDetail;
}

export async function downloadSCurveFileService(id: string) {
  const supabase = await createClient();
  const { data: program, error: programError } = await supabase
    .from(TABLES.BIOFLOC_THEMATIC_PROGRAMS)
    .select("s_curve_path")
    .eq("id", id)
    .single();

  if (programError) {
    throw new Error(`Gagal mendapatkan data Kurva S: ${programError.message}`);
  }

  if (!program?.s_curve_path) {
    throw new Error("Berkas Kurva S tidak ditemukan.");
  }

  const { data: blob, error } = await supabase.storage
    .from("demo")
    .download(program.s_curve_path);

  if (error) {
    throw new Error(`Gagal mengunduh berkas Kurva S: ${error.message}`);
  }

  return { blob, originalPath: program.s_curve_path };
}

export async function createBioflocThematicService(
  data: BioflocProgramFormValues,
) {
  const supabase = await createClient();

  const { data: locationData, error: locationError } = await supabase
    .from(TABLES.AVAILABLE_LOCATIONS)
    .insert({
      province_id: data.province_id,
      regency_id: data.regency_id,
      type: "biofloc_thematic",
      name: data.name,
      latitude: data.latitude,
      longitude: data.longitude,
    })
    .select("id")
    .single();

  if (locationError) {
    console.error(
      "Error creating location when creating biofloc thematic program:",
      locationError,
    );
    throw locationError;
  }

  const { data: bioflocInsertData, error: bioflocInsertError } = await supabase
    .from(TABLES.BIOFLOC_THEMATIC_PROGRAMS)
    .insert({
      location_id: locationData.id,
      name: data.name,
      progress_percent: data.progress_percent,
      commodity_aid: data.commodity_aid,
      commodity_potential: data.commodity_potential,
      land_area: data.land_area,
      production_value: data.production_value,
      total_management: data.total_management,
      total_members: data.total_members,
      distribution_amount: data.distribution_amount,
      sppg_partner: data.sppg_partner,
      kusuka_number: "", // Mandatory NOT NULL
      status: "potential",
      address: `${data.regency_id || ""}, ${data.province_id || ""}`,
    })
    .select("id")
    .single();

  if (bioflocInsertError) {
    console.error(
      "Error creating biofloc thematic program:",
      bioflocInsertError,
    );
    throw bioflocInsertError;
  }

  if (data.documentations && data.documentations.length > 0) {
    const docsResult = await saveDocumentationsAction(
      supabase,
      bioflocInsertData.id,
      "biofloc_thematic",
      data.documentations,
    );
    if (!docsResult.success) {
      console.error("Error creating documentations:", docsResult.error);
      throw new Error(
        docsResult.error ?? "Gagal menyimpan dokumentasi program.",
      );
    }
  }
}

export async function createBioflocThematicProgramService(
  data: Omit<
    BioflocProgramFormValues,
    "location_name" | "latitude" | "longitude" | "documentations"
  > & {
    location_id: number;
    documentations: NormalizedDocumentation[];
    proposal_id?: number;
  },
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from(TABLES.BIOFLOC_THEMATIC_PROGRAMS)
    .insert(data);

  if (error) {
    throw error;
  }
}

export async function updateBioflocThematicProgramService(
  id: string,
  data: Omit<BioflocProgramFormValues, "documentations"> & {
    documentations: NormalizedDocumentation[];
  },
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from(TABLES.BIOFLOC_THEMATIC_PROGRAMS)
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw error;
  }
}

import { IdentifyKdmpFormValues } from "@/features/proposal/forms/identify-kdmp-schema";
import { LocationKdmpValues } from "@/features/proposal/forms/location-kdmp-schema";

export async function updateKdmpEntityService(
  entityId: string | number,
  data: IdentifyKdmpFormValues,
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from(TABLES.KDMP_ENTITIES)
    .update({
      name: data.name,
      kusuka_number: data.kusukaNumber,
      nib: data.nib,
      legal_entity_number: data.legalEntityNumber,
      chairman_name: data.chairmanName,
      chairman_phone: data.chairmanPhoneNumber,
      companion_name: data.companionName,
      companion_phone: data.companionPhoneNumber,
      board_member_count: Number(data.boardMemberCount),
      member_count: Number(data.memberCount),
    })
    .eq("id", entityId);

  if (error) {
    throw error;
  }
}

export async function updateLocationService(
  locationId: string | number,
  data: LocationKdmpValues,
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from(TABLES.AVAILABLE_LOCATIONS)
    .update({
      province_code: data.province_code,
      province_name: data.province_name || "Provinsi",
      regency_code: data.regency_code,
      district_code: data.district_code,
      village_code: data.village_code,
      latitude: data.latitude,
      longitude: data.longitude,
    })
    .eq("id", locationId);

  if (error) {
    throw error;
  }
}

export async function updateBioflocThematicProgramProgressService(
  id: string,
  progress_percent: number,
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from(TABLES.BIOFLOC_THEMATIC_PROGRAMS)
    .update({
      progress_percent,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw error;
  }
}

export async function deleteBioflocThematicProgramService(id: string) {
  const supabase = await createClient();

  // Ambil data program untuk mengecek keberadaan proposal_id dan tahun pengajuan
  const { data: program, error: fetchError } = await supabase
    .from(TABLES.BIOFLOC_THEMATIC_PROGRAMS)
    .select("proposal_id, fiscal_year")
    .eq("id", id)
    .single();

  if (fetchError) {
    throw fetchError;
  }

  // Validasi: jika tidak ada proposal_id dan merupakan tahun 2025
  if (!program?.proposal_id && program?.fiscal_year === 2025) {
    throw new Error(
      "Program tahun 2025 yang bukan berasal dari proposal tidak dapat dihapus.",
    );
  }

  // Jika ada proposal_id, kembalikan status proposal ke 'approved'
  if (program?.proposal_id) {
    const { error: updateProposalError } = await supabase
      .from(TABLES.PROPOSAL_BIOFLOC_THEMATIC_PROGRAMS)
      .update({ status: "approved" })
      .eq("id", program.proposal_id);

    if (updateProposalError) {
      throw updateProposalError;
    }
  }

  // Hapus semua dokumentasi terkait program ini
  const { error: deleteDocsError } = await supabase
    .from("documentations")
    .delete()
    .eq("program_type", "biofloc_thematic")
    .eq("program_id", id);

  if (deleteDocsError) {
    console.error("Error deleting documentations:", deleteDocsError);
    // Kita tetap lanjut hapus program utama
  }

  // Hapus program (diberlakukan untuk semua yang lolos validasi)
  const { error } = await supabase
    .from(TABLES.BIOFLOC_THEMATIC_PROGRAMS)
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}
