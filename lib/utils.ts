import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateWithTime(dateString?: string | null) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date
    .toLocaleString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
    .replace("pukul", "")
    .trim();
}

export const handleGeoCoordinateValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  const sanitized = value
    .replace(/[^0-9.-]/g, "") // Only allow digits, dot, and minus
    .replace(/(?!^)-/g, "") // Minus only at the start
    .replace(/(\..*?)\..*/g, "$1"); // Only one decimal point

  e.target.value = sanitized;
};
