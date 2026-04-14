"use client";

import { Column } from "@/components/datatable/datatable";
import { AvailableLocation } from "../actions/available-locations";
import { formatDateWithTime } from "@/lib/utils";
import { MoreButton, MoreButtonMenuItem } from "@/components/shared/MoreButton";

export function AvailableLocationTableColumns(): Column<AvailableLocation>[] {
  return [
    { header: "Nama Lokasi", accessorKey: "name" },
    { header: "Latitude", accessorKey: "latitude" },
    { header: "Longitude", accessorKey: "longitude" },
    {
      header: "Dibuat",
      accessorKey: "created_at",
      cell: (row) => formatDateWithTime(row.created_at),
    },
    {
      header: "Aksi",
      cell: (row) => {
        const menuItems: MoreButtonMenuItem[] = [
          {
            type: "link",
            key: "edit",
            label: "Ubah",
            href: `/dashboard/available-location/form/${row.id}`,
          },
          {
            type: "action",
            key: "delete",
            label: "Hapus",
            onClick: () => {
              console.log("delete", row.id);
            },
          },
        ];
        return <MoreButton menuItems={menuItems} />;
      },
    },
  ];
}
