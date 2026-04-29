"use client";

import { ActivityIcon, FolderKanbanIcon, HelpingHandIcon } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export function ThematicProgramTabs() {
  const pathname = usePathname();
  const params = useParams();
  const type = params.type as string;

  const navigations = [
    {
      name: "Program",
      href: `/dashboard/thematic/${type}`,
      icon: ActivityIcon,
      active: pathname === `/dashboard/thematic/${type}`,
    },
    {
      name: "Proposal",
      href: `/dashboard/thematic/${type}/proposals`,
      icon: HelpingHandIcon,
      active: pathname.startsWith(`/dashboard/thematic/${type}/proposals`),
    },
    {
      name: "Manajemen Kuota",
      href: `/dashboard/thematic/${type}/quota`,
      icon: FolderKanbanIcon,
      active: pathname.startsWith(`/dashboard/thematic/${type}/quota`),
    },
  ];

  return (
    <div className="mb-6 flex items-center gap-2">
      {navigations.map((item) => (
        <Button
          key={item.href}
          variant={item.active ? "default" : "outline"}
          asChild
        >
          <Link href={item.href}>
            <item.icon className="size-4" />
            {item.name}
          </Link>
        </Button>
      ))}
    </div>
  );
}
