import z from "zod";

export const userSchema = z.object({
  email: z.email("Email tidak valid"),
  name: z.string().min(1, "Nama lengkap wajib diisi"),
  role: z.enum(["admin", "officer", "pmo"], "Role wajib diisi"),
});

export const passwordSchema = z.string().min(6, "Password minimal 6 karakter");

export type UserSchema = z.infer<typeof userSchema>;
