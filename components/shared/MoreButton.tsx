"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { ReactElement, ReactNode } from "react";
import { MoreHorizontalIcon } from "lucide-react";
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
  icon?: ReactNode;
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
      onClick: () => void;
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
        >
          <MoreHorizontalIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={cn("w-36", contentClassName)}>
        {menuItems.map((item) => {
          if ("type" in item && item.type === "separator") {
            return <DropdownMenuSeparator key={item.key} />;
          }

          const content = (
            <>
              {item.icon}
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
              >
                {item.child}
              </DropdownMenuItem>
            );
          }

          return (
            <DropdownMenuItem
              key={item.key}
              onClick={item.onClick}
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
