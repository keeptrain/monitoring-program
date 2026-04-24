"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  ProgramQuotaUpdateInput,
  ProgramQuotaUpdateValues,
} from "../../forms/program-quota-schema";
import { UseFormReturn } from "react-hook-form";
import { Loader2 } from "lucide-react";

type UpdateProgramQuotaSheetProps = {
  provinceName: string;
  form: UseFormReturn<
    ProgramQuotaUpdateInput,
    undefined,
    ProgramQuotaUpdateValues
  >;
  setSheetOpen: (open: boolean) => void;
  onSubmit: (values: ProgramQuotaUpdateValues) => void;
  isPending: boolean;
  submitError: string | null;
};

export default function UpdateProgramQuotaSheet({
  provinceName,
  form,
  setSheetOpen,
  onSubmit,
  isPending,
  submitError,
}: UpdateProgramQuotaSheetProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
      <Field>
        <FieldTitle>Provinsi</FieldTitle>
        <Input value={provinceName} readOnly className="mt-2" />
      </Field>

      <Field>
        <FieldTitle>Kuota Program (2026)</FieldTitle>
        <Input
          type="number"
          min={0}
          className="mt-2"
          aria-invalid={!!errors.quota_limit}
          {...register("quota_limit", {
            valueAsNumber: true,
          })}
        />
        <FieldError>{errors.quota_limit?.message}</FieldError>
      </Field>

      <FieldError>{submitError}</FieldError>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={() => setSheetOpen(false)}>
          Batal
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
          Simpan
        </Button>
      </div>
    </form>
  );
}
