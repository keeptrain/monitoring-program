import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString?: string | null) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
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

export const handleInputNumberValueChange = (
  e: React.ChangeEvent<HTMLInputElement>,
) => {
  const value = e.target.value;
  const sanitized = value.replace(/[^0-9]/g, ""); // Only allow digits

  e.target.value = sanitized;
};

export const handleGeoCoordinateValueChange = (
  e: React.ChangeEvent<HTMLInputElement>,
) => {
  const value = e.target.value;
  const sanitized = value
    .replace(/[^0-9.-]/g, "") // Only allow digits, dot, and minus
    .replace(/(?!^)-/g, "") // Minus only at the start
    .replace(/(\..*?)\..*/g, "$1"); // Only one decimal point

  e.target.value = sanitized;
};

export function generateUniqueFileName(file: File): string {
  // generate random string with 4 characters
  const randomStr = Math.random().toString(36).substring(2, 6);
  // get file extension
  const fileExt = (file.name.split(".").pop() || "bin").toLowerCase();
  // generate file name with format: timestamp-randomStr.ext
  const fileName = `${Date.now()}-${randomStr}.${fileExt}`;
  return fileName;
}
