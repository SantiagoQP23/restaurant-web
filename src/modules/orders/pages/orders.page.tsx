import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { OrderStatus, OrderStatusSpanish } from "@/shared/models/order.model";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { Button } from "@/shared/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { MoreVertical } from "lucide-react";
import { useOrders } from "../hooks/useOrders";

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
  const [isCloseDialogOpen, setIsCloseDialogOpen] = React.useState(false);

  const { mutate: updateOrder } = useOrders().updateOrder;

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

  const isOrderClosable = Boolean(
    selectedOrder &&
      selectedOrder.paymentStatus === "paid" &&
      selectedOrder.status === OrderStatus.DELIVERED,
  );

  const onCloseOrder = (orderId: string) => {
    updateOrder(
      { id: orderId, isClosed: true },
      {
        onSuccess: () => {
          setIsCloseDialogOpen(false);
          setSelectedOrderId(null);
        },
      },
    );
  };

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

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label="Acciones del pedido"
                        >
                          <MoreVertical />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {isOrderClosable ? (
                          <DropdownMenuItem
                            variant="destructive"
                            onSelect={(event) => {
                              event.preventDefault();
                              setIsCloseDialogOpen(true);
                            }}
                          >
                            Cerrar pedido
                          </DropdownMenuItem>
                        ) : (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="flex">
                                <DropdownMenuItem
                                  variant="destructive"
                                  disabled
                                >
                                  Cerrar pedido
                                </DropdownMenuItem>
                              </span>
                            </TooltipTrigger>
                            <TooltipContent side="left" sideOffset={8}>
                              Disponible solo si el pedido esta pagado y
                              entregado.
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
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
            <AlertDialog
              open={isCloseDialogOpen}
              onOpenChange={setIsCloseDialogOpen}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cerrar pedido</AlertDialogTitle>
                  <AlertDialogDescription>
                    Este pedido esta pagado y entregado. Estas seguro de
                    cerrarlo?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      onCloseOrder(selectedOrder.id);
                    }}
                  >
                    Confirmar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
    </div>
  );
};
