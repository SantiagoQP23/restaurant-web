import type { OrderDetail } from "@/shared/models/order-detail.model";
import { type Order, OrderPaymentStatus } from "@/shared/models/order.model";
import { OrderDetailStatus } from "@/shared/models/order.model";

export const orderTableLabel = (order: Order) =>
  order.table?.name ? `Mesa ${order.table.name}` : "Para llevar";

export const detailStatusDotClass = (status: OrderDetailStatus) => {
  switch (status) {
    case OrderDetailStatus.PENDING:
      return "bg-amber-400 border";
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

export const progressValueFrom = (readyQuantity: number, quantity: number) => {
  if (quantity <= 0) {
    return 0;
  }
  const percent = (readyQuantity / quantity) * 100;
  return Math.max(0, Math.min(100, percent));
};

export const nextDetailStatus = (status: OrderDetailStatus) => {
  switch (status) {
    case OrderDetailStatus.PENDING:
      return OrderDetailStatus.IN_PROGRESS;
    case OrderDetailStatus.IN_PROGRESS:
      return OrderDetailStatus.READY;
    default:
      return status;
  }
};

export const getPaymentStatusLabel = (
  paymentStatus: OrderPaymentStatus,
): string => {
  switch (paymentStatus) {
    case OrderPaymentStatus.PAID:
      return "Pagado";
    case OrderPaymentStatus.PARTIALLY_PAID:
      return "Pago parcial";
    default:
      return "Pago pendiente";
  }
};

export const getPaymentBadgeClass = (paymentStatus: OrderPaymentStatus) => {
  switch (paymentStatus) {
    case OrderPaymentStatus.PAID:
      return "rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700";
    case OrderPaymentStatus.PARTIALLY_PAID:
      return "rounded-full bg-sky-100 px-2 py-1 text-xs font-medium text-sky-700";
    default:
      return "rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700";
  }
};
