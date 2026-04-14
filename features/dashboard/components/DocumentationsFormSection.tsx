"use client";

import { useFieldArray, UseFormReturn } from "react-hook-form";
import {
  ProgramPriorityFormInput,
  ProgramPriorityFormValues,
} from "../forms/program-priority-schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { uploadImageAction } from "@/app/actions/report-actions";
import { useState } from "react";

interface ReportFormProps {
  form: UseFormReturn<
    ProgramPriorityFormInput,
    unknown,
    ProgramPriorityFormValues
  >;
}

export default function DocumentationsFormSection({ form }: ReportFormProps) {
  const {
    control,
    formState: { errors },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "documentations",
  });

  const [uploading, setUploading] = useState<{
    [key: string]: boolean;
  }>({});
  const [previews, setPreviews] = useState<{
    [key: string]: string;
  }>({});

  const handleOnChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    fieldId: string,
    fieldName: "image_before_path" | "image_after_path"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview
    const objectUrl = URL.createObjectURL(file);
    const previewKey = `${fieldId}-${fieldName}`;
    setPreviews((prev) => ({ ...prev, [previewKey]: objectUrl }));

    const uploadKey = `${index}-${fieldName}`;
    setUploading((prev) => ({ ...prev, [uploadKey]: true }));

    try {
      const formData = new FormData();
      formData.append("file", file);

      const path = await uploadImageAction(formData);
      form.setValue(`documentations.${index}.${fieldName}`, path, {
        shouldValidate: true,
      });
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setUploading((prev) => ({ ...prev, [uploadKey]: false }));
    }
  };

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
                <div className="relative">
                  <Input
                    type="file"
                    accept="image/*"
                    aria-invalid={
                      !!errors.documentations?.[index]?.image_before_path
                    }
                    onChange={(e) =>
                      handleOnChange(e, index, field.id, "image_before_path")
                    }
                    className={
                      uploading[`${index}-image_before_path`] ? "pr-10" : ""
                    }
                  />
                  {uploading[`${index}-image_before_path`] && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Loader2 className="size-4 animate-spin text-muted-foreground" />
                    </div>
                  )}
                </div>
                {previews[`${field.id}-image_before_path`] && (
                  <div className="mt-2 relative max-w-fit overflow-hidden border border-border bg-muted/20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previews[`${field.id}-image_before_path`]}
                      alt="Preview"
                      className="size-24 object-cover transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                )}
                <FieldError>
                  {errors.documentations?.[index]?.image_before_path?.message}
                </FieldError>
              </Field>

              <Field>
                <FieldLabel className="text-xs uppercase tracking-tight text-muted-foreground">
                  Foto Sesudah
                </FieldLabel>
                <div className="relative">
                  <Input
                    type="file"
                    accept="image/*"
                    aria-invalid={
                      !!errors.documentations?.[index]?.image_after_path
                    }
                    onChange={(e) =>
                      handleOnChange(e, index, field.id, "image_after_path")
                    }
                    className={
                      uploading[`${index}-image_after_path`] ? "pr-10" : ""
                    }
                  />
                  {uploading[`${index}-image_after_path`] && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Loader2 className="size-4 animate-spin text-muted-foreground" />
                    </div>
                  )}
                </div>
                {previews[`${field.id}-image_after_path`] && (
                  <div className="mt-2 relative max-w-fit overflow-hidden border border-border bg-muted/20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previews[`${field.id}-image_after_path`]}
                      alt="Preview"
                      className="size-24 object-cover transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                )}
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
