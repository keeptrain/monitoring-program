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
  ThematicProgramFormInput,
  ThematicProgramFormValues,
} from "../forms/thematic-program-schema";

interface ThematicFormProps {
  form: UseFormReturn<
    ThematicProgramFormInput,
    undefined,
    ThematicProgramFormValues
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
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <Field>
        <FieldLabel htmlFor="name">Nama Program (KDMP)</FieldLabel>
        <Input
          {...register("name")}
          aria-invalid={!!errors.name}
          placeholder="Contoh: Infrastruktur Jalan"
        />
        <FieldError>{errors.name?.message}</FieldError>
      </Field>

      <Field>
        <FieldLabel htmlFor="progress_percent">
          Persentase Pengerjaan (%)
        </FieldLabel>
        <Input
          {...register("progress_percent", {
            maxLength: 3,
          })}
          aria-invalid={!!errors.progress_percent}
          type="number"
          placeholder="0-100"
        />
        <FieldDescription>
          * disesuaikan dengan persentase pengerjaan program
        </FieldDescription>
        <FieldError>{errors.progress_percent?.message}</FieldError>
      </Field>

      <Field>
        <FieldLabel htmlFor="commodity">Komoditas</FieldLabel>
        <Input
          {...register("commodity")}
          aria-invalid={!!errors.commodity}
          placeholder="Contoh: Udang Vaname"
        />
        <FieldError>{errors.commodity?.message}</FieldError>
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
        <FieldLabel htmlFor="production">Produksi</FieldLabel>
        <Input
          {...register("production")}
          aria-invalid={!!errors.production}
          placeholder="Contoh: 100 Ton"
        />
        <FieldError>{errors.production?.message}</FieldError>
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
        <FieldLabel htmlFor="total_admin">Total Admin</FieldLabel>
        <Input
          {...register("total_admin")}
          aria-invalid={!!errors.total_admin}
          type="number"
          placeholder="0"
        />
        <FieldError>{errors.total_admin?.message}</FieldError>
      </Field>

      <Field>
        <FieldLabel htmlFor="distribution_amount">Jumlah Distribusi</FieldLabel>
        <Input
          {...register("distribution_amount")}
          aria-invalid={!!errors.distribution_amount}
          type="number"
          placeholder="0"
        />
        <FieldError>{errors.distribution_amount?.message}</FieldError>
      </Field>
    </div>
  );
}
