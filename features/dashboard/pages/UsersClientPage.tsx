"use client";

import { startTransition, useCallback, useMemo, useState } from "react";
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
import { deleteUserAction } from "../actions/users-actions";

export default function UsersClientPage({ users }: { users: User[] }) {
  const [, setUserId] = useQueryState("id", parseAsString);

  const handleAction = useCallback(
    async (action: "edit" | "delete", user: User) => {
      startTransition(async () => {
        if (action === "edit") {
          setUserId(user.id);
        } else if (action === "delete") {
          await deleteUserAction(user.id);
        }
      });
    },
    [setUserId],
  );

  const columns = useMemo(
    () =>
      UsersTableColumns({
        onAction: (action, user) => handleAction(action, user),
      }),
    [handleAction],
  );

  return (
    <>
      <DataTable columns={columns} data={users} />
      <ManageUserSheet />
    </>
  );
}

export function CreateButton() {
  const [, setUserId] = useQueryState("id", parseAsString);

  const handleCreate = () => {
    setUserId("create");
  };

  return (
    <Button onClick={handleCreate}>
      <PlusIcon className="size-4" /> Pengguna
    </Button>
  );
}

function getSheetConfig(userId: string | null) {
  if (userId === "create") {
    return {
      title: "Tambah Pengguna",
      description: "Masukkan data pengguna yang akan ditambahkan",
    };
  }
  return {
    title: "Edit Pengguna",
    description: "Masukkan data pengguna yang akan diupdate",
  };
}

function ManageUserSheet() {
  const [userId, setUserId] = useQueryState("id", parseAsString);
  const { data: users } = useGetUsers();

  const [prevUserId, setPrevUserId] = useState(userId);
  const [config, setConfig] = useState(() => getSheetConfig(userId));

  // Sync state during render - Efficient & Clean
  if (userId && userId !== prevUserId) {
    setPrevUserId(userId);
    setConfig(getSheetConfig(userId));
  }

  const selectedUser = users?.find((u) => u.id === userId);

  return (
    <Sheet open={!!userId} onOpenChange={(open) => !open && setUserId(null)}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>{config.title}</SheetTitle>
          <SheetDescription>{config.description}</SheetDescription>
        </SheetHeader>
        <UserForm initialValues={selectedUser} />
      </SheetContent>
    </Sheet>
  );
}
