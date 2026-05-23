import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);

export function formatStringDate(
  dateString: string,
  format: string = "DD/MM/YYYY HH:mm",
): string {
  if (!dateString) return "";

  const date = dayjs(dateString);

  if (!date.isValid()) return "Invalid date";

  return date.format(format);
}

export function formatMinutesFromNow(date: string | Date, currentTime: number) {
  const now = dayjs(currentTime);
  const target = dayjs(date);

  const diffMinutes = target.diff(now, "minute");

  if (diffMinutes > 0) {
    return `en ${diffMinutes} minuto${diffMinutes === 1 ? "" : "s"}`;
  }

  const pastMinutes = Math.abs(diffMinutes);

  return `hace ${pastMinutes} minuto${pastMinutes === 1 ? "" : "s"}`;
}
