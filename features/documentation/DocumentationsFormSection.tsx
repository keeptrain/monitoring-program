"use client";

import Image from "next/image";
import { Loader2Icon, Plus, Trash2 } from "lucide-react";
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
} from "./forms/documentation-schema";

type DocumentationsFormSectionProps = {
  /** Pass any `UseFormReturn` whose schema extends `documentationFormSchema`. */
  form: unknown;
  maxGroups?: number;
  externalErrorMessage?: string | null;
  storageBasePath?: string;
};

export default function DocumentationsFormSection({
  form,
  maxGroups = 5,
  externalErrorMessage,
  storageBasePath = "documentations",
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
                <RemoveGroupButton onRemove={() => remove(index)} />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Foto Sebelum */}
                <DocumentationImageField
                  label="Foto Sebelum"
                  paths={beforePaths}
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
                />

                {/* Foto Sesudah */}
                <DocumentationImageField
                  label="Foto Sesudah"
                  paths={afterPaths}
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

// Sub-components (isolated from parent re-renders)
function DocumentationImageField({
  label,
  paths,
  localPreviews,
  altPrefix,
  errorMessage,
  onFilesSelected,
}: {
  label: string;
  paths: string[];
  localPreviews: Record<string, string>;
  altPrefix: string;
  errorMessage?: string;
  onFilesSelected: (files: FileList | null) => void;
}) {
  return (
    <Field>
      <FieldLabel className="text-xs uppercase">{label}</FieldLabel>
      <FileInput onFilesSelected={onFilesSelected} />
      {paths.length > 0 && (
        <div className="mt-2 grid grid-cols-3 gap-2">
          {paths.map((path, i) => (
            <div
              key={`${path}-${i}`}
              className="border-border bg-muted/20 relative h-20 w-full overflow-hidden border"
            >
              <Image
                src={toPreviewUrl(path, localPreviews)}
                alt={`${altPrefix}-${i + 1}`}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ))}
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
    <div className="border-border bg-muted/20 relative flex h-20 w-full items-center justify-center overflow-hidden border">
      <Loader2Icon className="mr-2 size-4 animate-spin" />
      <p className="text-muted-foreground text-xs">Mengunggah...</p>
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
      Grup Dokumentasi
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
      className="text-muted-foreground hover:text-destructive"
      disabled={isUploading}
    >
      <Trash2 />
    </Button>
  );
}
