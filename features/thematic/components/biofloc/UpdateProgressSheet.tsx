"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  UpdateProgressFormInput,
  UpdateProgressFormValues,
} from "../../forms/update-progress-schema";
import { UseFormReturn } from "react-hook-form";
import { Loader2 } from "lucide-react";

type UpdateProgressSheetProps = {
  form: UseFormReturn<
    UpdateProgressFormInput,
    undefined,
    UpdateProgressFormValues
  >;
  setSheetOpen: (open: boolean) => void;
  onSubmit: (values: UpdateProgressFormValues) => void;
  isPending: boolean;
  submitError: string | null;
};

export default function UpdateProgressSheet({
  form,
  setSheetOpen,
  onSubmit,
  isPending,
  submitError,
}: UpdateProgressSheetProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
      <Field>
        <FieldTitle>Persentase Capaian (%)</FieldTitle>
        <Input
          type="number"
          min={0}
          max={100}
          className="mt-2"
          aria-invalid={!!errors.progress_percent}
          {...register("progress_percent", {
            valueAsNumber: true,
          })}
        />
        <FieldError>{errors.progress_percent?.message}</FieldError>
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
