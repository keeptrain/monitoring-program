"use server";

import { createClient } from "@/utils/supabase";
import { TABLES } from "@/lib/constants/tables";
import { revalidatePath } from "next/cache";
import { ProposalBioflocFormValues } from "../forms/proposal-biofloc-schema";

export type ProposalBioflocThematicProgram = {
  id: number;
  status: string;
  name: string;
  province: string;
  regency: string;
  district: string;
  village: string;
  proposal_path: string;
  created_at: string;
  updated_at: string;
};

export async function createProposalBioflocThematicProgram(
  payload: ProposalBioflocFormValues,
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from(TABLES.PROPOSAL_BIOFLOC_THEMATIC_PROGRAMS)
    .insert({
      ...payload,
      status: "Pending",
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  revalidatePath("/monitoring");
  revalidatePath("/monitoring/biofloc_thematic/proposal");
  revalidatePath("/monitoring/biofloc_thematic/bantuan-2025");

  return data as ProposalBioflocThematicProgram;
}

export async function getProposalBioflocThematicPrograms() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from(TABLES.PROPOSAL_BIOFLOC_THEMATIC_PROGRAMS)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as ProposalBioflocThematicProgram[];
}
