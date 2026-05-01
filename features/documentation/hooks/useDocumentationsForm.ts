import { useMemo, useState, useCallback } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import useDocumentationsUpload from "./useDocumentationsUpload";
import {
  DEFAULT_GROUP,
  type DocumentationFormInput,
  type DocumentationFormValue,
  type DocumentationGroup,
  type DocumentationImage,
} from "../forms/documentation-schema";

type UseDocumentationsFormOptions = {
  form: UseFormReturn<
    DocumentationFormInput,
    undefined,
    DocumentationFormValue
  >;
  maxGroups?: number;
  externalErrorMessage?: string | null;
  storageBasePath?: string;
};

export default function useDocumentationsForm({
  form,
  maxGroups = 5,
  externalErrorMessage = null,
  storageBasePath = "documentations",
}: UseDocumentationsFormOptions) {
  const { control, watch, setValue } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "documentations",
  });

  const { upload } = useDocumentationsUpload();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [localPreviews, setLocalPreviews] = useState<Record<string, string>>(
    {},
  );

  const watchedDocs = watch("documentations");
  const docs = useMemo(
    () => (watchedDocs ?? []) as DocumentationGroup[],
    [watchedDocs],
  );
  const canAddGroup = fields.length < maxGroups;

  const displayedErrorMessage = useMemo(
    () => externalErrorMessage ?? errorMessage,
    [externalErrorMessage, errorMessage],
  );

  const setGroupPaths = useCallback(
    (
      groupIndex: number,
      field: "image_before_paths" | "image_after_paths",
      images: DocumentationImage[],
    ) => {
      setValue(`documentations.${groupIndex}.${field}`, images, {
        shouldDirty: true,
        shouldValidate: true,
      });
    },
    [setValue],
  );

  const handleUpload = useCallback(
    async (
      groupIndex: number,
      field: "image_before_paths" | "image_after_paths",
      fileList: FileList | null,
    ) => {
      if (!fileList || fileList.length === 0) return;
      setErrorMessage(null);

      try {
        const files = Array.from(fileList);
        const uploadedImages = await upload(fileList, {
          basePath: storageBasePath,
        });

        const newPreviews: Record<string, string> = { ...localPreviews };
        uploadedImages.forEach((img, index) => {
          if (files[index]) {
            newPreviews[img.path] = URL.createObjectURL(files[index]);
          }
        });
        setLocalPreviews(newPreviews);

        const group = docs[groupIndex] ?? DEFAULT_GROUP;
        const current = group[field] ?? [];

        // Merge unique based on path
        const merged = [...current];
        uploadedImages.forEach((newImg) => {
          if (!merged.some((m) => m.path === newImg.path)) {
            merged.push(newImg);
          }
        });

        setGroupPaths(groupIndex, field, merged);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Upload dokumentasi gagal. Silakan coba lagi.";
        setErrorMessage(message);
      }
    },
    [upload, storageBasePath, localPreviews, docs, setGroupPaths],
  );

  const removeImagePath = useCallback(
    (
      groupIndex: number,
      field: "image_before_paths" | "image_after_paths",
      pathIndex: number,
    ) => {
      const group = docs[groupIndex];
      if (!group) return;

      const currentImages = [...(group[field] ?? [])];
      currentImages.splice(pathIndex, 1);
      setGroupPaths(groupIndex, field, currentImages);
    },
    [docs, setGroupPaths],
  );

  return {
    fields,
    append,
    remove,
    removeImagePath,
    docs,
    canAddGroup,
    localPreviews,
    displayedErrorMessage,
    handleUpload,
  };
}
