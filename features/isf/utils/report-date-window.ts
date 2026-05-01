export interface IsfReportDateWindow {
  minDate: string | null;
  maxDate: string;
  canCreate: boolean;
  errorMessage?: string;
}

function toYmdLocal(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseYmdAsLocal(dateString: string): Date | null {
  if (!dateString) return null;
  const isoCandidate = new Date(dateString);
  if (!Number.isNaN(isoCandidate.getTime())) {
    return new Date(
      isoCandidate.getFullYear(),
      isoCandidate.getMonth(),
      isoCandidate.getDate(),
    );
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateString);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  const parsed = new Date(year, month, day);

  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month ||
    parsed.getDate() !== day
  ) {
    return null;
  }

  return parsed;
}

function getMondayAfter(date: Date): Date {
  const next = new Date(date);
  const day = next.getDay();
  const daysUntilMonday = day === 0 ? 1 : 8 - day;
  next.setDate(next.getDate() + daysUntilMonday);
  return next;
}

function getSundayOfWeek(date: Date): Date {
  const sunday = new Date(date);
  const day = sunday.getDay();
  const daysUntilSunday = day === 0 ? 0 : 7 - day;
  sunday.setDate(sunday.getDate() + daysUntilSunday);
  return sunday;
}

/**
 * Logika Window Tanggal - Murni Sequential
 * Mengabaikan "Hari Ini" (Now) secara total.
 */
export function getReportBounds(
  lastReportDate: string | null,
): IsfReportDateWindow {
  // 1. Jika belum ada laporan (Laporan Pertama) -> Bebas Total
  if (!lastReportDate) {
    return {
      minDate: null,
      maxDate: "2099-12-31",
      canCreate: true,
    };
  }

  const parsedLast = parseYmdAsLocal(lastReportDate);
  if (!parsedLast) {
    return {
      minDate: null,
      maxDate: "2099-12-31",
      canCreate: true,
    };
  }

  // 2. Jendela mingguan wajib berurutan (Senin ke Minggu) setelah laporan terakhir
  const nextMonday = getMondayAfter(parsedLast);
  const nextSunday = getSundayOfWeek(nextMonday);

  // Kembalikan jendela 1 minggu tersebut.
  // canCreate selalu true karena kita tidak membatasi seberapa jauh ke depan user boleh melapor.
  return {
    minDate: toYmdLocal(nextMonday),
    maxDate: toYmdLocal(nextSunday),
    canCreate: true,
  };
}
