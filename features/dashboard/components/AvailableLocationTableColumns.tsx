"use client";

import { AvailableLocation } from "../actions/available-locations";
import { formatDateWithTime } from "@/lib/utils";
import { MoreButton, MoreButtonMenuItem } from "@/components/shared/MoreButton";
import { ColumnDef } from "@tanstack/react-table";

export function AvailableLocationTableColumns(): ColumnDef<AvailableLocation>[] {
  return [
    { header: "Nama Lokasi", accessorKey: "name" },
    { header: "Latitude", accessorKey: "latitude" },
    { header: "Longitude", accessorKey: "longitude" },
    {
      header: "Dibuat",
      accessorKey: "created_at",
      cell: ({ row }) => formatDateWithTime(row.original.created_at),
    },
    {
      header: "Aksi",
      cell: ({ row }) => {
        const item = row.original;
        const menuItems: MoreButtonMenuItem[] = [
          {
            type: "link",
            key: "edit",
            label: "Ubah",
            href: `/dashboard/available-location/form/${item.id}`,
          },
          {
            type: "action",
            key: "delete",
            label: "Hapus",
            onClick: () => {
              console.log("delete", item.id);
            },
          },
        ];
        return <MoreButton menuItems={menuItems} />;
      },
    },
  ];
}
