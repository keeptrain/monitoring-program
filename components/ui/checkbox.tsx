"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";

interface CheckboxProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label?: string;
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, checked, onCheckedChange, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className="flex items-center gap-2">
        <div className="relative flex items-center justify-center">
          <input
            type="checkbox"
            id={inputId}
            ref={ref}
            checked={checked}
            onChange={(e) => onCheckedChange?.(e.target.checked)}
            className="peer sr-only"
            {...props}
          />
          <label
            htmlFor={inputId}
            className={cn(
              "border-primary ring-offset-background focus-visible:ring-ring peer-focus-visible:ring-ring flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-sm border shadow-sm transition-colors",
              "peer-checked:bg-primary peer-checked:text-primary-foreground",
              "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
              className,
            )}
          >
            {checked && <CheckIcon className="size-3" />}
          </label>
        </div>
        {label && (
          <label
            htmlFor={inputId}
            className="cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        )}
      </div>
    );
  },
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
