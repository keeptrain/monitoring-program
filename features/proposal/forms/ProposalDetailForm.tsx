"use client";

import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import FileUploadField from "../../documentation/components/FileUploadField";
import { useProposalDetailForm } from "../hooks/useProposalDetailForm";
import { Controller } from "react-hook-form";
import DocumentationsFormSection from "../../documentation/DocumentationsFormSection";
import { Checkbox } from "@/components/ui/checkbox";
import {
  POTENTIAL_COMMODITY_OPTIONS,
  ProposalDetailFormValues,
} from "./proposal-detail-schema";
import { Input } from "@/components/ui/input";
import {} from "../forms/proposal-detail-schema";

export default function ProposalDetailForm({
  initialData,
  proposalId,
  programType,
  basePath,
}: {
  initialData?: ProposalDetailFormValues;
  proposalId?: string;
  programType: string;
  basePath: string;
}) {
  const { form, onSubmit } = useProposalDetailForm(
    initialData,
    proposalId,
    basePath,
  );

  const otherCommodityPotentialError =
    form.formState.errors.other_commodity_potential?.message;

  return (
    <form id="step-3-form" onSubmit={onSubmit}>
      <div className="mt-6 grid grid-cols-2">
        {/* Left Column */}
        <FieldGroup>
          {/* 1. Surat Pernyataan */}
          <Field className="space-y-3">
            <FieldLabel>
              Surat Pernyataan Kesanggupan Penyiapan dan Pemanfaatan Lahan{" "}
              <span className="text-destructive">*</span>
            </FieldLabel>
            <Controller
              control={form.control}
              name="has_letter_of_land_preparation_and_use"
              render={({ field, fieldState }) => (
                <>
                  <RadioGroup
                    name={field.name}
                    value={field.value ?? ""}
                    className="flex flex-col space-y-2"
                    onValueChange={field.onChange}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        aria-invalid={fieldState.invalid}
                        value="true"
                        id="surat-ada"
                      />
                      <Label htmlFor="surat-ada">Ada</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        aria-invalid={fieldState.invalid}
                        value="false"
                        id="surat-tidak"
                      />
                      <Label htmlFor="surat-tidak">Tidak</Label>
                    </div>
                  </RadioGroup>
                  {fieldState.invalid && (
                    <FieldError>{fieldState.error?.message}</FieldError>
                  )}
                </>
              )}
            />
          </Field>

          {/* 2. Komoditas */}
          <Field className="space-y-3">
            <FieldLabel>
              Komoditas yang Diusulkan{" "}
              <span className="text-destructive">*</span>
            </FieldLabel>
            <Controller
              control={form.control}
              name="proposed_commodity"
              render={({ field, fieldState }) => (
                <>
                  <RadioGroup
                    name={field.name}
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        aria-invalid={fieldState.invalid}
                        value="lele"
                        id="komoditas-lele"
                      />
                      <Label htmlFor="komoditas-lele">Lele</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        aria-invalid={fieldState.invalid}
                        value="nila"
                        id="komoditas-nila"
                      />
                      <Label htmlFor="komoditas-nila">Nila</Label>
                    </div>
                  </RadioGroup>
                  {fieldState.invalid && (
                    <FieldError>{fieldState.error?.message}</FieldError>
                  )}
                </>
              )}
            />
          </Field>

          {/* 3. Anggota */}
          <Field className="space-y-3">
            <FieldLabel>
              Ada anggota yang sudah melakukan usaha pembudidayaan ikan{" "}
              <span className="text-destructive">*</span>
            </FieldLabel>
            <Controller
              control={form.control}
              name="has_member_with_experience"
              render={({ field, fieldState }) => (
                <>
                  <RadioGroup
                    name={field.name}
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        aria-invalid={fieldState.invalid}
                        value="true"
                        id="anggota-ada"
                      />
                      <Label htmlFor="anggota-ada">Ada</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        aria-invalid={fieldState.invalid}
                        value="false"
                        id="anggota-tidak"
                      />
                      <Label htmlFor="anggota-tidak">Tidak</Label>
                    </div>
                  </RadioGroup>
                  {fieldState.invalid && (
                    <FieldError>{fieldState.error?.message}</FieldError>
                  )}
                </>
              )}
            />
          </Field>

          {/* 4. Foto sebelum pembangunan */}
          <Field>
            <FieldLabel>
              Foto sebelum pembangunan{" "}
              <span className="text-destructive">*</span>
            </FieldLabel>
            <FieldContent>
              <DocumentationsFormSection
                form={form}
                mode="create"
                documentationType="proposal_before"
                storageBasePath={`documentations/${programType === "minapadi_thematic" ? "proposal-minapadi-thematic" : "proposal-biofloc-thematic"}`}
              />
            </FieldContent>
          </Field>
        </FieldGroup>

        <FieldGroup>
          {/* 5. Potensi Komoditas (Multi-Checkbox) */}
          <Field className="space-y-3">
            <FieldLabel>
              Komoditas potensi di daerah sekitar{" "}
              <span className="text-destructive">*</span>
            </FieldLabel>
            <Controller
              control={form.control}
              name="commodity_potentials"
              render={({ field, fieldState }) => (
                <div className="space-y-4">
                  <div className="flex flex-col space-y-3">
                    {POTENTIAL_COMMODITY_OPTIONS.map((option) => (
                      <div
                        key={option.id}
                        className="flex items-center space-x-3"
                      >
                        <Checkbox
                          id={`potential-${option.id}`}
                          aria-invalid={fieldState.invalid}
                          checked={field.value?.includes(option.id)}
                          onCheckedChange={(checked) => {
                            const currentValues = field.value || [];
                            if (checked) {
                              field.onChange([...currentValues, option.id]);
                            } else {
                              field.onChange(
                                currentValues.filter(
                                  (v: string) => v !== option.id,
                                ),
                              );
                              if (option.id === "other") {
                                form.setValue("other_commodity_potential", "");
                              }
                            }
                          }}
                        />
                        <Label htmlFor={`potential-${option.id}`}>
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {field.value?.includes("other") && (
                    <Input
                      {...form.register("other_commodity_potential")}
                      placeholder="Sebutkan komoditas lain"
                      aria-invalid={!!otherCommodityPotentialError}
                    />
                  )}
                  {otherCommodityPotentialError && (
                    <FieldError>{otherCommodityPotentialError}</FieldError>
                  )}
                </div>
              )}
            />
          </Field>

          {/* 6. Proposal (File Upload) */}
          <Field>
            <FieldLabel>
              Proposal <span className="text-destructive">*</span>
            </FieldLabel>
            <Controller
              control={form.control}
              name="proposal_path"
              render={({ field, fieldState }) => (
                <FieldContent>
                  <FileUploadField
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    basePath={
                      programType === "minapadi_thematic"
                        ? "proposal-minapadi-thematic"
                        : "proposal-biofloc-thematic"
                    }
                    accept=".pdf,.doc,.docx"
                    error={fieldState.error?.message}
                  />
                </FieldContent>
              )}
            />
          </Field>
        </FieldGroup>
      </div>
    </form>
  );
}
