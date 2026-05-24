import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { formatCurrency, formatStringDate } from "@/shared/lib/utils";
import { OrderStatus, OrderStatusSpanish } from "@/shared/models/order.model";
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

export const OrderCard = ({ order, isSelected, onClick }: Props) => {
  return (
    <Card
      size="sm"
      className={isSelected ? "ring-2 ring-primary/40" : undefined}
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle>{orderTableLabel(order)}</CardTitle>
          <Badge className={statusBadgeClass(order.status)}>
            {statusLabel(order.status)}
          </Badge>
        </div>
        <CardDescription>
          #{order.num} · {formatStringDate(order.deliveryTime, "HH:mm")} ·
          {" "}
          {order.user.person.firstName} {order.user.person.lastName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm">
          <div className="inline-flex items-center gap-1">
            <span className="text-muted-foreground">
              {order.details.reduce(
                (total, detail) => total + detail.quantity,
                0,
              )}{" "}
              items ·{" "}
            </span>
            <div className="inline-flex items-center gap-1">
              <Users size={16} /> {order.people}
            </div>
          </div>
          <span className="font-medium">{formatCurrency(order.total)}</span>
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          {formatStringDate(order.createdAt)}
        </div>
      </CardContent>
    </Card>
  );
};
