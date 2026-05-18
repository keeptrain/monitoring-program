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
import { Loader2 } from "lucide-react";
import SCurveFormSection from "@/features/documentation/SCurveFormSection";
import DocumentationsFormSection from "@/features/documentation/DocumentationsFormSection";

export default function ThematicProgramForm({
  form,
  onSubmit,
  isPending,
  isEdit,
  documentationsStorageBasePath,
}: {
  form: any;
  onSubmit: any;
  isPending: boolean;
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

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
        {isEdit ? "Simpan Perubahan" : "Simpan"}
      </Button>
    </form>
  );
}
