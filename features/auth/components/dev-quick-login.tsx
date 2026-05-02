"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { ActionState, login } from "@/features/auth/auth-actions";
import { useRouter } from "next/navigation";
import { useQueryState, parseAsStringLiteral } from "nuqs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Grid3X3Icon,
  LeafIcon,
  LayoutDashboardIcon,
  ShieldCheckIcon,
  ShrimpIcon,
  UserIcon,
  WavesIcon,
  ChevronDownIcon,
  LucideIcon,
} from "lucide-react";
import { ProgramScope } from "../types/user";

const roles = ["admin", "officer", "pmo"] as const;
type DevRole = (typeof roles)[number];
const roleParser = parseAsStringLiteral(roles);

const programs: {
  id: string;
  label: string;
  icon: LucideIcon;
  scope: ProgramScope;
}[] = [
  {
    id: "biofloc",
    label: "Bioflok",
    icon: Grid3X3Icon,
    scope: "biofloc",
  },
  {
    id: "minapadi",
    label: "Minapadi",
    icon: LeafIcon,
    scope: "minapadi",
  },
  { id: "isf", label: "ISF", icon: ShrimpIcon, scope: "isf" },
  {
    id: "revitalisasi",
    label: "Revitalisasi",
    icon: WavesIcon,
    scope: "revitalization",
  },
];

export function DevQuickLogin() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [role, setRole] = useQueryState<DevRole>(
    "role",
    roleParser.withDefault("officer"),
  );

  const handleLogin = (scope: ProgramScope) => {
    startTransition(async () => {});
  };

  return (
    <div className="mt-4 space-y-4">
      <Field>
        <FieldLabel>Mode Akses (Dev Only)</FieldLabel>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <div className="flex items-center gap-2">
                {role === "admin" && (
                  <ShieldCheckIcon className="size-4 text-zinc-400" />
                )}
                {role === "officer" && (
                  <UserIcon className="size-4 text-zinc-400" />
                )}
                {role === "pmo" && (
                  <LayoutDashboardIcon className="size-4 text-zinc-400" />
                )}
                <span className="capitalize">{role}</span>
              </div>
              <ChevronDownIcon className="size-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuRadioGroup
              value={role}
              onValueChange={(v) => setRole(v as DevRole)}
            >
              <DropdownMenuRadioItem value="admin">Admin</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="officer">
                Petugas
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="pmo">PMO</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </Field>

      <div className="grid grid-cols-2 gap-2">
        {programs.map((program) => (
          <Button
            key={program.id}
            variant="secondary"
            className="h-20 flex-col gap-2 rounded-none"
            disabled={isPending}
            onClick={() => handleLogin(program.scope)}
          >
            <program.icon className="size-5 text-zinc-400" />
            <span className="text-xs">{program.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
