"use server";

import { revalidatePath } from "next/cache";
import * as db from "../services/users-services";
import z from "zod";
import { userSchema } from "../forms/user-schema";
import { User } from "@/features/auth/types/user";
import { session } from "@/features/auth/session";

export type UserActionState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export async function getUsers(): Promise<User[]> {
  const { programScope } = await session();
  return db.getUsersService(programScope);
}

export async function createUser(
  prevState: UserActionState | null,
  formData: FormData,
): Promise<UserActionState> {
  const validatedFields = userSchema.safeParse({
    email: formData.get("email"),
    fullName: formData.get("fullName"),
    role: formData.get("role"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: z.flattenError(validatedFields.error).fieldErrors,
    };
  }

  try {
    // await createUserService(validatedFields.data);
    return { success: true, message: "User berhasil dibuat" };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Gagal membuat user",
    };
  }
}

export async function updateUserAction(
  id: string,
  prevState: UserActionState | null,
  formData: FormData,
): Promise<UserActionState> {
  const rawData = Object.fromEntries(formData.entries());
  const validatedFields = userSchema.partial().safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: z.flattenError(validatedFields.error).fieldErrors,
    };
  }

  try {
    await db.updateUserService(id, validatedFields.data);
    revalidatePath("/dashboard/users");
    return { success: true, message: "User berhasil diperbarui" };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Gagal memperbarui user",
    };
  }
}

export async function deleteUserAction(id: string): Promise<UserActionState> {
  try {
    await db.deleteUserService(id);
    revalidatePath("/dashboard/users");
    return { success: true, message: "User berhasil dihapus" };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Gagal menghapus user",
    };
  }
}
