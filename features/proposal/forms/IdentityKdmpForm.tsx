"use client";

import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { handleInputNumberValueChange, handleNumberKeyDown } from "@/lib/utils";
import { useIdentifyKdmpForm } from "../hooks/useIdentifyKdmpForm";

export default function IdentityKdmpForm() {
  const { form, onSubmit } = useIdentifyKdmpForm();
  const { errors } = form.formState;

  return (
    <form id="step-1-form" onSubmit={onSubmit} className="mt-6">
      <FieldGroup className="grid grid-cols-2">
        <Field>
          <FieldLabel>Nama kdmp</FieldLabel>
          <FieldContent>
            <Input {...form.register("name")} aria-invalid={!!errors.name} />
          </FieldContent>
          {errors.name && <FieldError>{errors.name.message}</FieldError>}
        </Field>

        <Field>
          <FieldLabel>Nomor Induk Berusaha</FieldLabel>
          <FieldContent>
            <Input
              {...form.register("nib", {
                onChange: handleInputNumberValueChange,
              })}
              onKeyDown={handleNumberKeyDown}
              inputMode="numeric"
              maxLength={13}
              aria-invalid={!!errors.nib}
            />
          </FieldContent>
          {errors.nib && <FieldError>{errors.nib.message}</FieldError>}
        </Field>

        <Field>
          <FieldLabel>Nomor Kusuka</FieldLabel>
          <FieldContent>
            <Input
              {...form.register("kusukaNumber", {
                onChange: handleInputNumberValueChange,
              })}
              onKeyDown={handleNumberKeyDown}
              inputMode="numeric"
              aria-invalid={!!errors.kusukaNumber}
            />
          </FieldContent>
          {errors.kusukaNumber && (
            <FieldError>{errors.kusukaNumber.message}</FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel>Nomor Badan Hukum</FieldLabel>
          <FieldContent>
            <Input
              {...form.register("legalEntityNumber", {
                onChange: handleInputNumberValueChange,
              })}
              onKeyDown={handleNumberKeyDown}
              inputMode="numeric"
              aria-invalid={!!errors.legalEntityNumber}
            />
          </FieldContent>
          {errors.legalEntityNumber && (
            <FieldError>{errors.legalEntityNumber.message}</FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel>
            Nama Ketua KDMP <span className="text-destructive">*</span>
          </FieldLabel>
          <FieldContent>
            <Input
              {...form.register("chairmanName")}
              aria-invalid={!!errors.chairmanName}
              placeholder="Contoh: Budi Santoso"
            />
          </FieldContent>
          {errors.chairmanName && (
            <FieldError>{errors.chairmanName.message}</FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel>
            Nomor HP Ketua KDMP <span className="text-destructive">*</span>
          </FieldLabel>
          <FieldContent>
            <Input
              {...form.register("chairmanPhoneNumber", {
                onChange: handleInputNumberValueChange,
              })}
              onKeyDown={handleNumberKeyDown}
              inputMode="numeric"
              aria-invalid={!!errors.chairmanPhoneNumber}
              placeholder="Contoh: 081234567890"
            />
          </FieldContent>
          {errors.chairmanPhoneNumber && (
            <FieldError>{errors.chairmanPhoneNumber.message}</FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel>
            Nama Penyuluh Pendamping <span className="text-destructive">*</span>
          </FieldLabel>
          <FieldContent>
            <Input
              {...form.register("companionName")}
              aria-invalid={!!errors.companionName}
              placeholder="Contoh: Siti Aminah"
            />
          </FieldContent>
          {errors.companionName && (
            <FieldError>{errors.companionName.message}</FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel>
            Nomor HP Penyuluh Pendamping{" "}
            <span className="text-destructive">*</span>
          </FieldLabel>
          <FieldContent>
            <Input
              {...form.register("companionPhoneNumber", {
                onChange: handleInputNumberValueChange,
              })}
              onKeyDown={handleNumberKeyDown}
              inputMode="numeric"
              aria-invalid={!!errors.companionPhoneNumber}
              placeholder="Contoh: 081298765432"
            />
          </FieldContent>
          {errors.companionPhoneNumber && (
            <FieldError>{errors.companionPhoneNumber.message}</FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel>
            Jumlah Pengurus <span className="text-destructive">*</span>
          </FieldLabel>
          <FieldContent>
            <Input
              {...form.register("boardMemberCount", {
                onChange: handleInputNumberValueChange,
              })}
              onKeyDown={handleNumberKeyDown}
              inputMode="numeric"
              aria-invalid={!!errors.boardMemberCount}
              placeholder="Masukkan jumlah pengurus"
            />
          </FieldContent>
          {errors.boardMemberCount && (
            <FieldError>{errors.boardMemberCount.message}</FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel>
            Jumlah Anggota <span className="text-destructive">*</span>
          </FieldLabel>
          <FieldContent>
            <Input
              {...form.register("memberCount", {
                onChange: handleInputNumberValueChange,
              })}
              onKeyDown={handleNumberKeyDown}
              inputMode="numeric"
              aria-invalid={!!errors.memberCount}
              placeholder="Masukkan jumlah anggota"
            />
          </FieldContent>
          {errors.memberCount && (
            <FieldError>{errors.memberCount.message}</FieldError>
          )}
        </Field>

        <div className="col-span-2">
          {/* <Field>
            <FieldLabel>Lokasi</FieldLabel>
            <LocationFormSection form={form} />
          </Field> */}
        </div>
      </FieldGroup>
    </form>
  );
}
