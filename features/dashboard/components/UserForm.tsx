import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { useTransition, useState } from "react";
import { createUser, UserActionState } from "../actions/users-actions";
import { SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { parseAsString, useQueryState } from "nuqs";
import { toast } from "sonner";
import { User } from "@/features/auth/types/user";

const USER_ROLES = [
  { value: "admin", label: "Administrator" },
  { value: "officer", label: "Petugas" },
  { value: "pmo", label: "PMO" },
] as const;

export default function UserForm({ initialValues }: { initialValues?: User }) {
  const [, setUserId] = useQueryState("id", parseAsString);
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<UserActionState | null>(null);

  const handleAction = (formData: FormData) => {
    startTransition(async () => {
      const result = await createUser(null, formData);
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
              defaultValue={initialValues?.email}
              aria-invalid={!!errors?.email}
              required
            />
            {errors?.email && <FieldError>{errors.email[0]}</FieldError>}
          </Field>

          <Field>
            <FieldLabel>Nama Lengkap</FieldLabel>
            <Input
              type="text"
              name="fullName"
              defaultValue={initialValues?.name}
              aria-invalid={!!errors?.fullName}
              required
            />
            {errors?.fullName && <FieldError>{errors.fullName}</FieldError>}
          </Field>

          <Field>
            <FieldLabel>Role</FieldLabel>
            <NativeSelect
              name="role"
              defaultValue={initialValues?.role}
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
