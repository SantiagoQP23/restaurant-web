import type { PrinterConnectionType } from "@/shared/models/printer.model";

export interface CreatePrinterDto {
  name: string;
  connectionType: PrinterConnectionType;
  ipAddress?: string;
  port: number;
}
