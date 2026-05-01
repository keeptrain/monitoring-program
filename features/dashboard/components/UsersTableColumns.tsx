"use client";

import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/features/auth/types/user";
import { Badge } from "@/components/ui/badge";
import { MoreButton, MoreButtonMenuItem } from "@/components/shared/MoreButton";
import { PencilIcon, TrashIcon } from "lucide-react";
import { formatDateWithTime } from "@/lib/utils";

export const UsersTableColumns = ({
  onEdit,
}: {
  onEdit?: (user: User) => void;
}): ColumnDef<User>[] => [
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.email}</span>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.original.role;
      return (
        <Badge
          variant={role === "admin" ? "default" : "secondary"}
          className="capitalize"
        >
          {role}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Dibuat",
    cell: ({ row: { original } }) => formatDateWithTime(original.createdAt),
  },
  {
    accessorKey: "updatedAt",
    header: "Diperbarui",
    cell: ({ row: { original } }) => formatDateWithTime(original.updatedAt),
  },
  {
    header: "Aksi",
    id: "actions",
    cell: ({ row }) => {
      const item = row.original;
      const menuItems: MoreButtonMenuItem[] = [
        {
          type: "action",
          key: "edit",
          label: "Ubah",
          onClick: () => onEdit?.(item),
          icon: PencilIcon,
        },
        {
          type: "action",
          key: "delete",
          label: "Hapus",
          onClick: () => console.log("delete"),
          icon: TrashIcon,
          className: "text-red-600 hover:text-red-700 hover:bg-red-50",
        },
      ];

      return (
        <div onClick={(e) => e.stopPropagation()}>
          <MoreButton menuItems={menuItems} />
        </div>
      );
    },
  },
];
