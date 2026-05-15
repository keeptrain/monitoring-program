import { z } from "zod";

export const proposalIdentitySchema = z.object({
  name: z.string().min(3, "Nama Kelompok minimal 3 karakter"),
  nib: z.string().min(1, "NIB harus diisi"),
  kusukaNumber: z.string().min(1, "Nomor KUSUKA harus diisi"),
  legalEntityNumber: z.string().min(1, "Legalitas harus diisi"),
  chairmanName: z.string().min(1, "Nama Ketua wajib diisi"),
  chairmanPhoneNumber: z.string().min(1, "Nomor HP Ketua wajib diisi"),
  companionName: z.string().min(1, "Nama Penyuluh Pendamping wajib diisi"),
  companionPhoneNumber: z
    .string()
    .min(1, "Nomor HP Penyuluh Pendamping wajib diisi"),
  boardMemberCount: z.coerce.number().min(1, "Minimal 1 pengurus"),
  memberCount: z.coerce.number().min(1, "Minimal 1 anggota"),
});

export type ProposalIdentityInput = z.input<typeof proposalIdentitySchema>;
export type ProposalIdentityFormValues = z.infer<typeof proposalIdentitySchema>;
