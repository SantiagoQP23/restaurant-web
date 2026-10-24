import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge, type BadgeVariant } from "@/shared/components/ui/badge";
import { cn, formatCurrency, formatStringDate } from "@/shared/lib/utils";
import {
  OrderPaymentStatus,
  OrderStatus,
  OrderStatusSpanish,
} from "@/shared/models/order.model";
import type { Order } from "@/shared/models/order.model";
import {
  getPaymentBadgeVariant,
  orderTableLabel,
} from "../helpers/orders.helper";
import { Users } from "lucide-react";

type Props = {
  order: Order;
  isSelected?: boolean;
  onClick?: () => void;
};

export const statusBadgeVariant = (status: OrderStatus): BadgeVariant => {
  switch (status) {
    case OrderStatus.PENDING:
      return "warning";
    case OrderStatus.IN_PROGRESS:
      return "info";
    case OrderStatus.READY:
      return "success";
    default:
      return "neutral";
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
        "cursor-pointer",
        isSelected && "border-primary",
      )}
      onClick={onClick}
    >
      <CardHeader className="gap-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-semibold tracking-tight">
            {orderTableLabel(order)}
          </CardTitle>
          <div className="flex flex-wrap items-center justify-end gap-1">
            <Badge variant={statusBadgeVariant(order.status)}>
              {statusLabel(order.status)}
            </Badge>
            <Badge variant={getPaymentBadgeVariant(order.paymentStatus)}>
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
