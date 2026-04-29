"use client";

import Image from "next/image";
import { Loader2Icon, LogOutIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { logout } from "@/features/auth/auth-actions";
import { useQueryState } from "nuqs";
import { usePathname, useRouter } from "next/navigation";

export function UserDropdown() {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [, setStatuses] = useQueryState("status");

  const handleLogout = () => {
    startTransition(async () => {
      await setStatuses(null);
      await logout();
      if (pathname !== "/") {
        router.push("/");
      }
    });
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          size="icon-lg"
          className="overflow-hidden rounded-full border-2 border-white"
        >
          <Image
            src="https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-5.png"
            alt="User Avatar"
            width={50}
            height={50}
            className="object-cover"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem variant="destructive" onClick={handleLogout}>
          {isPending ? (
            <Loader2Icon className="mr-1 size-4 animate-spin" />
          ) : (
            <LogOutIcon className="mr-1 size-4" />
          )}
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
