"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import {
  documentationFormSchema,
  type DocumentationFormInput,
} from "../forms/documentation-schema";
import DocumentationsFormSection from "../DocumentationsFormSection";
import {
  getDocumentationGroupsByTypeAndId,
  upsertDocumentations,
} from "../actions";

interface ManageDocumentationsSheetProps {
  programId: number | null;
  programType: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function ManageDocumentationsSheet({
  programId,
  programType,
  isOpen,
  onOpenChange,
  onSuccess,
}: ManageDocumentationsSheetProps) {
  const [isPending, startTransition] = useTransition();
  const [isFetching, setIsFetching] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const form = useForm<DocumentationFormInput>({
    resolver: zodResolver(documentationFormSchema),
    defaultValues: {
      documentations: [],
    },
  });

  useEffect(() => {
    if (!isOpen || !programId) return;

    setStatusMessage(null);
    const fetchData = async () => {
      setIsFetching(true);
      try {
        const groups = await getDocumentationGroupsByTypeAndId(
          programType,
          programId,
        );
        form.reset({
          documentations: groups.map((g) => ({
            image_before_paths: g.beforePaths ?? [],
            image_after_paths: g.afterPaths ?? [],
          })),
        });
      } catch {
        setStatusMessage({
          type: "error",
          text: "Gagal memuat data dokumentasi.",
        });
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, [isOpen, programId, programType, form]);

  useEffect(() => {
    if (!isOpen) {
      form.reset({ documentations: [] });
      setStatusMessage(null);
    }
  }, [isOpen, form]);

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
          setStatusMessage({
            type: "success",
            text: "Dokumentasi berhasil diperbarui.",
          });
          onSuccess?.();
          setTimeout(() => onOpenChange(false), 800);
        } else {
          setStatusMessage({
            type: "error",
            text: result.message || "Gagal memperbarui dokumentasi.",
          });
        }
      } catch {
        setStatusMessage({
          type: "error",
          text: "Terjadi kesalahan sistem.",
        });
      }
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="flex h-full flex-col p-0 data-[side=right]:sm:max-w-[600px]">
        <SheetHeader className="border-b p-6 pb-4">
          <SheetTitle>Kelola Dokumentasi</SheetTitle>
          <SheetDescription>
            Tambah atau hapus foto dokumentasi. Klik nama file untuk preview.
            Perubahan disimpan saat menekan &quot;Simpan&quot;.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {isFetching ? (
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
            isFetching={isFetching}
            isPending={isPending}
          />
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
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
