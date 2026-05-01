"use client";

import { useMemo } from "react";
import { User } from "@/features/auth/types/user";
import DataTable from "@/components/datatable/datatable";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { UsersTableColumns } from "../components/UsersTableColumns";
import { parseAsString, useQueryState } from "nuqs";
import UserForm from "../components/UserForm";
import { useGetUsers } from "../api/getUsers";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

export default function UsersClientPage({ users }: { users: User[] }) {
  const [, setUserId] = useQueryState("id", parseAsString);

  const handleEdit = (user: User) => {
    setUserId(user.id);
  };

  const columns = useMemo(() => UsersTableColumns({ onEdit: handleEdit }), []);

  return (
    <>
      <DataTable columns={columns} data={users} />
      <ManageUserSheet />
    </>
  );
}

export function CreateButton() {
  const [_, setUserId] = useQueryState("id", parseAsString);

  const handleCreate = () => {
    setUserId("create");
  };

  return (
    <Button onClick={handleCreate}>
      <PlusIcon className="size-4" /> Pengguna
    </Button>
  );
}

function ManageUserSheet() {
  const [userId, setUserId] = useQueryState("id", parseAsString);
  const { data: users } = useGetUsers();

  const selectedUser = users?.find((u) => u.id === userId);

  const sheetTitle = userId === "create" ? "Tambah Pengguna" : "Edit Pengguna";
  const sheetDescription =
    userId === "create"
      ? "Masukkan data pengguna yang akan ditambahkan"
      : "Masukkan data pengguna yang akan diupdate";

  return (
    <Sheet open={!!userId} onOpenChange={(open) => !open && setUserId(null)}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{sheetTitle}</SheetTitle>
          <SheetDescription>{sheetDescription}</SheetDescription>
        </SheetHeader>
        <UserForm initialValues={selectedUser} />
      </SheetContent>
    </Sheet>
  );
}
