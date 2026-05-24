import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import type { Table } from "@/shared/models/table.model";
import { OrderStatus } from "@/shared/models/order.model";
import { useTableOrders } from "../hooks/useTableOrders";

type Props = {
  table: Table;
};

const statusBadgeClass = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.IN_PROGRESS:
      return "rounded-full bg-sky-100 px-2 py-1 text-xs font-medium text-sky-700";
    case OrderStatus.READY:
      return "rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700";
    default:
      return "rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700";
  }
};

const statusLabel = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.IN_PROGRESS:
      return "En progreso";
    case OrderStatus.READY:
      return "Listo";
    default:
      return "Pendiente";
  }
};

export const TableOrdersPanel = ({ table }: Props) => {
  const { orders } = useTableOrders(table.id);

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle>Pedidos de Mesa {table.name}</CardTitle>
        <CardDescription>{orders.length} pedidos activos</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {orders.length === 0 ? (
          <div className="rounded-2xl border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
            No hay pedidos activos.
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border border-border/60 px-4 py-3"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium">#{order.num}</span>
                <span className={statusBadgeClass(order.status)}>
                  {statusLabel(order.status)}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {new Date(order.createdAt).toLocaleTimeString("es-EC", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span className="font-medium">${order.total}</span>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
