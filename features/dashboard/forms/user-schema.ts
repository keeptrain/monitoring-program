import z from "zod";

export const userSchema = z.object({
  email: z.email("Email tidak valid"),
  fullName: z.string().min(1, "Nama lengkap wajib diisi"),
  role: z.enum(["admin", "officer", "pmo"], "Role wajib diisi"),
});

export type UserSchema = z.infer<typeof userSchema>;
