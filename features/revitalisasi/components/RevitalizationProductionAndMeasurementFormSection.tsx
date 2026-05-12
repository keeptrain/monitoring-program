"use client";

import { UseFormReturn } from "react-hook-form";
import {
  RevitalizationReportFormInput,
  RevitalizationReportFormValues,
} from "../forms/revitalization-report-schema";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { handleInputNumberValueChange, toPreviewUrl } from "@/lib/utils";
import useDocumentationsUpload from "@/features/documentation/hooks/useDocumentationsUpload";
import { Loader2Icon, Trash2, FileText } from "lucide-react";

interface Props {
  form: UseFormReturn<
    RevitalizationReportFormInput,
    undefined,
    RevitalizationReportFormValues
  >;
}

export default function RevitalizationProductionAndMeasurementFormSection({
  form,
}: Props) {


  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field>
          <FieldLabel>Produksi</FieldLabel>
          <Input
            {...form.register("production")}
            placeholder="Contoh: 1.2 Ton"
            aria-invalid={!!form.formState.errors.production}
          />
          <FieldError>{form.formState.errors.production?.message}</FieldError>
        </Field>
        <Field>
          <FieldLabel>
            Nilai Total Produksi{" "}
            <span className="text-muted-foreground">(Rp)</span>
          </FieldLabel>
          <Input
            {...form.register("total_production_value", {
              onChange: handleInputNumberValueChange,
            })}
            pattern="^-?[0-9]*\.?[0-9]*$"
            inputMode="text"
            aria-invalid={!!form.formState.errors.total_production_value}
            placeholder="Nilai total produksi"
          />
          <FieldError>
            {form.formState.errors.total_production_value?.message as string}
          </FieldError>
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field>
          <FieldLabel>Pemasangan Pal Batas</FieldLabel>
          <Input
            {...form.register("limit_pal", {
              onChange: handleInputNumberValueChange,
            })}
            pattern="^-?[0-9]*\.?[0-9]*$"
            inputMode="text"
            aria-invalid={!!form.formState.errors.limit_pal}
            placeholder="Batas pal"
          />
          <FieldError>
            {form.formState.errors.limit_pal?.message as string}
          </FieldError>
        </Field>
        <DesignFileInput form={form} />
      </div>

      <Field>
        <FieldLabel>Pengukuran titik batas</FieldLabel>
        <Textarea
          {...form.register("limit_point_measurement")}
          aria-invalid={!!form.formState.errors.limit_point_measurement}
          placeholder="Uraian batas titik pengukuran/koordinat"
          className="h-20"
        />
        <FieldError>
          {form.formState.errors.limit_point_measurement?.message as string}
        </FieldError>
      </Field>
    </div>
  );
}

function DesignFileInput({ form }: Props) {
  const { upload, isPending: isUploading } = useDocumentationsUpload();
  const designPath = form.watch("design_path");

  const handleFileChange = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    try {
      const res = await upload(files[0], {
        basePath: "documentations/revitalization/design",
      });
      if (res && res.length > 0) {
        form.setValue("design_path", res[0].path, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    } catch (err) {
      console.error("Upload design error:", err);
    }
  };

  return (
    <Field>
      <FieldLabel>File Desain</FieldLabel>
      {!designPath ? (
        <div className="relative">
          <Input
            type="file"
            accept="image/*,application/pdf"
            disabled={isUploading}
            onChange={(e) => handleFileChange(e.target.files)}
          />
          {isUploading && (
            <div className="absolute inset-y-0 right-3 flex items-center">
              <Loader2Icon className="text-muted-foreground size-4 animate-spin" />
            </div>
          )}
        </div>
      ) : (
        <div className="border-input bg-muted/30 flex h-8 items-center justify-between border p-2 text-xs">
          <div className="flex items-center gap-2 overflow-hidden pr-2">
            <FileText className="text-muted-foreground size-4 shrink-0" />
            <a
              href={toPreviewUrl(designPath)}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary truncate hover:underline"
            >
              {designPath.split("/").pop()}
            </a>
          </div>
          <button
            type="button"
            onClick={() =>
              form.setValue("design_path", null, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
            className="text-muted-foreground hover:text-destructive shrink-0 transition-colors"
            title="Hapus file desain"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      )}
      <FieldError>
        {form.formState.errors.design_path?.message as string}
      </FieldError>
    </Field>
  );
}
