"use client";

import { Button } from "@/components/ui/button";
import { ImageIcon, Loader2, MapIcon, UploadIcon, X } from "lucide-react";
import { STEP_COLORS } from "./constants/isf-step";
import { IsfStepSummary } from "./types/isf";
import ProgramAreaItemCard from "@/components/shared/ProgramAreaItemCard";
import { useState, useTransition } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import useDocumentationsUpload from "@/features/documentation/hooks/useDocumentationsUpload";
import Image from "next/image";

const RECRUITMENT_PHASES = [
  {
    id: 1,
    title: "Sosialisasi",
    description: "Sosialisasi Rekrutmen Tenaga Kerja",
  },
  { id: 2, title: "Seleksi", description: "Proses Pendaftaran dan Seleksi" },
  { id: 3, title: "Pelatihan", description: "Masa Pendidikan dan Magang" },
  { id: 4, title: "Penempatan", description: "Tenaga Kerja Siap Ditempatkan" },
];

type Tab = "zona" | "recruitment";

export default function IsfProgramPage({ data }: { data: IsfStepSummary[] }) {
  const [activeTab, setActiveTab] = useState<Tab>("zona");

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:justify-between">
        <div>
          <p className="text-muted-foreground mb-1 text-xs font-medium tracking-widest uppercase">
            Dashboard / Isf
          </p>
          <h1 className="text-foreground text-2xl font-semibold tracking-tight">
            Program ISF
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Monitoring Integrated Shrimp Farming (ISF).
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 flex gap-2">
        <Button
          variant={activeTab === "zona" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("zona")}
          className="gap-2"
        >
          <MapIcon className="size-4" />
          Update Progress per Zona
        </Button>
        <Button
          variant={activeTab === "recruitment" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("recruitment")}
          className="gap-2"
        >
          <ImageIcon className="size-4" />
          Update Recruitment
        </Button>
      </div>

      {/* Tab Content */}
      {activeTab === "zona" ? (
        <div className="grid gap-4">
          {data.map((program) => (
            <ProgramAreaItemCard
              key={program.step_id}
              href={`/dashboard/isf/${program.step_id}`}
              badgeLabel="Zona"
              badgeNumber={program.step_id}
              badgeColorClass={STEP_COLORS[program.step_id] || "bg-primary"}
              title={program.name}
              lastUpdatedAt={program.updated_at}
              progressPercent={program.progress_percent}
            />
          ))}
        </div>
      ) : (
        <RecruitmentPhaseList />
      )}
    </div>
  );
}

function RecruitmentPhaseList() {
  const [selectedPhase, setSelectedPhase] = useState<
    (typeof RECRUITMENT_PHASES)[0] | null
  >(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const handlePhaseClick = (phase: (typeof RECRUITMENT_PHASES)[0]) => {
    setSelectedPhase(phase);
    setSheetOpen(true);
  };

  return (
    <>
      <div className="grid gap-4">
        {RECRUITMENT_PHASES.map((phase) => (
          <button
            key={phase.id}
            onClick={() => handlePhaseClick(phase)}
            className="bg-background border-border group hover:bg-muted/30 relative flex items-center justify-between border p-5 text-left transition-all"
          >
            <div className="flex items-center gap-6">
              {/* Phase Number */}
              <div className="flex size-12 shrink-0 flex-col items-center justify-center rounded-full bg-sky-600 text-white shadow-[4px_4px_0px_rgba(0,0,0,0.1)] transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                <span className="text-[10px] leading-none font-bold uppercase opacity-90">
                  Fase
                </span>
                <span className="text-lg leading-none font-bold italic">
                  {phase.id}
                </span>
              </div>

              {/* Phase Info */}
              <div className="space-y-1">
                <h3 className="text-foreground group-hover:text-primary font-semibold transition-colors">
                  {phase.title}
                </h3>
                <p className="text-muted-foreground text-xs">
                  {phase.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-muted-foreground hidden text-xs font-medium sm:block">
                Upload Dokumentasi
              </span>
              <div className="flex size-10 items-center justify-center rounded-full border-2">
                <UploadIcon className="text-muted-foreground size-4" />
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Upload Sheet */}
      {selectedPhase && (
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent
            side="right"
            className="data-[side=right]:sm:max-w-[500px]"
          >
            <SheetHeader>
              <SheetTitle>
                Dokumentasi Fase {selectedPhase.id}: {selectedPhase.title}
              </SheetTitle>
              <SheetDescription>
                Upload 4 gambar dokumentasi untuk fase ini. Gambar akan
                ditampilkan di halaman publik rekrutmen.
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 px-4">
              <RecruitmentUploadForm
                phase={selectedPhase}
                onSuccess={() => setSheetOpen(false)}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}

function RecruitmentUploadForm({
  phase,
  onSuccess,
}: {
  phase: (typeof RECRUITMENT_PHASES)[0];
  onSuccess: () => void;
}) {
  const { upload, isPending: isUploading } = useDocumentationsUpload();
  const [isPending, startTransition] = useTransition();
  const [uploadedImages, setUploadedImages] = useState<
    { path: string; file_name: string; preview?: string }[]
  >([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setErrorMessage(null);

    // Limit total files to 4
    const remaining = 4 - uploadedImages.length;
    if (files.length > remaining) {
      setErrorMessage(`Hanya bisa menambahkan ${remaining} gambar lagi.`);
      return;
    }

    try {
      const basePath = `recruitment/fase-${phase.id}`;
      const results = await upload(files, { basePath });

      const withPreviews = results.map((r) => ({
        ...r,
        preview: URL.createObjectURL(
          Array.from(files).find((f) => f.name === r.file_name) || files[0],
        ),
      }));

      setUploadedImages((prev) => [...prev, ...withPreviews].slice(0, 4));
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Gagal mengunggah file.",
      );
    }
  };

  const handleRemove = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (uploadedImages.length === 0) {
      setErrorMessage("Silakan upload minimal 1 gambar.");
      return;
    }

    startTransition(async () => {
      try {
        // Save to database
        const response = await fetch("/api/recruitment-documentations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phase: phase.id,
            images: uploadedImages.map((img) => ({
              file_path: img.path,
              file_name: img.file_name,
            })),
          }),
        });

        if (!response.ok) {
          throw new Error("Gagal menyimpan dokumentasi.");
        }

        onSuccess();
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Gagal menyimpan.",
        );
      }
    });
  };

  const isSaving = isPending || isUploading;

  return (
    <div className="space-y-6">
      {/* Uploaded Images Grid */}
      <div className="grid grid-cols-2 gap-3">
        {[0, 1, 2, 3].map((index) => {
          const image = uploadedImages[index];
          return (
            <div
              key={index}
              className="border-border bg-muted/30 relative flex aspect-square items-center justify-center overflow-hidden border border-dashed"
            >
              {image ? (
                <>
                  <Image
                    src={image.preview || ""}
                    alt={`Foto ${index + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="absolute top-1 right-1 flex size-6 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
                  >
                    <X className="size-3" />
                  </button>
                  <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-bold text-white">
                    {index + 1}
                  </span>
                </>
              ) : (
                <div className="flex flex-col items-center gap-1 text-zinc-400">
                  <ImageIcon className="size-6" />
                  <span className="text-[10px] font-bold">
                    Foto {index + 1}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Upload Input */}
      {uploadedImages.length < 4 && (
        <div className="space-y-2">
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            disabled={isSaving}
            className="text-xs"
          />
          {isUploading && (
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <Loader2 className="size-3 animate-spin" />
              Mengunggah...
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <p className="text-destructive text-xs font-medium">{errorMessage}</p>
      )}

      {/* Save Button */}
      <Button
        onClick={handleSave}
        disabled={isSaving || uploadedImages.length === 0}
        className="w-full"
      >
        {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
        Simpan Dokumentasi ({uploadedImages.length}/4)
      </Button>
    </div>
  );
}
