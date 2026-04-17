"use client";

import { UseFormReturn } from "react-hook-form";
import {
  IsfReportFormInput,
  IsfReportFormValues,
} from "../forms/isf-report-schema";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { handleInputNumberValueChange } from "@/lib/utils";

export default function IsfInformationBasicFormSection({
  form,
}: {
  form: UseFormReturn<IsfReportFormInput, undefined, IsfReportFormValues>;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field>
          <FieldLabel>Nama Laporan</FieldLabel>
          <Input
            {...form.register("name")}
            aria-invalid={!!form.formState.errors.name}
            placeholder="Masukkan nama laporan"
          />
          <FieldError>{form.formState.errors.name?.message}</FieldError>
        </Field>
        <Field>
          <FieldLabel>Tanggal Laporan</FieldLabel>
          <Input
            type="date"
            {...form.register("progress_date")}
            aria-invalid={!!form.formState.errors.progress_date}
          />
          <FieldError>
            {form.formState.errors.progress_date?.message}
          </FieldError>
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field>
          <FieldLabel>Status</FieldLabel>
          <NativeSelect
            {...form.register("status")}
            className="w-full"
            aria-invalid={!!form.formState.errors.status}
          >
            <NativeSelectOption value="" disabled>
              Pilih Status
            </NativeSelectOption>
            <NativeSelectOption value="Baru">Baru</NativeSelectOption>
            <NativeSelectOption value="Sedang Berjalan">
              Sedang Berjalan
            </NativeSelectOption>
            <NativeSelectOption value="Selesai">Selesai</NativeSelectOption>
          </NativeSelect>
          <FieldError>
            {form.formState.errors.status?.message as string}
          </FieldError>
        </Field>
        <Field>
          <FieldLabel>Progres (%)</FieldLabel>
          <Input
            type="number"
            {...form.register("progress_percent")}
            aria-invalid={!!form.formState.errors.progress_percent}
          />
          <FieldError>
            {form.formState.errors.progress_percent?.message}
          </FieldError>
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field>
          <FieldLabel>Nama Penyedia</FieldLabel>
          <Input
            {...form.register("provider_name")}
            placeholder="Masukkan nama PT/Penyedia"
            aria-invalid={!!form.formState.errors.provider_name}
          />
          <FieldError>
            {form.formState.errors.provider_name?.message as string}
          </FieldError>
        </Field>
        <Field>
          <FieldLabel>Produksi</FieldLabel>
          <Input
            {...form.register("production")}
            placeholder="Contoh: 1.2 Ton"
            aria-invalid={!!form.formState.errors.production}
          />
          <FieldError>{form.formState.errors.production?.message}</FieldError>
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field>
          <FieldLabel>Intervensi</FieldLabel>
          <Input
            {...form.register("intervention")}
            placeholder="Jenis intervensi yang dilakukan"
            aria-invalid={!!form.formState.errors.intervention}
          />
          <FieldError>{form.formState.errors.intervention?.message}</FieldError>
        </Field>
        <Field>
          <FieldLabel>Tenaga Kerja</FieldLabel>
          <Input
            {...form.register("total_worker", {
              onChange: handleInputNumberValueChange,
            })}
            pattern="^-?[0-9]*\.?[0-9]*$"
            inputMode="text"
            aria-invalid={!!form.formState.errors.total_worker}
            placeholder="Jumlah orang"
          />
          <FieldError>
            {form.formState.errors.total_worker?.message as string}
          </FieldError>
        </Field>
      </div>
    </div>
  );
}
