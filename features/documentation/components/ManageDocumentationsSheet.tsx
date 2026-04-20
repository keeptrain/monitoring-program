"use client";

import { useTransition } from "react";
import { SheetClose, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { type DocumentationFormInput } from "../forms/documentation-schema";
import DocumentationsFormSection from "../DocumentationsFormSection";
import { upsertDocumentations } from "../actions";
import { useManageDocumentationsForm } from "../hooks/useManageDocumentationsForm";
import { getDocumentationGroupsByTypeAndIdQueryKey } from "../api/getDocumentationGroupsByTypeAndId";

interface ManageDocumentationsSheetProps {
  programType: string;
  programId: number;
  onSuccess?: () => void;
}

export default function ManageDocumentationsSheet({
  programType,
  programId,
  onSuccess,
}: ManageDocumentationsSheetProps) {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  const { form, isLoading } = useManageDocumentationsForm(
    programType,
    programId,
  );

  const onSubmit = (values: DocumentationFormInput) => {
    if (!programId) return;

    startTransition(async () => {
      try {
        const docs = (values.documentations ?? []).map((d) => ({
          image_before_paths: d.image_before_paths ?? [],
          image_after_paths: d.image_after_paths ?? [],
        }));

        const result = await upsertDocumentations(programId, programType, docs);

        if (result.success) {
          // Invalidate cache agar data terbaru diambil saat dibuka kembali
          queryClient.invalidateQueries({
            queryKey: getDocumentationGroupsByTypeAndIdQueryKey(
              programType,
              programId,
            ),
          });
          onSuccess?.();
        }
      } catch {}
    });
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <Loading />
        ) : (
          <DocumentationsFormSection
            form={form}
            mode="edit"
            maxGroups={5}
            storageBasePath={`documentations/${programType}/${programId}`}
          />
        )}
      </div>

      <SheetFooter>
        <SubmitButton
          onSave={form.handleSubmit(onSubmit)}
          isFetching={isLoading}
          isPending={isPending}
        />
        <SheetClose asChild>
          <Button variant="outline">Close</Button>
        </SheetClose>
      </SheetFooter>
    </>
  );
}

function Loading() {
  return (
    <div className="flex h-40 items-center justify-center gap-2">
      <Loader2Icon className="text-muted-foreground size-5 animate-spin" />
      <p className="text-muted-foreground text-sm">Memuat dokumentasi...</p>
    </div>
  );
}

function SubmitButton({
  isPending,
  isFetching,
  onSave,
}: {
  isPending: boolean;
  isFetching: boolean;
  onSave: () => void;
}) {
  return (
    <Button type="button" onClick={onSave} disabled={isPending || isFetching}>
      {isPending && <Loader2Icon className="size-4 animate-spin" />}
      Simpan
    </Button>
  );
}
