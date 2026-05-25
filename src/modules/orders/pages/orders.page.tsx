import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { OrderStatusSpanish } from "@/shared/models/order.model";
import { useOrdersStore } from "../store/orders.store";
import {
  OrderCard,
  statusBadgeClass,
  statusLabel,
} from "../components/order-card.component";
import { formatCurrency, formatStringDate } from "@/shared/lib/utils";
import {
  getPaymentStatusLabel,
  orderTableLabel,
} from "../helpers/orders.helper";

const statusFilters = [
  "Todos",
  OrderStatusSpanish.PENDING,
  OrderStatusSpanish.IN_PROGRESS,
  OrderStatusSpanish.READY,
  OrderStatusSpanish.DELIVERED,
] as const;

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
  }, [selectedFilter, orders]);

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
              <OrderCard
                key={order.id}
                order={order}
                isSelected={order.id === selectedOrderId}
                onClick={() =>
                  order.id !== selectedOrderId
                    ? setSelectedOrderId(order.id)
                    : setSelectedOrderId(null)
                }
              />
            ))}
          </div>
        </div>
        {selectedOrder && (
          <div className="lg:col-span-4">
            <Card className="sticky top-6">
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle>{orderTableLabel(selectedOrder)}</CardTitle>

                  <div className="flex flex-wrap items-center justify-end gap-1">
                    <Badge
                      className={getPaymentStatusLabel(
                        selectedOrder.paymentStatus,
                      )}
                    >
                      {getPaymentStatusLabel(selectedOrder.paymentStatus)}
                    </Badge>
                    <Badge className={statusBadgeClass(selectedOrder.status)}>
                      {statusLabel(selectedOrder.status)}
                    </Badge>
                  </div>
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
