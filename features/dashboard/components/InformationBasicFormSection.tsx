"use client";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { UseFormReturn } from "react-hook-form";
import {
  ProgramPriorityFormInput,
  ProgramPriorityFormValues,
} from "../forms/program-priority-schema";
import { AvailableLocation } from "../actions/available-locations";

interface ReportFormProps {
  form: UseFormReturn<
    ProgramPriorityFormInput,
    undefined,
    ProgramPriorityFormValues
  >;
  availableLocations: AvailableLocation[];
}

export default function InformationBasicFormSection({
  form,
  availableLocations,
}: ReportFormProps) {
  const {
    register,
    formState: { errors },
  } = form;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="available_location_id">Target Lokasi</FieldLabel>
          <NativeSelect
            {...register("available_location_id")}
            aria-invalid={!!errors.available_location_id}
          >
            <NativeSelectOption value="">Pilih Lokasi</NativeSelectOption>
            {availableLocations.map((loc) => (
              <NativeSelectOption key={loc.id} value={loc.id}>
                {loc.name}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          <FieldError>{errors.available_location_id?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="name">Nama Program</FieldLabel>
          <Input
            {...register("name")}
            aria-invalid={!!errors.name}
            placeholder="e.g. Infrastructure Maintenance"
          />
          <FieldError>{errors.name?.message}</FieldError>
        </Field>
      </FieldGroup>

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="provider_type">Jenis Provider</FieldLabel>
          <NativeSelect
            {...register("provider_type")}
            aria-invalid={!!errors.provider_type}
          >
            <NativeSelectOption value="">Select status</NativeSelectOption>
            <NativeSelectOption value="private">Private</NativeSelectOption>
            <NativeSelectOption value="institution">
              Institution
            </NativeSelectOption>
          </NativeSelect>
          <FieldError>{errors.provider_type?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="percentage_of_work">
            Persentase Pengerjaan (%)
          </FieldLabel>
          <Input
            {...register("percentage_of_work", {
              maxLength: 3,
            })}
            aria-invalid={!!errors.percentage_of_work}
            type="number"
            placeholder="0-100"
          />
          <FieldDescription>
            * disesuaikan dengan persentase pengerjaan program prioritas
          </FieldDescription>
          <FieldError>{errors.percentage_of_work?.message}</FieldError>
        </Field>
      </FieldGroup>

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="status">Status HUB</FieldLabel>
          <NativeSelect {...register("status")} aria-invalid={!!errors.status}>
            <NativeSelectOption value="">Select status</NativeSelectOption>
            <NativeSelectOption value="HUB">HUB</NativeSelectOption>
            <NativeSelectOption value="NON-HUB">NON-HUB</NativeSelectOption>
          </NativeSelect>
          <FieldError>{errors.status?.message}</FieldError>
        </Field>
      </FieldGroup>

      <Field>
        <FieldLabel htmlFor="constraints">Kendala / Hambatan</FieldLabel>
        <Textarea
          {...register("constraints")}
          aria-invalid={!!errors.constraints}
          placeholder="Ceritakan kendala / hambatan yang dihadapi..."
        />
        <FieldError>{errors.constraints?.message}</FieldError>
      </Field>

      <Field>
        <FieldLabel htmlFor="follow_up">
          Tindak Lanjut yang Diperlukan
        </FieldLabel>
        <Textarea
          {...register("follow_up")}
          aria-invalid={!!errors.follow_up}
          placeholder="Ceritakan tindak lanjut yang diperlukan..."
        />
        <FieldError>{errors.follow_up?.message}</FieldError>
      </Field>

      {/* <div className="space-y-6">
        <div className="flex items-center justify-between border-b-2 border-black pb-2">
          <FieldLabel className="mb-0">Documentation Photos</FieldLabel>
          <button
            type="button"
            onClick={() =>
              append({ image_before_path: "", image_after_path: "" })
            }
            className="flex items-center gap-1 text-xs font-bold bg-black text-white px-3 py-1 hover:bg-neutral-800 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Row
          </button>
        </div>

        <FieldError>{errors.documentations?.message}</FieldError>

        {fields.map((field, index) => (
          <div
            key={field.id}
            className="relative border-2 border-black p-4 bg-neutral-50 space-y-4"
          >
            <button
              type="button"
              onClick={() => remove(index)}
              className="absolute top-2 right-2 p-1 text-neutral-400 hover:text-red-600 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <span className="text-[10px] font-black uppercase text-neutral-400">
              Documentation Pair #{index + 1}
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel className="text-[10px]">Photo Before</FieldLabel>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(index, "before", file);
                    }}
                    className="hidden"
                    id={`before-${index}`}
                  />
                  <label
                    htmlFor={`before-${index}`}
                    className={cn(
                      "flex flex-col items-center justify-center border-2 border-dashed border-black h-32 cursor-pointer hover:bg-white transition-all",
                      watch(`documentations.${index}.image_before_path`) &&
                        "bg-black text-white"
                    )}
                  >
                    {uploadProgress[index]?.before ? (
                      <Loader2 className="w-8 h-8 animate-spin" />
                    ) : watch(`documentations.${index}.image_before_path`) ? (
                      <>
                        <CheckCircle2 className="w-8 h-8 mb-2" />
                        <span className="text-[10px] font-bold">UPLOADED</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 mb-2" />
                        <span className="text-[10px] font-bold">
                          SELECT PHOTO
                        </span>
                      </>
                    )}
                  </label>
                  <input
                    type="hidden"
                    {...register(`documentations.${index}.image_before_path`)}
                  />
                </div>
                <FieldError>
                  {errors.documentations?.[index]?.image_before_path?.message}
                </FieldError>
              </Field>

              <Field>
                <FieldLabel className="text-[10px]">Photo After</FieldLabel>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(index, "after", file);
                    }}
                    className="hidden"
                    id={`after-${index}`}
                  />
                  <label
                    htmlFor={`after-${index}`}
                    className={cn(
                      "flex flex-col items-center justify-center border-2 border-dashed border-black h-32 cursor-pointer hover:bg-white transition-all",
                      watch(`documentations.${index}.image_after_path`) &&
                        "bg-black text-white"
                    )}
                  >
                    {uploadProgress[index]?.after ? (
                      <Loader2 className="w-8 h-8 animate-spin" />
                    ) : watch(`documentations.${index}.image_after_path`) ? (
                      <>
                        <CheckCircle2 className="w-8 h-8 mb-2" />
                        <span className="text-[10px] font-bold">UPLOADED</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 mb-2" />
                        <span className="text-[10px] font-bold">
                          SELECT PHOTO
                        </span>
                      </>
                    )}
                  </label>
                  <input
                    type="hidden"
                    {...register(`documentations.${index}.image_after_path`)}
                  />
                </div>
                <FieldError>
                  {errors.documentations?.[index]?.image_after_path?.message}
                </FieldError>
              </Field>
            </div>
          </div>
        ))}
      </div> */}
    </div>
  );
}
