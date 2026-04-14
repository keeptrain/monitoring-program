"use client";

import Datatable from "@/components/datatable/datatable";
import { Button } from "@/components/ui/button";
import { MapPin, Plus } from "lucide-react";
import Link from "next/link";

const columns = ["Nama Lokasi", "Deskripsi"];

export default function AvailableLocationPage() {
  const data = [
    {
      name: "Lokasi 1",
      description: "Deskripsi 1",
    },
    {
      name: "Lokasi 2",
      description: "Deskripsi 2",
    },
  ];
  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Dashboard / Lokasi
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Lokasi Tersedia
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Daftar lokasi pelaksanaan program prioritas yang telah terdaftar.
          </p>
        </div>
        <Button size="sm" asChild>
          <Link href="/dashboard/available-location/form/create">
            <Plus className="mr-1.5 size-3.5" />
            Tambah Lokasi
          </Link>
        </Button>
      </div>

      {/* Empty state placeholder */}
      {data.length === 0 ? (
        <EmptyState />
      ) : (
        <Datatable
          columns={columns}
          data={data.map((item) => [item.name, item.description])}
        />
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center border border-border bg-background py-20 text-center">
      <div className="mb-4 flex size-12 items-center justify-center border border-border">
        <MapPin className="size-6 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium text-foreground">
        Belum ada lokasi terdaftar
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        Klik &quot;Tambah Lokasi&quot; untuk mulai menambahkan data.
      </p>
    </div>
  );
}
