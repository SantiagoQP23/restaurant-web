import type { OrderDetail } from "./order-detail.model";
import type { Table } from "./table.model";
import type { User } from "./user.model";

export enum OrderStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  READY = "READY",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export enum OrderDetailStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  READY = "READY",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export enum OrderStatusPay {
  NO_PAY = "NO_PAY",
  PAY = "PAY",
  PARTIAL_PAY = "PARTIAL_PAY",
}

export enum OrderType {
  TAKE_AWAY = "TAKE_AWAY",
  IN_PLACE = "IN_PLACE",
  //DELIVERY = 'ENTREGA DOMICILIO',
}

export enum PaymentMethod {
  CASH = "CASH",
  CREDIT_CARD = "CREDIT_CARD",
  TRANSFER = "TRANSFER",
}

export enum OrderStatusSpanish {
  PENDING = "Pendiente",
  IN_PROGRESS = "Preparando",
  READY = "Listo",
  DELIVERED = "Entregado",
  CANCELLED = "Cancelado",
}

/**
 * Order Model
 * @version v1.1 22-12-2023 Adds the field bills and remove invoices
 */
export interface Order {
  notes: string;
  deliveryTime: string;
  createdAt: string;
  details: OrderDetail[];
  id: string;
  isPaid: boolean;
  num: number;
  people: number;
  status: OrderStatus;
  table?: Table;
  total: number;
  type: OrderType;
  updatedAt: string;
  user: User;
  isClosed: boolean;
  // bills: Bill[];
}
