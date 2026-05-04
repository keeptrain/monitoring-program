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
import RegencySelect from "@/components/shared/RegencySelect";
import DistrictSelect from "@/components/shared/DistrictSelect";
import VillageSelect from "@/components/shared/VillageSelect";
import { LocationKdmpValues } from "../forms/location-kdmp-schema";

export default function LocationKdmpForm(
  props: {
    initialData?: LocationKdmpValues;
    proposalId?: string;
  },
) {
  const { initialData } = props;
  const { form, onSubmit } = useLocationKdmpForm(initialData);
  const {
    formState: { errors },
  } = form;

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
                name="province_code"
                render={({ field }) => (
                  <ProvinceSelect
                    value={field.value ?? ""}
                    onChange={(val, name) => {
                      field.onChange(val);
                      form.setValue("province_name", name || "");
                      form.setValue("regency_code", "");
                      form.setValue("regency_name", "");
                      form.setValue("district_code", "");
                      form.setValue("district_name", "");
                      form.setValue("village_code", "");
                      form.setValue("village_name", "");
                    }}
                    allLabel="Pilih Provinsi"
                    showAll
                    className="w-full"
                    aria-invalid={!!errors.province_code}
                  />
                )}
              />
            </FieldContent>
            {errors.province_code && (
              <FieldError>{errors.province_code.message}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel>
              Kabupaten/Kota <span className="text-destructive">*</span>
            </FieldLabel>
            <FieldContent>
              <Controller
                control={form.control}
                name="regency_code"
                render={({ field }) => (
                  <RegencySelect
                    provinceCode={form.watch("province_code") ?? ""}
                    value={field.value ?? ""}
                    onChange={(val, name) => {
                      field.onChange(val);
                      form.setValue("regency_name", name || "");
                      form.setValue("district_code", "");
                      form.setValue("district_name", "");
                      form.setValue("village_code", "");
                      form.setValue("village_name", "");
                    }}
                    className="w-full"
                    aria-invalid={!!errors.regency_code}
                  />
                )}
              />
            </FieldContent>
            {errors.regency_code && (
              <FieldError>{errors.regency_code.message}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel>
              Kecamatan <span className="text-destructive">*</span>
            </FieldLabel>
            <FieldContent>
              <Controller
                control={form.control}
                name="district_code"
                render={({ field }) => (
                  <DistrictSelect
                    regencyCode={form.watch("regency_code") ?? ""}
                    value={field.value ?? ""}
                    onChange={(val, name) => {
                      field.onChange(val);
                      form.setValue("district_name", name || "");
                      form.setValue("village_code", "");
                      form.setValue("village_name", "");
                    }}
                    className="w-full"
                    aria-invalid={!!errors.district_code}
                  />
                )}
              />
            </FieldContent>
            {errors.district_code && (
              <FieldError>{errors.district_code.message}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel>
              Desa/Kelurahan <span className="text-destructive">*</span>
            </FieldLabel>
            <FieldContent>
              <Controller
                control={form.control}
                name="village_code"
                render={({ field }) => (
                  <VillageSelect
                    districtCode={form.watch("district_code") ?? ""}
                    value={field.value ?? ""}
                    onChange={(val, name) => {
                      field.onChange(val);
                      form.setValue("village_name", name || "");
                    }}
                    className="w-full"
                    aria-invalid={!!errors.village_code}
                  />
                )}
              />
            </FieldContent>
            {errors.village_code && (
              <FieldError>{errors.village_code.message}</FieldError>
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
