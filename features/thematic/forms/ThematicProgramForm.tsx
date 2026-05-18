"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ThematicInformationBasicFormSection from "../components/ThematicInformationBasicFormSection";
import { Loader2Icon } from "lucide-react";
import SCurveFormSection from "@/features/documentation/SCurveFormSection";
import DocumentationsFormSection from "@/features/documentation/DocumentationsFormSection";
import { useIsMutating } from "@tanstack/react-query";
import { getDocumentationsUploadMutationKey } from "@/features/documentation/hooks/useDocumentationsUpload";
import { getConvertProposalToPotentialMutationKey } from "@/features/proposal/api/convertProposalToPotential";
import { getUpdateThematicProgramMutationKey } from "@/features/thematic/api/updateThematicProgram";

export default function ThematicProgramForm({
  form,
  onSubmit,
  isEdit,
  documentationsStorageBasePath,
}: {
  form: any;
  onSubmit: any;
  isEdit: boolean;
  documentationsStorageBasePath: string;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informasi Program</CardTitle>
          <CardDescription>Isi informasi dasar program KDMP</CardDescription>
        </CardHeader>
        <CardContent>
          <ThematicInformationBasicFormSection form={form} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Kurva S{" "}
            <span className="text-muted-foreground text-xs">(Opsional)</span>
          </CardTitle>
          <CardDescription>Unggah visualisasi kurva S program</CardDescription>
        </CardHeader>
        <CardContent>
          <SCurveFormSection form={form} />
        </CardContent>
      </Card>

      {!isEdit && (
        <Card>
          <CardHeader>
            <CardTitle>Dokumentasi</CardTitle>
            <CardDescription>
              Unggah dokumentasi pengerjaan program
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DocumentationsFormSection
              mode="create"
              form={form}
              storageBasePath={documentationsStorageBasePath}
            />
          </CardContent>
        </Card>
      )}

      <SubmitButton isEdit={isEdit} />
    </form>
  );
}

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const isConverting =
    useIsMutating({
      mutationKey: getConvertProposalToPotentialMutationKey(),
    }) > 0;
  const isUpdating =
    useIsMutating({
      mutationKey: getUpdateThematicProgramMutationKey(),
    }) > 0;
  const isPending = isConverting || isUpdating;

  const isDocumentationUploading =
    useIsMutating({
      mutationKey: getDocumentationsUploadMutationKey(),
    }) > 0;

  return (
    <Button
      type="submit"
      disabled={isPending || isDocumentationUploading}
      className="w-full"
    >
      {isPending && <Loader2Icon className="size-4 animate-spin" />}
      {isEdit ? "Simpan Perubahan" : "Simpan"}
    </Button>
  );
}
