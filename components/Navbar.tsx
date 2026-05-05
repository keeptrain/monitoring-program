import Link from "next/link";
import Image from "next/image";
import { UserDropdown } from "./UserDropdown";
import { cookies } from "next/headers";
import { Button } from "./ui/button";
import { LogInIcon } from "lucide-react";

export default async function Navbar() {
  const cookieStore = await cookies();
  const isAuthenticated = !!cookieStore.get("session")?.value;

  return (
    <header className="border-border bg-background/90 sticky top-0 z-15 border-b backdrop-blur-sm">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-0">
        {/* Logo */}
        <Link
          href="/biofloc-thematic"
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
          <UserDropdown />
        ) : (
          <Button size="sm" asChild>
            <Link href="/login">
              <LogInIcon className="mr-1 size-4" />
              Masuk
            </Link>
          </Button>
        )}
      </nav>
    </header>
  );
}
