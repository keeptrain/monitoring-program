"use client";

import { useFieldArray, UseFormReturn } from "react-hook-form";
import { ProgramPriorityFormValues } from "../forms/program-priority-schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Plus, Trash2 } from "lucide-react";

interface ReportFormProps {
  form: UseFormReturn<ProgramPriorityFormValues>;
}

export default function DocumentationsFormSection({ form }: ReportFormProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "documentations",
  });

  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="group relative border border-border p-4 bg-background transition-colors hover:bg-muted/30"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Dokumentasi #{index + 1}
              </span>
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 text-muted-foreground hover:text-destructive"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="size-4" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel className="text-xs uppercase tracking-tight text-muted-foreground">
                  Foto Sebelum
                </FieldLabel>
                <Input
                  {...register(`documentations.${index}.image_before_path`)}
                  placeholder="Path foto atau deskripsi..."
                  aria-invalid={
                    !!errors.documentations?.[index]?.image_before_path
                  }
                />
                <FieldError>
                  {errors.documentations?.[index]?.image_before_path?.message}
                </FieldError>
              </Field>

              <Field>
                <FieldLabel className="text-xs uppercase tracking-tight text-muted-foreground">
                  Foto Sesudah
                </FieldLabel>
                <Input
                  {...register(`documentations.${index}.image_after_path`)}
                  placeholder="Path foto atau deskripsi..."
                  aria-invalid={
                    !!errors.documentations?.[index]?.image_after_path
                  }
                />
                <FieldError>
                  {errors.documentations?.[index]?.image_after_path?.message}
                </FieldError>
              </Field>
            </div>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full border-dashed py-6 hover:bg-muted"
        onClick={() => append({ image_before_path: "", image_after_path: "" })}
        disabled={fields.length >= 5}
      >
        <Plus className="mr-2 size-4" /> Tambah Dokumentasi
      </Button>
    </div>
  );
}
