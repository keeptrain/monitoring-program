"use client";

import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Field, FieldError } from "@/components/ui/field";
import { FileIcon, X, Loader2Icon } from "lucide-react";
import { useState } from "react";
import { SCurveFormInput, SCurveFormValue } from "./forms/scurve-schema";
import useDocumentationsUpload from "./hooks/useDocumentationsUpload";
import { Button } from "@/components/ui/button";

export default function SCurveFormSection({ form }: { form: unknown }) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = form as UseFormReturn<SCurveFormInput, undefined, SCurveFormValue>;

  const { upload, isPending: uploading } = useDocumentationsUpload();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const currentPath = watch("s_curve_path");

  const handleOnChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);
    try {
      const paths = await upload(file, {
        basePath: "s-curves",
      });

      if (paths && paths.length > 0) {
        setValue("s_curve_path", paths[0].path, {
          shouldDirty: true,
          shouldValidate: true,
        });
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Gagal mengunggah file.",
      );
    }
  };

  const handleRemove = () => {
    setValue("s_curve_path", "", {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <div className="space-y-4">
      <Field>
        <div>
          {!currentPath ? (
            <div className="relative flex items-center">
              <Input
                type="file"
                accept=".pdf,.xls,.xlsx"
                className="pr-10"
                aria-invalid={!!errors.s_curve_path}
                onChange={handleOnChange}
                disabled={uploading}
              />
              {uploading && (
                <div className="absolute top-1/2 right-3 -translate-y-1/2">
                  <Loader2Icon className="text-muted-foreground size-4 animate-spin" />
                </div>
              )}
            </div>
          ) : (
            <div className="border-border flex h-8 items-center justify-between border bg-zinc-50/50 px-3 text-sm">
              <div className="flex items-center gap-2 overflow-hidden">
                <FileIcon className="size-4 shrink-0 text-zinc-400" />
                <span className="truncate font-medium text-zinc-700">
                  {currentPath.split("/").pop()}
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={handleRemove}
                className="hover:text-destructive size-7 shrink-0"
              >
                <X className="size-3.5" />
              </Button>
            </div>
          )}
        </div>
        <FieldError>{errors.s_curve_path?.message || errorMessage}</FieldError>
      </Field>
    </div>
  );
}
