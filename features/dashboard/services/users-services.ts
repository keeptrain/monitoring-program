import { uuidv7 } from "uuidv7";
import bcrypt from "bcryptjs";
import { User, UserRole, ProgramScope } from "@/features/auth/types/user";
import { TABLES } from "@/lib/constants/tables";
import { createClient } from "@/utils/supabase";

export async function getUsersService(
  programScope: ProgramScope,
  currentUserId: string,
): Promise<User[]> {
  const supabase = await createClient();

  let query = supabase
    .from("users")
    .select(
      `
      id, 
      email, 
      name, 
      created_at, 
      updated_at,
      user_assignments!inner(program_scope, role)
    `,
    )
    .is("deleted_at", null)
    .neq("id", currentUserId);

  if (programScope !== "all") {
    query = query.eq("user_assignments.program_scope", programScope);
  }

  const { data, error } = await query.limit(50);

  if (error) {
    console.error("Error fetching users:", error);
    return [];
  }

  return data.map(({ user_assignments, ...user }) => ({
    ...user,
    role: user_assignments?.[0]?.role,
    program_scope: user_assignments?.[0]?.program_scope,
  })) as User[];
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
  name: string;
  role: UserRole;
  programScope: ProgramScope;
  password: string;
}) {
  const supabase = await createClient();

  const uuid = uuidv7();
  const { error: insertUserError } = await supabase.from(TABLES.USERS).insert({
    id: uuid,
    email: userData.email,
    name: userData.name,
    password: bcrypt.hashSync(userData.password, 10),
  });

  if (insertUserError) {
    // 23505 is the PostgreSQL error code for unique violation
    if (insertUserError.code === "23505") {
      throw new Error("EMAIL_ALREADY_EXISTS");
    }
    throw insertUserError;
  }

  const { error: assignmentError } = await supabase
    .from(TABLES.USER_ASSIGNMENTS)
    .insert({
      user_id: uuid,
      role: userData.role,
      program_scope: userData.programScope,
    });

  if (assignmentError) throw assignmentError;

  return {
    email: userData.email,
    role: userData.role,
  };
}

export async function updateUserService(
  id: string,
  userData: Partial<{
    email: string;
    name: string;
    role: UserRole;
    password?: string;
  }>,
) {
  const supabase = await createClient();

  // 1. Ambil data saat ini (Strict Type)
  const { data: currentUser, error: fetchError } = await supabase
    .from(TABLES.USERS)
    .select(
      `
      email, 
      name, 
      user_assignments!inner(role)
    `,
    )
    .eq("id", id)
    .single();

  if (fetchError || !currentUser) throw new Error("USER_NOT_FOUND");

  // Cast type untuk mempermudah akses (karena join Supabase return array)
  // eslint-disable-next-line
  const currentAssignment = (currentUser.user_assignments as any)?.[0];

  // eslint-disable-next-line
  const userUpdates: Record<string, any> = {};
  // eslint-disable-next-line
  const assignmentUpdates: Record<string, any> = {};

  // 2. Cek Perubahan Email & Validasi Keunikan
  if (userData.email && userData.email !== currentUser.email) {
    const { data: existingUser } = await supabase
      .from(TABLES.USERS)
      .select("id")
      .eq("email", userData.email)
      .neq("id", id)
      .maybeSingle();

    if (existingUser) throw new Error("EMAIL_ALREADY_EXISTS");
    userUpdates.email = userData.email;
  }

  // 3. Cek Perubahan Nama
  if (userData.name && userData.name !== currentUser.name) {
    userUpdates.name = userData.name;
  }

  // 3.1 Cek Perubahan Password
  if (userData.password && userData.password.trim() !== "") {
    userUpdates.password = bcrypt.hashSync(userData.password, 10);
  }

  // 4. Cek Perubahan Role (Program Scope sengaja tidak dimasukkan sesuai permintaan)
  if (userData.role && userData.role !== currentAssignment?.role) {
    assignmentUpdates.role = userData.role;
  }

  // 5. Eksekusi Update Tabel Users
  if (Object.keys(userUpdates).length > 0) {
    userUpdates.updated_at = new Date().toISOString();
    const { error: userError } = await supabase
      .from(TABLES.USERS)
      .update(userUpdates)
      .eq("id", id);
    if (userError) throw userError;
  }

  // 6. Eksekusi Update Tabel User Assignments
  if (Object.keys(assignmentUpdates).length > 0) {
    assignmentUpdates.updated_at = new Date().toISOString();
    const { error: assignmentError } = await supabase
      .from(TABLES.USER_ASSIGNMENTS)
      .update(assignmentUpdates)
      .eq("user_id", id);
    if (assignmentError) throw assignmentError;
  }

  return true;
}

export async function deleteUserService(id: string) {
  const supabase = await createClient();
  await supabase
    .from(TABLES.USERS)
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id)
    .throwOnError();
}
