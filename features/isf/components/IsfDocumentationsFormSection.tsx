"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import {
  IsfReportFormInput,
  IsfReportFormValues,
} from "../forms/isf-report-schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";

export default function IsfDocumentationsFormSection({
  form,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<IsfReportFormInput, any, IsfReportFormValues>;
}) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      ),
    [],
  );

  const {
    control,
    watch,
    formState: { errors },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "documentations",
  });
  const documentations = watch("documentations");

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
    fieldName: "image_before_path" | "image_after_path",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    const previewKey = `${fieldId}-${fieldName}`;
    setPreviews((prev) => ({ ...prev, [previewKey]: objectUrl }));

    const uploadKey = `${index}-${fieldName}`;
    setUploading((prev) => ({ ...prev, [uploadKey]: true }));

    try {
      const ext = file.name.split(".").pop() ?? "bin";
      const fileName = `${crypto.randomUUID()}-${Date.now()}.${ext}`;
      const storagePath = `isf/${fileName}`;

      const { data, error } = await supabase.storage
        .from("demo")
        .upload(storagePath, file, {
          upsert: false,
        });

      if (error) {
        throw error;
      }
      form.setValue(`documentations.${index}.${fieldName}`, data.path, {
        shouldDirty: true,
        shouldValidate: true,
      });
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setUploading((prev) => ({ ...prev, [uploadKey]: false }));
    }
  };

  const getStoredPreviewUrl = (savedPath?: string): string | undefined => {
    if (!savedPath) return undefined;
    if (savedPath.startsWith("http://") || savedPath.startsWith("https://")) {
      return savedPath;
    }
    if (!supabaseUrl) return undefined;

    const normalizedPath = savedPath.replace(/^\/+/, "");
    const match = normalizedPath.match(/^([^/]+)\/(.+)$/);

    if (
      match &&
      ["demo", "priority_program", "thematic", "isf"].includes(match[1])
    ) {
      return `${supabaseUrl}/storage/v1/object/public/${match[1]}/${match[2]}`;
    }

    return `${supabaseUrl}/storage/v1/object/public/demo/${normalizedPath}`;
  };

  const getPreviewSrc = (
    previewKey: string,
    savedPath?: string,
  ): string | undefined =>
    previews[previewKey] ?? getStoredPreviewUrl(savedPath);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {fields.map((field, index) => {
          const beforePreviewSrc = getPreviewSrc(
            `${field.id}-image_before_path`,
            documentations?.[index]?.image_before_path,
          );
          const afterPreviewSrc = getPreviewSrc(
            `${field.id}-image_after_path`,
            documentations?.[index]?.image_after_path,
          );

          return (
            <div
              key={field.id}
              className="group border-border bg-background hover:bg-muted/30 relative border p-4 transition-colors"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                  Dokumentasi #{index + 1}
                </span>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive size-8"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field>
                  <FieldLabel className="text-muted-foreground text-xs tracking-tight uppercase">
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
                      <div className="absolute top-1/2 right-3 -translate-y-1/2">
                        <Loader2 className="text-muted-foreground size-4 animate-spin" />
                      </div>
                    )}
                  </div>
                  {beforePreviewSrc && (
                    <div className="border-border bg-muted/20 relative mt-2 max-w-fit overflow-hidden border text-xs">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={beforePreviewSrc}
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
                  <FieldLabel className="text-muted-foreground text-xs tracking-tight uppercase">
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
                      <div className="absolute top-1/2 right-3 -translate-y-1/2">
                        <Loader2 className="text-muted-foreground size-4 animate-spin" />
                      </div>
                    )}
                  </div>
                  {afterPreviewSrc && (
                    <div className="border-border bg-muted/20 relative mt-2 max-w-fit overflow-hidden border text-xs">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={afterPreviewSrc}
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
          );
        })}
      </div>

      <Button
        type="button"
        variant="outline"
        className="hover:bg-muted w-full border-dashed py-6"
        onClick={() => append({ image_before_path: "", image_after_path: "" })}
        disabled={fields.length >= 5}
      >
        <Plus className="mr-2 size-4" /> Tambah Dokumentasi
      </Button>
    </div>
  );
}
