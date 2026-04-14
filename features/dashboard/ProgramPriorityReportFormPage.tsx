"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import InformationBasicFormSection from "./components/InformationBasicFormSection";
import { Button } from "@/components/ui/button";
import useProgramPriorityForm from "./hooks/useProgramPriorityForm";
import DocumentationsFormSection from "./components/DocumentationsFormSection";
import { AvailableLocation } from "./actions/available-locations";
import { ProgramPriorityFormInput } from "./forms/program-priority-schema";
import { useTransition } from "react";

export default function ProgramPriorityReportFormPage({
  availableLocations,
  initialValues,
  reportId,
}: {
  availableLocations: AvailableLocation[];
  initialValues?: ProgramPriorityFormInput;
  reportId?: number;
}) {
  const [isLoading, startTransition] = useTransition();
  const { form, onSubmit } = useProgramPriorityForm(initialValues, reportId);

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(() => {
      onSubmit(e);
    });
  };
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <p className="mb-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Dashboard / Laporan / {reportId ? "Ubah" : "Buat"}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Laporan Prioritas Program
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {reportId
            ? "Perbarui formulir di bawah ini untuk mengubah laporan program prioritas."
            : "Isi formulir di bawah ini untuk membuat laporan program prioritas baru."}
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Informasi dasar</CardTitle>
            <CardDescription>
              Isi informasi dasar program prioritas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InformationBasicFormSection
              form={form}
              availableLocations={availableLocations}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Dokumentasi</CardTitle>
            <CardDescription>Isi dokumentasi program prioritas</CardDescription>
          </CardHeader>
          <CardContent>
            <DocumentationsFormSection form={form} />
          </CardContent>
        </Card>
        <Button type="submit" className="w-full mt-4" disabled={isLoading}>
          {isLoading ? "Loading..." : reportId ? "Ubah" : "Submit"}
        </Button>
      </form>
    </div>
  );
}
