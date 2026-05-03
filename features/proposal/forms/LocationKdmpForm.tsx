"use client";

import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useLocationKdmpForm } from "../hooks/useLocationKdmpForm";
import ProposalLocationFormSection from "../components/ProposalLocationFormSection";
import { handleInputNumberValueChange, handleNumberKeyDown } from "@/lib/utils";
import { Controller } from "react-hook-form";
import ProvinceSelect from "@/components/shared/ProvinceSelect";

export default function LocationKdmpForm() {
  const { form, onSubmit } = useLocationKdmpForm();
  const {
    formState: { errors },
  } = form;

  console.log(errors);

  return (
    <form id="step-2-form" onSubmit={onSubmit}>
      <div className="mt-6">
        {/* Map Section */}
        <FieldGroup className="col-span-2">
          <Field>
            <FieldLabel className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                Lokasi <span className="text-destructive">*</span>
              </div>
              <p className="text-muted-foreground text-xs">
                Klik pada peta atau seret pin untuk memilih lokasi.
              </p>
            </FieldLabel>
            <FieldContent>
              <ProposalLocationFormSection form={form} />
              {(errors.latitude || errors.longitude) && (
                <FieldError>
                  Titik lokasi belum ditentukan. Silakan pilih pada peta atau
                  masukkan koordinat secara manual.
                </FieldError>
              )}
            </FieldContent>
          </Field>
        </FieldGroup>

        {/* Administrative Grid */}
        <div className="col-span-2 mt-4 grid grid-cols-2 space-y-4 gap-x-4">
          <Field>
            <FieldLabel>
              Provinsi <span className="text-destructive">*</span>
            </FieldLabel>
            <FieldContent>
              <Controller
                control={form.control}
                name="province_id"
                render={({ field }) => (
                  <ProvinceSelect
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    allLabel="Pilih Provinsi"
                    showAll
                    className="w-full"
                    aria-invalid={!!errors.province_id}
                  />
                )}
              />
            </FieldContent>
            {errors.province_id && (
              <FieldError>{errors.province_id.message}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel>
              Kabupaten/Kota <span className="text-destructive">*</span>
            </FieldLabel>
            <FieldContent>
              <Input
                {...form.register("regency_id")}
                placeholder="Contoh: Sidoarjo"
                aria-invalid={!!errors.regency_id}
              />
            </FieldContent>
            {errors.regency_id && (
              <FieldError>{errors.regency_id.message}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel>
              Kecamatan <span className="text-destructive">*</span>
            </FieldLabel>
            <FieldContent>
              <Input
                {...form.register("district_id")}
                placeholder="Contoh: Gedangan"
                aria-invalid={!!errors.district_id}
              />
            </FieldContent>
            {errors.district_id && (
              <FieldError>{errors.district_id.message}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel>
              Desa/Kelurahan <span className="text-destructive">*</span>
            </FieldLabel>
            <FieldContent>
              <Input
                {...form.register("village_id")}
                placeholder="Contoh: Keboansikep"
                aria-invalid={!!errors.village_id}
              />
            </FieldContent>
            {errors.village_id && (
              <FieldError>{errors.village_id.message}</FieldError>
            )}
          </Field>

          {/* Land Slope at the bottom */}
          <Field className="col-span-1">
            <FieldLabel>
              Kemiringan Lahan <span className="text-destructive">*</span>
            </FieldLabel>
            <FieldContent>
              <div className="flex items-center gap-2">
                <Input
                  {...form.register("landSlope", {
                    onChange: handleInputNumberValueChange,
                  })}
                  onKeyDown={handleNumberKeyDown}
                  inputMode="numeric"
                  placeholder="Masukkan kemiringan lahan"
                  aria-invalid={!!errors.landSlope}
                />
                <span className="text-sm font-medium">%</span>
              </div>
            </FieldContent>
            {errors.landSlope && (
              <FieldError>{errors.landSlope.message}</FieldError>
            )}
          </Field>
        </div>
      </div>
    </form>
  );
}
