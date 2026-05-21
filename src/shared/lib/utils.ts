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
