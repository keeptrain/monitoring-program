"use client";

import { UseFormReturn } from "react-hook-form";
import {
  RevitalizationReportFormInput,
  RevitalizationReportFormValues,
} from "../forms/revitalization-report-schema";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

interface RevitalizationDetailRingkasanFormSectionProps {
  form: UseFormReturn<
    RevitalizationReportFormInput,
    undefined,
    RevitalizationReportFormValues
  >;
}

export default function RevitalizationDetailRingkasanFormSection({
  form,
}: RevitalizationDetailRingkasanFormSectionProps) {
  return (
    <div className="space-y-4">
      <Field>
        <FieldLabel className="text-xs tracking-tight uppercase">
          Outcome (Hasil)
        </FieldLabel>
        <Textarea
          {...form.register("outcome")}
          aria-invalid={!!form.formState.errors.outcome}
          placeholder="Jelaskan hasil/outcome yang dicapai"
        />
        <FieldError>{form.formState.errors.outcome?.message}</FieldError>
      </Field>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field>
          <FieldLabel className="text-xs tracking-tight uppercase">
            Kendala{" "}
            <span className="text-muted-foreground text-[10px] lowercase">
              (jika ada)
            </span>
          </FieldLabel>
          <Textarea
            {...form.register("constraints")}
            aria-invalid={!!form.formState.errors.constraints}
            placeholder="Jelaskan kendala jika ada"
          />
          <FieldError>{form.formState.errors.constraints?.message}</FieldError>
        </Field>
        <Field>
          <FieldLabel className="text-xs tracking-tight uppercase">
            Tindak Lanjut{" "}
            <span className="text-muted-foreground text-[10px] lowercase">
              (jika ada)
            </span>
          </FieldLabel>
          <Textarea
            {...form.register("follow_up")}
            aria-invalid={!!form.formState.errors.follow_up}
            placeholder="Rencana tindak lanjut"
          />
          <FieldError>{form.formState.errors.follow_up?.message}</FieldError>
        </Field>
      </div>
    </div>
  );
}
