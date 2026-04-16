"use client";

import { createBrowserClient } from "@supabase/ssr";
import { UseFormReturn } from "react-hook-form";
import {
  ThematicProgramFormInput,
  ThematicProgramFormValues,
} from "../forms/thematic-program-schema";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";

interface ThematicFormProps {
  form: UseFormReturn<
    ThematicProgramFormInput,
    undefined,
    ThematicProgramFormValues
  >;
}

export default function SCurveFormSection({ form }: ThematicFormProps) {
  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      ),
    [],
  );

  const {
    formState: { errors },
  } = form;

  const [uploading, setUploading] = useState(false);

  const handleOnChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const ext = file.name.split(".").pop() ?? "bin";
      const fileName = `${crypto.randomUUID()}-${Date.now()}.${ext}`;
      const storagePath = `thematic/${fileName}`;

      const { data, error } = await supabase.storage
        .from("demo")
        .upload(storagePath, file, {
          upsert: false,
        });

      if (error) {
        throw error;
      }
      form.setValue("s_curve_path", data.path, {
        shouldDirty: true,
        shouldValidate: true,
      });
    } catch (error) {
      console.error("Upload failed", error);
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
            accept="image/*"
            aria-invalid={!!errors.s_curve_path}
            onChange={handleOnChange}
            className={uploading ? "pr-10" : ""}
          />
          {uploading && (
            <div className="absolute top-1/2 right-3 -translate-y-1/2">
              <Loader2 className="text-muted-foreground size-4 animate-spin" />
            </div>
          )}
        </div>
        <FieldError>{errors.s_curve_path?.message}</FieldError>
      </Field>
    </div>
  );
}
