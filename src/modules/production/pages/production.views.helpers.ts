import {
  OrderDetailStatus,
  OrderStatus,
  OrderStatusSpanish,
  type Order,
} from "@/shared/models/order.model";
import type { OrderDetail } from "@/shared/models/order-detail.model";

export const formatTime = (date: Date) =>
  date.toLocaleTimeString("es-EC", {
    hour: "2-digit",
    minute: "2-digit",
  });

export const orderTableLabel = (order: Order) =>
  order.table?.name ?? "Para llevar";

export const statusLabel = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PENDING:
      return OrderStatusSpanish.PENDING;
    case OrderStatus.IN_PROGRESS:
      return OrderStatusSpanish.IN_PROGRESS;
    case OrderStatus.READY:
      return OrderStatusSpanish.READY;
    case OrderStatus.DELIVERED:
      return OrderStatusSpanish.DELIVERED;
    default:
      return OrderStatusSpanish.CANCELLED;
  }
};

export const detailStatusDotClass = (status: OrderDetailStatus) => {
  switch (status) {
    case OrderDetailStatus.PENDING:
      return "bg-amber-400";
    case OrderDetailStatus.IN_PROGRESS:
      return "bg-sky-400";
    default:
      return "bg-emerald-400";
  }
};

export const progressValue = (detail: OrderDetail) => {
  if (detail.quantity <= 0) {
    return 0;
  }
  const percent = (detail.readyQuantity / detail.quantity) * 100;
  return Math.max(0, Math.min(100, percent));
};
