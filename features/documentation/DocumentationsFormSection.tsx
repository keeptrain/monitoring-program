"use client";

import Image from "next/image";
import { Loader2Icon, Plus, Trash2, XIcon, FileText } from "lucide-react";
import { useIsMutating } from "@tanstack/react-query";
import type { UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toPreviewUrl } from "@/lib/utils";
import { getDocumentationsUploadMutationKey } from "./hooks/useDocumentationsUpload";
import useDocumentationsForm from "./hooks/useDocumentationsForm";
import {
  DEFAULT_GROUP,
  type DocumentationFormInput,
  type DocumentationFormValue,
  type DocumentationGroup,
  type DocumentationImage,
} from "./forms/documentation-schema";

type DocumentationsFormSectionProps = {
  /** Pass any `UseFormReturn` whose schema extends `documentationFormSchema`. */
  form: unknown;
  maxGroups?: number;
  externalErrorMessage?: string | null;
  storageBasePath?: string;
  /** "create" = thumbnail grid (default), "edit" = compact file-name list */
  mode: "create" | "edit";
};

export default function DocumentationsFormSection({
  form,
  maxGroups = 5,
  externalErrorMessage,
  storageBasePath = "documentations",
  mode = "create",
}: DocumentationsFormSectionProps) {
  const typedForm = form as UseFormReturn<
    DocumentationFormInput,
    undefined,
    DocumentationFormValue
  >;

  const {
    fields,
    append,
    remove,
    removeImagePath,
    docs,
    canAddGroup,
    localPreviews,
    displayedErrorMessage,
    handleUpload,
  } = useDocumentationsForm({
    form: typedForm,
    maxGroups,
    externalErrorMessage,
    storageBasePath,
  });

  const errors = typedForm.formState.errors;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {fields.map((field, index) => {
          const group = docs[index] ?? DEFAULT_GROUP;
          const beforeImages = group.image_before_paths ?? [];
          const afterImages = group.image_after_paths ?? [];

          return (
            <div
              key={field.id}
              className="border-border bg-background border p-4 shadow-sm"
            >
              <div className="mb-4 flex items-center justify-between">
                <p className="text-muted-foreground text-[10px] font-semibold tracking-widest uppercase">
                  Grup Dokumentasi #{index + 1}
                </p>
                <RemoveGroupButton onRemove={() => remove(index)} />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Foto Sebelum */}
                <DocumentationImageField
                  mode={mode}
                  label="Foto Sebelum"
                  images={beforeImages}
                  localPreviews={localPreviews}
                  altPrefix={`Dokumentasi sebelum ${index + 1}`}
                  errorMessage={
                    (
                      errors as {
                        documentations?: Array<{
                          image_before_paths?: { message?: string };
                        }>;
                      }
                    ).documentations?.[index]?.image_before_paths?.message
                  }
                  onFilesSelected={(files) =>
                    handleUpload(index, "image_before_paths", files)
                  }
                  onRemoveImage={(pathIndex) =>
                    removeImagePath(index, "image_before_paths", pathIndex)
                  }
                />

                {/* Foto Sesudah */}
                <DocumentationImageField
                  mode={mode}
                  label="Foto Sesudah"
                  images={afterImages}
                  localPreviews={localPreviews}
                  altPrefix={`Dokumentasi sesudah ${index + 1}`}
                  errorMessage={
                    (
                      errors as {
                        documentations?: Array<{
                          image_after_paths?: { message?: string };
                        }>;
                      }
                    ).documentations?.[index]?.image_after_paths?.message
                  }
                  onFilesSelected={(files) =>
                    handleUpload(index, "image_after_paths", files)
                  }
                  onRemoveImage={(pathIndex) =>
                    removeImagePath(index, "image_after_paths", pathIndex)
                  }
                />
              </div>
            </div>
          );
        })}
      </div>

      <UploadingIndicator />
      <AddGroupButton canAddGroup={canAddGroup} append={append} />

      {displayedErrorMessage && (
        <FieldError>{displayedErrorMessage}</FieldError>
      )}
    </div>
  );
}

// ─── Sub-components (isolated from parent re-renders) ────────────────────────

function DocumentationImageField({
  mode,
  label,
  images,
  localPreviews,
  altPrefix,
  errorMessage,
  onFilesSelected,
  onRemoveImage,
}: {
  mode: "create" | "edit";
  label: string;
  images: DocumentationImage[];
  localPreviews: Record<string, string>;
  altPrefix: string;
  errorMessage?: string;
  onFilesSelected: (files: FileList | null) => void;
  onRemoveImage: (index: number) => void;
}) {
  return (
    <Field>
      <FieldLabel className="text-xs uppercase">{label}</FieldLabel>
      <FileInput onFilesSelected={onFilesSelected} />

      {images.length > 0 && mode === "create" && (
        <div className="mt-2 grid grid-cols-3 gap-2">
          {images.map((img, i) => (
            <div
              key={`${img.path}-${i}`}
              className="group border-border bg-muted/20 relative h-20 w-full overflow-hidden border"
            >
              <Image
                src={toPreviewUrl(img.path, localPreviews)}
                alt={`${altPrefix}-${i + 1}`}
                fill
                className="object-cover"
                unoptimized
              />
              <button
                type="button"
                onClick={() => onRemoveImage(i)}
                className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black"
              >
                <Trash2 className="size-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {images.length > 0 && mode === "edit" && (
        <div className="mt-2 space-y-1">
          {images.map((img, i) => {
            const previewUrl = toPreviewUrl(img.path, localPreviews);

            return (
              <div
                key={`${img.path}-${i}`}
                className="border-border bg-muted/20 hover:bg-muted/40 flex items-center justify-between border px-3 py-2 text-xs transition-colors"
              >
                <div className="flex items-center gap-2 overflow-hidden pr-4">
                  <FileText className="text-muted-foreground size-3 shrink-0" />
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary truncate font-medium hover:underline"
                    title="Buka preview di tab baru"
                  >
                    {img.file_name}
                  </a>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveImage(i)}
                  className="text-muted-foreground hover:text-destructive shrink-0 transition-colors"
                >
                  <XIcon className="size-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      <FieldError>{errorMessage}</FieldError>
    </Field>
  );
}

/**
 * Isolated file input — only re-renders when upload status changes.
 */
function FileInput({
  onFilesSelected,
}: {
  onFilesSelected: (files: FileList | null) => void;
}) {
  const isUploading =
    useIsMutating({
      mutationKey: getDocumentationsUploadMutationKey(),
    }) > 0;

  return (
    <Input
      type="file"
      accept="image/*"
      multiple
      disabled={isUploading}
      onChange={(e) => onFilesSelected(e.target.files)}
    />
  );
}

/**
 * Isolated uploading indicator — only re-renders when mutation count changes.
 */
function UploadingIndicator() {
  const count = useIsMutating({
    mutationKey: getDocumentationsUploadMutationKey(),
  });
  if (count < 1) return null;

  return (
    <div className="border-border bg-muted/20 relative flex h-14 w-full items-center justify-center overflow-hidden border">
      <Loader2Icon className="mr-2 size-4 animate-spin" />
      <p className="text-muted-foreground text-xs font-medium">
        Sedang mengunggah...
      </p>
    </div>
  );
}

/**
 * Isolated add-group button — hidden while uploading or at max capacity.
 */
function AddGroupButton({
  canAddGroup,
  append,
}: {
  canAddGroup: boolean;
  append: (value: DocumentationGroup) => void;
}) {
  const isUploading =
    useIsMutating({
      mutationKey: getDocumentationsUploadMutationKey(),
    }) > 0;

  if (isUploading || !canAddGroup) return null;

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full border-dashed"
      onClick={() => append({ ...DEFAULT_GROUP })}
    >
      <Plus className="mr-2 size-4" />
      Grup Dokumentasi Baru
    </Button>
  );
}

/**
 * Isolated remove button — disabled while uploading.
 */
function RemoveGroupButton({ onRemove }: { onRemove: () => void }) {
  const isUploading =
    useIsMutating({
      mutationKey: getDocumentationsUploadMutationKey(),
    }) > 0;

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      onClick={onRemove}
      className="text-muted-foreground hover:text-destructive h-8 w-8"
      disabled={isUploading}
    >
      <Trash2 className="size-4" />
    </Button>
  );
}
