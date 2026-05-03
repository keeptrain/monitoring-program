import z from "zod";

const COMMODITY_POTENTIAL_OPTIONS = [
  "mas",
  "lele",
  "nila",
  "gabus",
  "other",
] as const;

export const POTENTIAL_COMMODITY_OPTIONS: {
  id: (typeof COMMODITY_POTENTIAL_OPTIONS)[number];
  label: string;
}[] = [
  { id: "mas", label: "Mas" },
  { id: "lele", label: "Lele" },
  { id: "nila", label: "Nila" },
  { id: "gabus", label: "Gabus" },
  { id: "other", label: "Other:" },
];

export const proposalDetailSchema = z
  .object({
    has_letter_of_land_preparation_and_use: z.enum(["true", "false"], {
      error: "Surat pernyataan kesediaan harus dipilih",
    }),
    proposed_commodity: z.enum(["lele", "nila"], {
      error: "Komoditas yang diusulkan wajib diisi",
    }),
    has_member_with_experience: z.enum(
      ["true", "false"],
      "Ada anggota yang sudah melakukan usaha pembudidayaan ikan wajib diisi",
    ),
    commodity_potentials: z
      .array(z.enum(COMMODITY_POTENTIAL_OPTIONS))
      .min(1, "Potensi komoditas wajib diisi"),
    other_commodity_potential: z.string().optional(),
    proposal_path: z.string().min(1, "Proposal wajib diunggah"),
    documentations: z
      .array(
        z.object({
          image_before_paths: z
            .array(
              z.object({
                path: z.string().min(1),
                file_name: z.string().min(1),
              }),
            )
            .min(1, "Dokumentasi proposal wajib diunggah"),
          image_after_paths: z.array(z.any()).optional().default([]),
        }),
      )
      .min(1, "Minimal 1 grup dokumentasi wajib ada"),
  })
  .refine(
    (data) => {
      const otherSelected = data.commodity_potentials.includes("other");
      const textIsFilled = !!data.other_commodity_potential?.trim();
      if (otherSelected && !textIsFilled) return false;
      return true;
    },
    {
      message: "Sebutkan komoditas lainnya",
      path: ["other_commodity_potential"],
    },
  );

export type ProposalDetailFormInput = z.input<typeof proposalDetailSchema>;
export type ProposalDetailFormValues = z.infer<typeof proposalDetailSchema>;
