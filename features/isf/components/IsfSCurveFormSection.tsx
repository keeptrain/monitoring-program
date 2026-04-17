"use client";

import { UseFormReturn } from "react-hook-form";
import {
  IsfReportFormInput,
  IsfReportFormValues,
} from "../forms/isf-report-schema";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function IsfSCurveFormSection({
  form,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<IsfReportFormInput, any, IsfReportFormValues>;
}) {
  const [uploading, setUploading] = useState(false);

  const handleOnChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Simulate upload
      await new Promise((resolve) => setTimeout(resolve, 1000));
      form.setValue("s_curve_path", file.name, {
        shouldDirty: true,
        shouldValidate: true,
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Field>
        <FieldLabel className="text-muted-foreground text-xs tracking-tight uppercase">
          Unggah Kurva S
        </FieldLabel>
        <div className="relative">
          <Input
            type="file"
            accept=".pdf,.xls,.xlsx,image/*"
            aria-invalid={!!form.formState.errors.s_curve_path}
            onChange={handleOnChange}
            className={uploading ? "pr-10" : ""}
          />
          {uploading && (
            <div className="absolute top-1/2 right-3 -translate-y-1/2">
              <Loader2 className="text-muted-foreground size-4 animate-spin" />
            </div>
          )}
        </div>
        <FieldError>
          {form.formState.errors.s_curve_path?.message as string}
        </FieldError>
      </Field>
    </div>
  );
}
