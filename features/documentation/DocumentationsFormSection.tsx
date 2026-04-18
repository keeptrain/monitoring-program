"use client";

import { useMemo, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import Image from "next/image";

import useDocumentationsUpload from "@/features/documentation/useDocumentationsUpload";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  DocumentationFormInput,
  DocumentationFormValue,
} from "./documentation-schema";

type DocumentationGroup = DocumentationFormInput["documentations"][number];

type Props = {
  form: unknown;
  maxGroups?: number;
  externalErrorMessage?: string | null;
  storageBasePath?: string;
};

const DEFAULT_GROUP: DocumentationGroup = {
  image_before_paths: [],
  image_after_paths: [],
};

function toPreviewUrl(
  path: string,
  localPreviews?: Record<string, string>,
): string {
  if (localPreviews?.[path]) return localPreviews[path];
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("blob:")) return path;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET;
  if (!supabaseUrl || !bucket) return path;
  const normalizedPath = path.replace(/^\/+/, "");
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${normalizedPath}`;
}

function mergeUnique(existing: string[], incoming: string[]) {
  return [...new Set([...existing, ...incoming])];
}

export default function DocumentationsFormSection({
  form,
  maxGroups = 20,
  externalErrorMessage,
  storageBasePath = "documentations",
}: Props) {
  const typedForm = form as UseFormReturn<
    DocumentationFormInput,
    undefined,
    DocumentationFormValue
  >;

  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = typedForm;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "documentations",
  });

  const { upload, isPending: isUploading } = useDocumentationsUpload();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [localPreviews, setLocalPreviews] = useState<Record<string, string>>(
    {},
  );

  const docs = (watch("documentations") ?? []) as DocumentationGroup[];
  const canAddGroup = fields.length < maxGroups;
  const displayedErrorMessage = useMemo(
    () => externalErrorMessage ?? errorMessage,
    [externalErrorMessage, errorMessage],
  );

  const setGroupPaths = (
    groupIndex: number,
    field: "image_before_paths" | "image_after_paths",
    paths: string[],
  ) => {
    setValue(`documentations.${groupIndex}.${field}`, paths, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleUpload = async (
    groupIndex: number,
    field: "image_before_paths" | "image_after_paths",
    fileList: FileList | null,
  ) => {
    if (!fileList || fileList.length === 0) return;
    setErrorMessage(null);

    try {
      const files = Array.from(fileList);
      const uploadedPaths = await upload(fileList, {
        basePath: storageBasePath,
      });

      // Create local object URLs for immediate preview
      const newPreviews: Record<string, string> = { ...localPreviews };
      uploadedPaths.forEach((path, index) => {
        if (files[index]) {
          newPreviews[path] = URL.createObjectURL(files[index]);
        }
      });
      setLocalPreviews(newPreviews);

      const group = docs[groupIndex] ?? DEFAULT_GROUP;
      const current = group[field] ?? [];
      const merged = mergeUnique(current, uploadedPaths);
      setGroupPaths(groupIndex, field, merged);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Upload dokumentasi gagal. Silakan coba lagi.";
      setErrorMessage(message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {fields.map((field, index) => {
          const group = docs[index] ?? DEFAULT_GROUP;
          const beforePaths = group.image_before_paths ?? [];
          const afterPaths = group.image_after_paths ?? [];

          return (
            <div
              key={field.id}
              className="border-border bg-background border p-4"
            >
              <div className="mb-4 flex items-center justify-between">
                <p className="text-muted-foreground text-[10px] font-semibold tracking-widest uppercase">
                  Grup Dokumentasi #{index + 1}
                </p>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => remove(index)}
                    className="text-muted-foreground hover:text-destructive"
                    disabled={isUploading}
                  >
                    <Trash2 />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field>
                  <FieldLabel className="text-xs uppercase">
                    Foto Sebelum
                  </FieldLabel>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={isUploading}
                    onChange={(e) =>
                      handleUpload(index, "image_before_paths", e.target.files)
                    }
                  />
                  {beforePaths.length > 0 ? (
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {beforePaths.map((path, imageIndex) => (
                        <div
                          key={`${path}-${imageIndex}`}
                          className="border-border bg-muted/20 relative h-20 w-full overflow-hidden border"
                        >
                          <Image
                            src={toPreviewUrl(path, localPreviews)}
                            alt={`Dokumentasi sebelum ${index + 1}-${imageIndex + 1}`}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      ))}
                    </div>
                  ) : null}
                  <FieldError>
                    {
                      (
                        errors as {
                          documentations?: Array<{
                            image_before_paths?: { message?: string };
                          }>;
                        }
                      ).documentations?.[index]?.image_before_paths?.message
                    }
                  </FieldError>
                </Field>
                <Field>
                  <FieldLabel className="text-xs uppercase">
                    Foto Sesudah
                  </FieldLabel>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={isUploading}
                    onChange={(e) =>
                      handleUpload(index, "image_after_paths", e.target.files)
                    }
                  />
                  {afterPaths.length > 0 ? (
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {afterPaths.map((path, imageIndex) => (
                        <div
                          key={`${path}-${imageIndex}`}
                          className="border-border bg-muted/20 relative h-20 w-full overflow-hidden border"
                        >
                          <Image
                            src={toPreviewUrl(path, localPreviews)}
                            alt={`Dokumentasi sesudah ${index + 1}-${imageIndex + 1}`}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      ))}
                    </div>
                  ) : null}
                  <FieldError>
                    {
                      (
                        errors as {
                          documentations?: Array<{
                            image_after_paths?: { message?: string };
                          }>;
                        }
                      ).documentations?.[index]?.image_after_paths?.message
                    }
                  </FieldError>
                </Field>
              </div>
            </div>
          );
        })}
      </div>

      {isUploading && (
        <p className="text-muted-foreground text-xs">
          Sedang mengunggah file...
        </p>
      )}

      <Button
        type="button"
        variant="outline"
        className="w-full border-dashed"
        onClick={() => append({ ...DEFAULT_GROUP })}
        disabled={!canAddGroup || isUploading}
      >
        <Plus className="mr-2 size-4" />
        Tambah Grup Dokumentasi
      </Button>

      {displayedErrorMessage ? (
        <p className="text-destructive text-xs">{displayedErrorMessage}</p>
      ) : null}
    </div>
  );
}
