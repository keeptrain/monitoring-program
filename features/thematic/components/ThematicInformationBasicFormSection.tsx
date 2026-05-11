"use client";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import {
  BioflocProgramFormInput,
  BioflocProgramFormValues,
} from "../forms/biofloc-program-schema";
import { handleInputNumberValueChange, handleNumberKeyDown } from "@/lib/utils";

interface ThematicFormProps {
  form: UseFormReturn<
    BioflocProgramFormInput,
    undefined,
    BioflocProgramFormValues
  >;
}

export default function ThematicInformationBasicFormSection({
  form,
}: ThematicFormProps) {
  const {
    register,
    formState: { errors },
  } = form;
  return (
    <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
      <Field>
        <FieldLabel htmlFor="progress_percent">
          Persentase Pengerjaan (%)
        </FieldLabel>
        <Input
          {...form.register("progress_percent", {
            onChange: handleInputNumberValueChange,
          })}
          maxLength={3}
          onKeyDown={handleNumberKeyDown}
          inputMode="numeric"
          aria-invalid={!!errors.progress_percent}
          placeholder="0-100"
        />
        <FieldDescription>
          * disesuaikan dengan persentase pengerjaan program
        </FieldDescription>
        <FieldError>{errors.progress_percent?.message}</FieldError>
      </Field>

      <Field>
        <FieldLabel htmlFor="commodity_aid">Komoditas Bantuan</FieldLabel>
        <Input
          {...register("commodity_aid")}
          aria-invalid={!!errors.commodity_aid}
          placeholder="Contoh: Udang Vaname"
        />
        <FieldError>{errors.commodity_aid?.message}</FieldError>
      </Field>

      <Field>
        <FieldLabel htmlFor="commodity_potential">Komoditas Potensi</FieldLabel>
        <Input
          {...register("commodity_potential")}
          aria-invalid={!!errors.commodity_potential}
          placeholder="Contoh: Nila"
        />
        <FieldError>{errors.commodity_potential?.message}</FieldError>
      </Field>

      <Field>
        <FieldLabel htmlFor="land_area">Luas Lahan</FieldLabel>
        <Input
          {...register("land_area")}
          aria-invalid={!!errors.land_area}
          placeholder="Contoh: 10 Ha"
        />
        <FieldError>{errors.land_area?.message}</FieldError>
      </Field>

      <Field>
        <FieldLabel htmlFor="production_value">Produksi</FieldLabel>
        <Input
          {...register("production_value")}
          aria-invalid={!!errors.production_value}
          placeholder="Contoh: 100 Ton"
        />
        <FieldError>{errors.production_value?.message}</FieldError>
      </Field>

      <Field>
        <FieldLabel htmlFor="sppg_partner">Mitra SPPG</FieldLabel>
        <Input
          {...register("sppg_partner")}
          aria-invalid={!!errors.sppg_partner}
          placeholder="Nama Mitra Koperasi"
        />
        <FieldError>{errors.sppg_partner?.message}</FieldError>
      </Field>

      <Field>
        <FieldLabel htmlFor="distribution_amount">Jumlah Distribusi</FieldLabel>
        <Input
          {...form.register("distribution_amount", {
            onChange: handleInputNumberValueChange,
          })}
          onKeyDown={handleNumberKeyDown}
          inputMode="numeric"
          placeholder="Masukkan jumlah distribusi"
          aria-invalid={!!errors.distribution_amount}
        />
        <FieldError>{errors.distribution_amount?.message}</FieldError>
      </Field>
    </div>
  );
}
