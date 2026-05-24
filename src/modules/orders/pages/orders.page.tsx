import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { formatCurrency, formatStringDate } from "@/shared/lib/utils";
import { OrderStatus, OrderStatusSpanish } from "@/shared/models/order.model";
import { Badge } from "@/shared/components/ui/badge";
import { useOrdersStore } from "../store/orders.store";
import { orderTableLabel } from "../helpers/orders.helper";
import { Users } from "lucide-react";

const statusFilters = [
  "Todos",
  OrderStatusSpanish.PENDING,
  OrderStatusSpanish.IN_PROGRESS,
  OrderStatusSpanish.READY,
  OrderStatusSpanish.DELIVERED,
] as const;

const statusBadgeClass = (status: OrderStatus) => {
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

const statusLabel = (status: OrderStatus) => {
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

export const OrdersPage = () => {
  const orders = useOrdersStore((state) => state.orders);
  const [selectedFilter, setSelectedFilter] = React.useState<
    (typeof statusFilters)[number]
  >(statusFilters[0]);
  const [selectedOrderId, setSelectedOrderId] = React.useState<string | null>(
    null,
  );

  const visibleOrders = React.useMemo(() => {
    if (selectedFilter === "Todos") {
      return orders;
    }
    return orders.filter(
      (order) => statusLabel(order.status) === selectedFilter,
    );
  }, [selectedFilter]);

  React.useEffect(() => {
    if (!selectedOrderId) {
      return;
    }
    const stillVisible = visibleOrders.some(
      (order) => order.id === selectedOrderId,
    );
    if (!stillVisible) {
      setSelectedOrderId(null);
    }
  }, [selectedOrderId, visibleOrders]);

  const selectedOrder = visibleOrders.find(
    (order) => order.id === selectedOrderId,
  );

  return (
    <div className="flex min-h-svh flex-col gap-6 p-6 md:p-10">
      <div>
        <h1 className="text-2xl font-bold">Pedidos</h1>
        <p className="text-sm text-muted-foreground">
          Revisa y gestiona los pedidos en tiempo real.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {statusFilters.map((status) => (
          <Badge
            key={status}
            variant={selectedFilter === status ? "default" : "outline"}
            onClick={() => setSelectedFilter(status)}
          >
            {status}
          </Badge>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-12">
        <div className={selectedOrder ? "lg:col-span-8" : "lg:col-span-12"}>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visibleOrders.map((order) => (
              <Card
                key={order.id}
                size="sm"
                className={
                  order.id === selectedOrderId
                    ? "ring-2 ring-primary/40"
                    : undefined
                }
                onClick={() =>
                  order.id !== selectedOrderId
                    ? setSelectedOrderId(order.id)
                    : setSelectedOrderId(null)
                }
              >
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle>{orderTableLabel(order)}</CardTitle>
                    <Badge className={statusBadgeClass(order.status)}>
                      {statusLabel(order.status)}
                    </Badge>
                  </div>
                  <CardDescription>
                    #{order.num} ·{" "}
                    {formatStringDate(order.deliveryTime, "HH:mm")} ·{" "}
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
                    <span className="font-medium">
                      {formatCurrency(order.total)}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    {formatStringDate(order.createdAt)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        {selectedOrder && (
          <div className="lg:col-span-4">
            <Card className="sticky top-6">
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle>{orderTableLabel(selectedOrder)}</CardTitle>
                  <span className={statusBadgeClass(selectedOrder.status)}>
                    {statusLabel(selectedOrder.status)}
                  </span>
                </div>
                <CardDescription>
                  #{selectedOrder.num} ·{" "}
                  {formatStringDate(selectedOrder.createdAt)}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex flex-col gap-3">
                  {selectedOrder.details.map((detail) => (
                    <div key={detail.id} className="flex flex-col gap-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">
                          {detail.quantity}x {detail.product.name}
                        </span>
                        <span className="text-muted-foreground">
                          {formatCurrency(detail.amount)}
                        </span>
                      </div>
                      {detail.description && (
                        <span className="text-xs text-muted-foreground">
                          Nota: {detail.description}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total</span>
                    <span className="font-semibold">
                      {formatCurrency(selectedOrder.total)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
