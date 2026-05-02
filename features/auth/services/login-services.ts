import bcrypt from "bcryptjs";
import { TABLES } from "@/lib/constants/tables";
import { createClient } from "@/utils/supabase";
import { ProgramScope, UserRole } from "../types/user";

export async function login(email: string, password: string) {
  const supabase = await createClient();
  const { data: user, error } = await supabase
    .from(TABLES.USERS)
    .select(
      `
      id,
      password,
      user_assignments!inner (
        role,
        program_scope
      )
    `,
    )
    .eq("email", email)
    .is("deleted_at", null)
    .single();

  if (error || !user) {
    throw new Error("User not found");
  }

  const isPasswordMatch = bcrypt.compareSync(password, user.password);
  if (!isPasswordMatch) {
    throw new Error("Password does not match");
  }

  return {
    id: user.id,
    role: user.user_assignments[0].role as UserRole,
    programScope: user.user_assignments[0].program_scope as ProgramScope,
  };
}
