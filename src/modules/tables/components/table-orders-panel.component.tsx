import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import type { Table } from "@/shared/models/table.model";
import { OrderCard } from "@/modules/orders/components/order-card.component";
import { useTableOrders } from "../hooks/useTableOrders";

type Props = {
  table: Table;
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
          orders.map((order) => <OrderCard key={order.id} order={order} />)
        )}
      </CardContent>
    </Card>
  );
};
