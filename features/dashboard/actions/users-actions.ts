"use server";

import { revalidatePath } from "next/cache";
import * as db from "../services/users-services";
import z from "zod";
import { passwordSchema, userSchema } from "../forms/user-schema";
import { User } from "@/features/auth/types/user";
import { getSession } from "@/features/auth/session";

const idSchema = z.uuidv7();

export type UserActionState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  // eslint-disable-next-line
  fields?: Record<string, any>;
};

export async function getUsers(): Promise<User[]> {
  const { sub: userId, role, programScope } = await getSession();
  if (role !== "admin") {
    throw new Error("Unauthorized");
  }

  return db.getUsersService(programScope, userId);
}

export async function createUser(
  prevState: UserActionState | null,
  formData: FormData,
): Promise<UserActionState> {
  const { role, programScope } = await getSession();
  if (role !== "admin") {
    throw new Error("Unauthorized");
  }
  const validatedFields = userSchema
    .extend({
      password: passwordSchema,
    })
    .safeParse({
      email: formData.get("email"),
      name: formData.get("name"),
      role: formData.get("role"),
      password: formData.get("password"),
    });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: z.flattenError(validatedFields.error).fieldErrors,
      fields: {
        email: formData.get("email"),
        name: formData.get("name"),
        role: formData.get("role"),
      },
    };
  }

  try {
    await db.createUserService({
      ...validatedFields.data,
      programScope: programScope,
    });
    revalidatePath("/dashboard/users");
    return { success: true, message: "User berhasil dibuat." };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "EMAIL_ALREADY_EXISTS") {
        return {
          success: false,
          errors: {
            email: ["Email sudah terdaftar"],
          },
          fields: {
            email: formData.get("email"),
            name: formData.get("name"),
            role: formData.get("role"),
          },
        };
      }
    }
    return {
      success: false,
      message: "Gagal membuat user",
      fields: {
        email: formData.get("email"),
        name: formData.get("name"),
        role: formData.get("role"),
      },
    };
  }
}

export async function updateUserAction(
  id: string,
  prevState: UserActionState | null,
  formData: FormData,
): Promise<UserActionState> {
  const { role } = await getSession();
  if (role !== "admin") {
    throw new Error("Unauthorized");
  }
  const validatedFields = userSchema
    .extend({
      password: passwordSchema.optional().or(z.literal("")),
    })
    .partial()
    .safeParse({
      email: formData.get("email"),
      name: formData.get("name"),
      role: formData.get("role"),
      password: formData.get("password"),
    });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: z.flattenError(validatedFields.error).fieldErrors,
      fields: {
        email: formData.get("email"),
        name: formData.get("name"),
        role: formData.get("role"),
      },
    };
  }

  try {
    await db.updateUserService(id, validatedFields.data);
    revalidatePath("/dashboard/users");
    return { success: true, message: "User berhasil diperbarui" };
  } catch (error) {
    if (error instanceof Error && error.message === "EMAIL_ALREADY_EXISTS") {
      return {
        success: false,
        errors: {
          email: ["Email sudah terdaftar oleh pengguna lain"],
        },
        fields: {
          email: formData.get("email"),
          name: formData.get("name"),
          role: formData.get("role"),
        },
      };
    }
    return {
      success: false,
      message: "Gagal memperbarui user",
      fields: {
        email: formData.get("email"),
        name: formData.get("name"),
        role: formData.get("role"),
      },
    };
  }
}

export async function deleteUserAction(id: string): Promise<UserActionState> {
  const validatedId = idSchema.safeParse(id);
  if (!validatedId.success) {
    return {
      success: false,
      message: "Id User tidak valid",
    };
  }

  const { role } = await getSession();
  if (role !== "admin") {
    throw new Error("Unauthorized");
  }

  try {
    await db.deleteUserService(validatedId.data);
    revalidatePath("/dashboard/users");
    return { success: true, message: "User berhasil dihapus" };
  } catch (error) {
    return {
      success: false,
      message: "Gagal menghapus user",
    };
  }
}
