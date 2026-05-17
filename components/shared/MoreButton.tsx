"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { ReactElement } from "react";
import { LucideIcon, MoreHorizontalIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

type BaseItem = {
  type: "link" | "action" | "custom";
  key: string;
  label?: string;
  icon?: LucideIcon;
  disabled?: boolean;
  className?: string;
  destructive?: boolean;
};

export type MoreButtonMenuItem =
  | (BaseItem & {
      type: "link";
      href: string;
      onClick?: never;
      asChild?: never;
      child?: never;
    })
  | (BaseItem & {
      type: "action";
      onClick: (e: React.MouseEvent) => void;
      href?: never;
      asChild?: never;
      child?: never;
    })
  | (BaseItem & {
      type: "custom";
      asChild: true;
      child: ReactElement;
      href?: never;
      onClick?: never;
    })
  | {
      key: string;
      type: "separator";
    };

export type MoreButtonProps = {
  menuItems: MoreButtonMenuItem[];
  triggerClassName?: string;
  contentClassName?: string;
};

export function MoreButton({
  menuItems,
  triggerClassName,
  contentClassName,
}: MoreButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("size-8", triggerClassName)}
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontalIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={cn("w-40", contentClassName)}>
        {menuItems.map((item) => {
          if ("type" in item && item.type === "separator") {
            return <DropdownMenuSeparator key={item.key} />;
          }

          const content = (
            <>
              {item.icon && <item.icon className="mr-2 size-4" />}
              {item.label}
            </>
          );

          if (item.type === "link") {
            return (
              <DropdownMenuItem
                key={item.key}
                asChild
                disabled={item.disabled}
                className={item.className}
                variant={item.destructive ? "destructive" : "default"}
                onSelect={(e) => e.preventDefault()}
                onClick={(e) => e.stopPropagation()}
              >
                <Link href={item.href}>{content}</Link>
              </DropdownMenuItem>
            );
          }

          if (item.type === "custom" && item.asChild) {
            return (
              <DropdownMenuItem
                key={item.key}
                asChild
                disabled={item.disabled}
                className={item.className}
                variant={item.destructive ? "destructive" : "default"}
                onClick={(e) => e.stopPropagation()}
              >
                {item.child}
              </DropdownMenuItem>
            );
          }

          return (
            <DropdownMenuItem
              key={item.key}
              onClick={(e) => {
                e.stopPropagation();
                item.onClick(e);
              }}
              disabled={item.disabled}
              className={item.className}
              variant={item.destructive ? "destructive" : "default"}
            >
              {content}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
