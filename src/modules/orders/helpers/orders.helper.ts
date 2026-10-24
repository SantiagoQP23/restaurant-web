import type { BadgeVariant } from "@/shared/components/ui/badge";
import type { OrderDetail } from "@/shared/models/order-detail.model";
import { type Order, OrderPaymentStatus } from "@/shared/models/order.model";
import { OrderDetailStatus } from "@/shared/models/order.model";

export const orderTableLabel = (order: Order) =>
  order.table?.name ? `Mesa ${order.table.name}` : "Para llevar";

export const detailStatusDotClass = (status: OrderDetailStatus) => {
  switch (status) {
    case OrderDetailStatus.PENDING:
      return "bg-orange-400";
    case OrderDetailStatus.IN_PROGRESS:
      return "bg-blue-500";
    default:
      return "bg-emerald-500";
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

export const getPaymentBadgeVariant = (
  paymentStatus: OrderPaymentStatus,
): BadgeVariant => {
  switch (paymentStatus) {
    case OrderPaymentStatus.PAID:
      return "success";
    case OrderPaymentStatus.PARTIALLY_PAID:
      return "info";
    default:
      return "warning";
  }
};
