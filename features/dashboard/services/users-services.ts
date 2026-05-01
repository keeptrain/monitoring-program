import { User, UserRole, ProgramScope } from "@/features/auth/types/user";
import { createClient } from "@/utils/supabase";

const MOCK_USERS: User[] = [
  {
    id: "1",
    email: "admin@test.com",
    name: "Admin",
    role: "admin",
    program_scope: "all",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    email: "petugas-bioflok@test.com",
    name: "Petugas Bioflok",
    role: "officer",
    program_scope: "biofloc",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    email: "petugas-isf@test.com",
    name: "Petugas ISF",
    role: "officer",
    program_scope: "isf",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function getUsersService(
  programScope: ProgramScope,
): Promise<User[]> {
  return MOCK_USERS.filter((user) => user.program_scope === programScope);
}

export async function getUserByIdService(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as User;
}

export async function createUserService(userData: {
  email: string;
  fullName?: string;
  role: UserRole;
  programScope: ProgramScope;
}) {
  const adminClient = await createClient();

  // 1. Create user in Auth
  const { data: authData, error: authError } =
    await adminClient.auth.admin.createUser({
      email: userData.email,
      password: "password123", // Default password, user should change it
      email_confirm: true,
    });

  if (authError) throw authError;

  // 2. Create user in Public table
  const { data, error } = await adminClient.from("users").insert({
    id: authData.user.id,
    email: userData.email,
    full_name: userData.fullName,
    role: userData.role,
    program_scope: userData.programScope,
  });

  if (error) {
    // Cleanup Auth user if public table insert fails
    await adminClient.auth.admin.deleteUser(authData.user.id);
    throw error;
  }

  return data;
}

export async function updateUserService(
  id: string,
  userData: Partial<{
    fullName: string;
    role: UserRole;
    programScope: ProgramScope;
  }>,
) {
  const adminClient = await createClient();

  const { data, error } = await adminClient
    .from("users")
    .update({
      full_name: userData.fullName,
      role: userData.role,
      program_scope: userData.programScope,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw error;
  return data;
}

export async function deleteUserService(id: string) {
  const adminClient = await createClient();

  // Auth delete will cascade to public.users if configured correctly,
  // but we'll do it explicitly or rely on the FK cascade.
  const { error } = await adminClient.auth.admin.deleteUser(id);

  if (error) throw error;
  return true;
}
