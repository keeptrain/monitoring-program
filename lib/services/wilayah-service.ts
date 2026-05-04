"use server";

import { createClient } from "@/utils/supabase";

export async function getRegencies(provinceCode: string) {
  if (!provinceCode) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ref_regencies")
    .select("code, name")
    .eq("province_code", provinceCode)
    .order("name");
  if (error) throw error;
  return data;
}

export async function getDistricts(regencyCode: string) {
  if (!regencyCode) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ref_districts")
    .select("code, name")
    .eq("regency_code", regencyCode)
    .order("name");
  if (error) throw error;
  return data;
}

export async function getVillages(districtCode: string) {
  if (!districtCode) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ref_villages")
    .select("code, name")
    .eq("district_code", districtCode)
    .order("name");
  if (error) throw error;
  return data;
}
