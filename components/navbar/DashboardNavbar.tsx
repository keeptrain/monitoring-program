import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { DropdownUser } from "../dropdown/DropdownUser";

export default async function DashboardNavbar({
  homeHref,
}: {
  homeHref: string;
}) {
  return (
    <header className="text-background sticky top-0 z-20 bg-[#006ebf] shadow-xs">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-0">
        {/* Logo */}
        <Link
          href={homeHref}
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
          <span className="hidden text-xs leading-tight font-bold text-white/90 sm:inline">
            Kementerian Kelautan <br /> dan Perikanan Republik Indonesia
          </span>
        </Link>

        {/* User Navigation (Client Part) */}
        <Suspense
          fallback={
            <div className="size-10 animate-pulse rounded-full bg-white/10" />
          }
        >
          <DropdownUser />
        </Suspense>
      </nav>
    </header>
  );
}
