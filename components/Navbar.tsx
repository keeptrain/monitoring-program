import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Grid2X2PlusIcon } from "lucide-react";
import { UserDropdown } from "./UserDropdown";
import { cookies } from "next/headers";
import LoginButton from "./LoginButton";

export default async function Navbar() {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get("session_id")?.value === "true";

  return (
    <header className="border-border bg-background/90 sticky top-0 z-10 border-b backdrop-blur-sm">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-0">
        {/* Logo */}
        <Link
          href="/"
          className="text-foreground flex items-center gap-2 text-sm font-semibold"
        >
          <div className="relative size-10 sm:size-12">
            <Image
              src="/favicon.webp"
              alt="Logo KKP"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <span className="hidden text-xs leading-tight font-bold sm:inline">
            Kementerian Kelautan <br /> dan Perikanan Republik Indonesia
          </span>
        </Link>

        {/* Right actions */}
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <Button size="sm" variant="ghost" asChild>
              <Link href="/dashboard">
                <Grid2X2PlusIcon className="mr-1 size-4" />
                Entry Data
              </Link>
            </Button>
            <UserDropdown />
          </div>
        ) : (
          <LoginButton />
        )}
      </nav>
    </header>
  );
}
