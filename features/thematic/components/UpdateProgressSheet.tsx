import { Field, FieldTitle, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import {
  UpdateProgressFormInput,
  UpdateProgressFormValues,
} from "../forms/update-progress-schema";
import { Button } from "@/components/ui/button";
import ThematicDocumentationsFormSection from "./ThematicDocumentationsFormSection";

type UpdateProgressProps = {
  setSheetOpen: (open: boolean) => void;
  form: UseFormReturn<
    UpdateProgressFormInput,
    undefined,
    UpdateProgressFormValues
  >;
  onSubmit: (values: UpdateProgressFormValues) => void;
};

export default function UpdateProgressSheet({
  setSheetOpen,
  form,
  onSubmit,
}: UpdateProgressProps) {
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
          {...register("percentage_of_work", {
            valueAsNumber: true,
          })}
          className="mt-2"
          min={0}
          max={100}
          aria-invalid={!!errors.percentage_of_work}
        />
        <FieldError>{errors.percentage_of_work?.message}</FieldError>
      </Field>

      <div>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <ThematicDocumentationsFormSection form={form as any} />
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setSheetOpen(false)}
        >
          Batal
        </Button>
        <Button type="submit">Simpan</Button>
      </div>
    </form>
  );
}
