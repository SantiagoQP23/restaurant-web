import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { cn, formatCurrency, formatStringDate } from "@/shared/lib/utils";
import {
  OrderPaymentStatus,
  OrderStatus,
  OrderStatusSpanish,
} from "@/shared/models/order.model";
import type { Order } from "@/shared/models/order.model";
import { orderTableLabel } from "../helpers/orders.helper";
import { Users } from "lucide-react";

type Props = {
  order: Order;
  isSelected?: boolean;
  onClick?: () => void;
};

export const statusBadgeClass = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PENDING:
      return "rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700";
    case OrderStatus.IN_PROGRESS:
      return "rounded-full bg-sky-100 px-2 py-1 text-xs font-medium text-sky-700";
    case OrderStatus.READY:
      return "rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700";
    default:
      return "rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground";
  }
};

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

const paymentBadgeClass = (paymentStatus: OrderPaymentStatus) => {
  switch (paymentStatus) {
    case OrderPaymentStatus.PAID:
      return "rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700";
    case OrderPaymentStatus.PARTIALLY_PAID:
      return "rounded-full bg-sky-100 px-2 py-1 text-xs font-medium text-sky-700";
    default:
      return "rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700";
  }
};

const paymentLabel = (paymentStatus: OrderPaymentStatus) => {
  switch (paymentStatus) {
    case OrderPaymentStatus.PAID:
      return "Pagado";
    case OrderPaymentStatus.PARTIALLY_PAID:
      return "Pago parcial";
    default:
      return "Pago pendiente";
  }
};

export const OrderCard = ({ order, isSelected, onClick }: Props) => {
  const totalItems = order.details.reduce(
    (total, detail) => total + detail.quantity,
    0,
  );

  return (
    <Card
      size="sm"
      className={cn(
        "transition-shadow",
        isSelected && "ring-2 ring-primary/40",
      )}
      onClick={onClick}
    >
      <CardHeader className="gap-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-semibold tracking-tight">
            {orderTableLabel(order)}
          </CardTitle>
          <div className="flex flex-wrap items-center justify-end gap-1">
            <Badge className={statusBadgeClass(order.status)}>
              {statusLabel(order.status)}
            </Badge>
            <Badge className={paymentBadgeClass(order.paymentStatus)}>
              {paymentLabel(order.paymentStatus)}
            </Badge>
          </div>
        </div>
        <CardDescription className="flex flex-col gap-1">
          <span>
            #{order.num} · {formatStringDate(order.deliveryTime, "HH:mm")}
          </span>
          <span>
            {order.user.person.firstName} {order.user.person.lastName}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm">
          <div className="inline-flex items-center gap-1">
            <span className="text-muted-foreground">{totalItems} items · </span>
            <div className="inline-flex items-center gap-1">
              <Users size={16} /> {order.people}
            </div>
          </div>
          <span className="text-base font-semibold">
            {formatCurrency(order.total)}
          </span>
        </div>
        <div className="mt-3 border-t border-border/60 pt-2 text-xs text-muted-foreground">
          {formatStringDate(order.createdAt)}
        </div>
      </CardContent>
    </Card>
  );
};
