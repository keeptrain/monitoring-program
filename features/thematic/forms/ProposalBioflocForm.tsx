"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useProposalBioflocForm } from "../hooks/useProposalBioflocForm";
import { useCallback } from "react";
import FileUploadField from "@/features/documentation/components/FileUploadField";
import LocationFormSection from "@/components/shared/LocationFormSection";
import ProvinceSelect from "@/components/shared/ProvinceSelect";
import { Controller } from "react-hook-form";

export default function ProposalBioflocForm() {
  const { form, onSubmit, isPending, submitError } = useProposalBioflocForm();

  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const proposalPath = watch("proposal_path");

  const handleProposalPathChange = useCallback(
    (path: string) => {
      setValue("proposal_path", path, {
        shouldDirty: true,
        shouldValidate: true,
      });
    },
    [setValue],
  );

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-10">
      {/* Section 1: Informasi KDMP  */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi Pengajuan Proposal</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Field>
            <FieldLabel>Nama KDMP</FieldLabel>
            <Input
              {...register("name")}
              aria-invalid={!!errors.name}
              placeholder="Contoh: KDMP Mina Sejahtera"
            />
            <FieldError>{errors.name?.message}</FieldError>
          </Field>

          <Field>
            <FieldLabel>Provinsi</FieldLabel>
            <Controller
              control={form.control}
              name="province"
              render={({ field }) => (
                <ProvinceSelect
                  value={field.value}
                  onChange={field.onChange}
                  allLabel="Pilih Provinsi"
                  showAll={true}
                  className="w-full"
                  aria-invalid={!!errors.province}
                />
              )}
            />
            <FieldError>{errors.province?.message}</FieldError>
          </Field>

          <Field>
            <FieldLabel>Kabupaten/Kota</FieldLabel>
            <Input
              {...register("regency")}
              aria-invalid={!!errors.regency}
              placeholder="Contoh: Sidoarjo"
            />
            <FieldError>{errors.regency?.message}</FieldError>
          </Field>

          <Field>
            <FieldLabel>Kelurahan</FieldLabel>
            <Input
              {...register("district")}
              aria-invalid={!!errors.district}
              placeholder="Contoh: Sedati Agung"
            />
            <FieldError>{errors.district?.message}</FieldError>
          </Field>

          <Field className="md:col-span-2">
            <FieldLabel>Desa</FieldLabel>
            <Input
              {...register("village")}
              aria-invalid={!!errors.village}
              placeholder="Contoh: Tambak Cemandi"
            />
            <FieldError>{errors.village?.message}</FieldError>
          </Field>
        </CardContent>
      </Card>

      {/* Section 2: Lokasi Map Pick Pin */}
      <Card>
        <CardHeader>
          <CardTitle>Lokasi KDMP</CardTitle>
        </CardHeader>
        <CardContent>
          <LocationFormSection form={form} />
        </CardContent>
      </Card>

      {/* Section 3: Upload Proposal */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Proposal</CardTitle>
        </CardHeader>
        <CardContent>
          <FileUploadField
            value={proposalPath}
            onChange={handleProposalPathChange}
            basePath="proposal-biofloc-thematic"
            accept=".pdf,.doc,.docx"
            error={errors.proposal_path?.message || submitError || undefined}
          />
        </CardContent>
      </Card>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
        Kirim Proposal
      </Button>
    </form>
  );
}
