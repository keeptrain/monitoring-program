import { useState, useTransition } from "react";
import { parseAsString, useQueryState } from "nuqs";
import { toast } from "sonner";
import { User } from "@/features/auth/types/user";
import {
  createUser,
  updateUserAction,
  UserActionState,
} from "../actions/users-actions";
import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { SheetFooter } from "@/components/ui/sheet";

const USER_ROLES = [
  { value: "admin", label: "Administrator" },
  { value: "officer", label: "Petugas" },
  { value: "pmo", label: "PMO" },
] as const;

export default function UserForm({ initialValues }: { initialValues?: User }) {
  const isEditMode = !!initialValues;
  const [, setUserId] = useQueryState("id", parseAsString);
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<UserActionState | null>(null);

  const handleAction = async (formData: FormData) => {
    startTransition(async () => {
      const result = isEditMode
        ? await updateUserAction(initialValues.id, null, formData)
        : await createUser(null, formData);

      setState(result);

      if (result.success) {
        setUserId(null);
        toast.success(result.message);
      }
    });
  };

  const errors = state?.errors;

  return (
    <>
      <form id="user-form" action={handleAction} className="px-4">
        <FieldGroup>
          <Field>
            <FieldLabel>Email</FieldLabel>
            <Input
              type="email"
              name="email"
              defaultValue={state?.fields?.email ?? initialValues?.email}
              aria-invalid={!!errors?.email}
              required
            />
            {errors?.email && <FieldError>{errors.email[0]}</FieldError>}
          </Field>

          <Field>
            <FieldLabel>Nama Lengkap</FieldLabel>
            <Input
              type="text"
              name="name"
              defaultValue={state?.fields?.name ?? initialValues?.name}
              aria-invalid={!!errors?.name}
              required
            />
            {errors?.name && <FieldError>{errors.name}</FieldError>}
          </Field>

          <Field>
            <FieldLabel>Password</FieldLabel>
            <Input
              type="password"
              name="password"
              aria-invalid={!!errors?.password}
              placeholder={
                isEditMode
                  ? "Kosongkan jika tidak ingin diubah"
                  : "Minimal 6 karakter"
              }
              required={!isEditMode}
            />
            {errors?.password && <FieldError>{errors.password}</FieldError>}
          </Field>

          <Field>
            <FieldLabel>Role</FieldLabel>
            <NativeSelect
              name="role"
              defaultValue={state?.fields?.role ?? initialValues?.role}
              aria-invalid={!!errors?.role}
              required
            >
              <NativeSelectOption value="">Pilih role</NativeSelectOption>
              {USER_ROLES.map((role) => (
                <NativeSelectOption key={role.value} value={role.value}>
                  {role.label}
                </NativeSelectOption>
              ))}
            </NativeSelect>
            <FieldError>{errors?.role?.[0]}</FieldError>
          </Field>
        </FieldGroup>
      </form>
      <SheetFooter>
        <Button disabled={isPending} form="user-form">
          Simpan
        </Button>
      </SheetFooter>
    </>
  );
}
