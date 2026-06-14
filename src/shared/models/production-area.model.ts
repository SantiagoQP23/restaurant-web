import type { Printer } from "./printer.model";

export interface ProductionArea {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  printers: Printer[];
  createdAt: Date;
  updatedAt: Date;
}
