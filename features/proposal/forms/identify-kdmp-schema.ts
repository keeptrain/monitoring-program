import { z } from "zod";

export const identifyKdmpSchema = z.object({
  name: z.string().min(3, "Nama KDMP minimal 3 karakter"),
  nib: z.string().min(1, "NIB harus 13 digit"),
  kusukaNumber: z.string().min(1, "Nomor KUSUKA harus diisi"),
  legalEntityNumber: z.string().min(1, "Legalitas harus diisi"),
  chairmanName: z.string().min(1, "Nama ketua KDMP wajib diisi"),
  chairmanPhoneNumber: z.string().min(1, "Nomor HP ketua KDMP wajib diisi"),
  companionName: z.string().min(1, "Nama penyuluh pendamping wajib diisi"),
  companionPhoneNumber: z
    .string()
    .min(1, "Nomor HP penyuluh pendamping wajib diisi"),
  boardMemberCount: z.coerce.number().min(1, "Minimal 1 pengurus"),
  memberCount: z.coerce.number().min(1, "Minimal 1 anggota"),
});

export type IdentifyKdmpInput = z.input<typeof identifyKdmpSchema>;
export type IdentifyKdmpFormValues = z.infer<typeof identifyKdmpSchema>;
