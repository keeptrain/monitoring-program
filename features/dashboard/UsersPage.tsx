import UsersClientPage, { CreateButton } from "./pages/UsersClientPage";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getUsersQueryOptions } from "./api/getUsers";
import Link from "next/link";

export default async function UsersPage() {
  const queryClient = new QueryClient();
  const users = await queryClient.fetchQuery(getUsersQueryOptions());

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-2">
      <div className="mb-6 space-y-2">
        <p className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
          <Link
            href="/dashboard"
            className="underline-offset-2 hover:underline"
          >
            Dashboard
          </Link>{" "}
          / Users
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-foreground text-2xl font-semibold tracking-tight">
              Kelola Pengguna
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Kelola akses pengguna ke sistem
            </p>
          </div>
          <CreateButton />
        </div>
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <UsersClientPage users={users} />
      </HydrationBoundary>
    </div>
  );
}
