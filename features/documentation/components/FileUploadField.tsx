"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { FileIcon, Loader2, X } from "lucide-react";
import { ChangeEvent, useCallback, useState } from "react";
import useDocumentationsUpload from "../hooks/useDocumentationsUpload";

interface FileUploadFieldProps {
  /** Current uploaded file path */
  value: string;
  /** Called with the new path after upload, or "" when removed */
  onChange: (path: string) => void;
  /** Supabase Storage sub-folder, e.g. "proposal-biofloc-thematic" */
  basePath?: string;
  /** Accepted file types */
  accept?: string;
  /** External error message (e.g. from form validation) */
  error?: string;
  /** Disable the field */
  disabled?: boolean;
}

export default function FileUploadField({
  value,
  onChange,
  basePath = "uploads",
  accept = ".pdf,.doc,.docx",
  error,
  disabled = false,
}: FileUploadFieldProps) {
  const { upload, isPending: isUploading } = useDocumentationsUpload();
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleUpload = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setUploadError(null);
      try {
        const uploaded = await upload(file, { basePath });
        if (uploaded.length === 0) {
          throw new Error("Upload gagal, coba lagi.");
        }
        onChange(uploaded[0].path);
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : "Upload gagal.");
      }
    },
    [upload, basePath, onChange],
  );

  const handleRemove = useCallback(() => {
    onChange("");
  }, [onChange]);

  const displayError = error || uploadError;

  return (
    <Field>
      {!value ? (
        <div className="relative w-full">
          <Input
            type="file"
            accept={accept}
            onChange={handleUpload}
            disabled={isUploading || disabled}
          />
          {isUploading && (
            <div className="absolute top-1/2 right-3 -translate-y-1/2">
              <Loader2 className="text-muted-foreground size-4 animate-spin" />
            </div>
          )}
        </div>
      ) : (
        <div className="border-input flex h-10 w-full items-center justify-between border bg-zinc-50/50 px-3 text-sm">
          <div className="flex items-center gap-2 overflow-hidden">
            <FileIcon className="size-4 shrink-0 text-zinc-400" />
            <span className="truncate font-medium text-zinc-700">
              {value.split("/").pop()}
            </span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={handleRemove}
            disabled={disabled}
            className="hover:text-destructive size-7"
          >
            <X className="size-3.5" />
          </Button>
        </div>
      )}
      <FieldError>{displayError}</FieldError>
    </Field>
  );
}
