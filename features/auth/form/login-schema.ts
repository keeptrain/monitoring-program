import z from "zod";

export const loginFormSchema = z.object({
  email: z.email("Masukkan email yang valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});
