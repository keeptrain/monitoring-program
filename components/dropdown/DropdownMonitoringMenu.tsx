"use client";
import { FILTER_STATE } from "@/features/thematic/constants/filter-state";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const DropdownMonitoringMenu = ({
  isAuthenticated,
  userRole,
}: {
  isAuthenticated: boolean;
  userRole?: string;
}) => {
  const pathname = usePathname();

  const filteredItems = Object.entries(FILTER_STATE).filter(([key]) => {
    if (!isAuthenticated || !userRole) return true;
    return key === userRole;
  });

  const activeDashboard =
    Object.values(FILTER_STATE).find((item) => item.href === pathname) ||
    FILTER_STATE.biofloc_thematic;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <MenuIcon className="size-4" />
          <p className="ml-2 hidden sm:block">
            Dashboard: {activeDashboard.label}
          </p>
        </Button>
      </DropdownMenuTrigger>
      {!isAuthenticated && (
        <DropdownMenuContent className="min-w-64 rounded-none" align="end">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Pilih Dashboard Program</DropdownMenuLabel>
            {filteredItems.map(([key, value]) => (
              <DropdownMenuItem key={key} asChild className="rounded-none">
                <Link
                  href={value.href}
                  className="flex items-center gap-2 px-2"
                >
                  <value.icon className="size-4 text-zinc-400" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{value.label}</span>
                    <span className="text-[10px] leading-none text-zinc-400">
                      {value.sub}
                    </span>
                  </div>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
};
