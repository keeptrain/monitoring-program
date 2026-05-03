import { INDONESIA_PROVINCES } from "@/features/thematic/constants/indonesia-provinces";
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

export const handleNumberKeyDown = (
  e: React.KeyboardEvent<HTMLInputElement>,
) => {
  // Allow: Backspace, Delete, Tab, Escape, Enter
  if (
    ["Backspace", "Delete", "Tab", "Escape", "Enter"].includes(e.key) ||
    // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Cmd+A, Cmd+C, Cmd+V, Cmd+X
    ((e.ctrlKey || e.metaKey) &&
      ["a", "c", "v", "x"].includes(e.key.toLowerCase())) ||
    // Allow: Home, End, Left, Right
    ["Home", "End", "ArrowLeft", "ArrowRight"].includes(e.key)
  ) {
    return;
  }

  // Block: anything that is not a number
  if (!/^\d$/.test(e.key)) {
    e.preventDefault();
  }
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

export function toPreviewUrl(
  path: string,
  localPreviews?: Record<string, string>,
): string {
  if (localPreviews?.[path]) return localPreviews[path];
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("blob:")) return path;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET;
  if (!supabaseUrl || !bucket) return path;
  const normalizedPath = path.replace(/^\/+/, "");
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${normalizedPath}`;
}

export function mergeUnique(existing: string[], incoming: string[]) {
  return [...new Set([...existing, ...incoming])];
}

// Create a Map for O(1) lookup performance
const provinceIdMap = new Map(
  INDONESIA_PROVINCES.map((p) => [p.province_id, p.name]),
);

export function getProvinceNameById(
  provinceId?: string | number,
): string | undefined {
  const id = String(provinceId);
  return id ? provinceIdMap.get(id) : undefined;
}

export function getProvinceNameByIdOrFallback(
  provinceId?: string | number,
  fallback: string = "Provinsi Tidak Diketahui",
): string {
  return getProvinceNameById(provinceId) ?? fallback;
}
