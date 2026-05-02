"use client";

import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/features/auth/types/user";
import { Badge } from "@/components/ui/badge";
import { MoreButton, MoreButtonMenuItem } from "@/components/shared/MoreButton";
import { PencilIcon, TrashIcon } from "lucide-react";
import { formatDateWithTime } from "@/lib/utils";

export const UsersTableColumns = ({
  onAction,
}: {
  onAction: (action: "edit" | "delete", user: User) => void;
}): ColumnDef<User>[] => [
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row: { original } }) => original.email,
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
          {role === "officer" ? "Petugas" : role}
        </Badge>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Dibuat",
    cell: ({ row: { original } }) => formatDateWithTime(original.created_at),
  },
  {
    accessorKey: "updated_at",
    header: "Diperbarui",
    cell: ({ row: { original } }) => formatDateWithTime(original.updated_at),
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
          onClick: () => onAction("edit", item),
          icon: PencilIcon,
        },
        {
          type: "action",
          key: "delete",
          label: "Hapus",
          onClick: () => onAction("delete", item),
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
