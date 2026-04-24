"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Loader2, FileIcon, X } from "lucide-react";
import { ChangeEvent, useState } from "react";
import useDocumentationsUpload from "@/features/documentation/hooks/useDocumentationsUpload";
import { useProposalBioflocForm } from "../hooks/useProposalBioflocForm";

export default function ProposalBioflocForm() {
  const { form, onSubmit, isPending, submitError } = useProposalBioflocForm();
  const { upload, isPending: isUploading } = useDocumentationsUpload();
  const [uploadError, setUploadError] = useState<string | null>(null);

  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const proposalPath = watch("proposal_path");

  const handleUploadProposal = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    try {
      const uploaded = await upload(file, {
        basePath: "proposal-biofloc-thematic",
      });

      if (uploaded.length === 0) {
        throw new Error("Upload proposal gagal.");
      }

      setValue("proposal_path", uploaded[0].path, {
        shouldDirty: true,
        shouldValidate: true,
      });
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : "Upload proposal gagal.",
      );
    }
  };

  const handleRemoveProposal = () => {
    setValue("proposal_path", "", {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-10">
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
            <Input
              {...register("province")}
              aria-invalid={!!errors.province}
              placeholder="Contoh: Jawa Timur"
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

      <Card>
        <CardHeader>
          <CardTitle>Upload Proposal</CardTitle>
        </CardHeader>
        <CardContent>
          <Field>
            {!proposalPath ? (
              <div className="relative w-full md:w-1/2">
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleUploadProposal}
                  disabled={isUploading}
                  aria-invalid={!!errors.proposal_path}
                />
                {isUploading && (
                  <div className="absolute top-1/2 right-3 -translate-y-1/2">
                    <Loader2 className="text-muted-foreground size-4 animate-spin" />
                  </div>
                )}
              </div>
            ) : (
              <div className="border-border flex w-full items-center justify-between border bg-zinc-50/50 p-2 text-sm md:w-1/2">
                <div className="flex items-center gap-2 overflow-hidden">
                  <FileIcon className="size-4 shrink-0 text-zinc-400" />
                  <span className="truncate font-medium text-zinc-700">
                    {proposalPath.split("/").pop()}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={handleRemoveProposal}
                  className="hover:text-destructive h-7 w-7"
                >
                  <X className="size-3.5" />
                </Button>
              </div>
            )}
            <FieldError>
              {errors.proposal_path?.message || uploadError || submitError}
            </FieldError>
          </Field>
        </CardContent>
      </Card>

      <Button
        type="submit"
        className="w-full"
        disabled={isPending || isUploading}
      >
        {(isPending || isUploading) && (
          <Loader2 className="mr-2 size-4 animate-spin" />
        )}
        Kirim Proposal
      </Button>
    </form>
  );
}
