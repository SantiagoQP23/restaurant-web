import { OrderDetailStatus, type Order } from "@/shared/models/order.model";
import type { OrderDetail } from "@/shared/models/order-detail.model";
import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { statusLabel } from "../pages/production.views.helpers";
import {
  nextDetailStatus,
  orderTableLabel,
} from "@/modules/orders/helpers/orders.helper";
import { formatMinutesFromNow, formatStringDate } from "@/shared/lib/utils";
import { ProductionOrderDetail } from "../components/production-order-detail.component";
import { useNow } from "@/shared/hooks/useNow";
import { useOrders } from "@/modules/orders/hooks/useOrders";
import type { UpdateMultipleOrderDetailsStatusDto } from "@/modules/orders/interfaces/dto/update-order.dto";

type BoardColumn = {
  key: OrderDetailStatus;
  label: string;
  accent: string;
  entries: Array<{ order: Order; details: OrderDetail[] }>;
};

type ProductionOrdersBoardViewProps = {
  grouped: BoardColumn[];
};

const deliveryElapsedMinutes = (deliveryTime: string) => {
  const delivery = new Date(deliveryTime);
  if (Number.isNaN(delivery.getTime())) {
    return 0;
  }
  const diffMs = Date.now() - delivery.getTime();
  return Math.max(0, Math.round(diffMs / 60000));
};

const deliveryBadgeClass = (deliveryTime: string) => {
  const elapsedMinutes = deliveryElapsedMinutes(deliveryTime);
  if (elapsedMinutes > 30) {
    return "bg-rose-100 text-rose-700";
  }
  if (elapsedMinutes > 10) {
    return "bg-amber-100 text-amber-700";
  }
  return "bg-emerald-100 text-emerald-700";
};

export const ProductionOrdersBoardView = ({
  grouped,
}: ProductionOrdersBoardViewProps) => {
  const { mutate: updateMultipleOrderDetailsStatus } =
    useOrders().updateMultipleOrderDetailsStatus;

  const now = useNow();

  const onAdvanceOrderDetails = (
    details: OrderDetail[],
    status: OrderDetailStatus,
  ) => {
    const nextStatus = nextDetailStatus(status);
    const data: UpdateMultipleOrderDetailsStatusDto = {
      status: nextStatus,
      orderDetails: details.map((detail) => detail.id),
    };

    updateMultipleOrderDetailsStatus(data);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {grouped.map((column) => (
        <section
          key={column.key}
          className="flex flex-col gap-4 rounded-4xl border border-border/60 bg-muted/30 p-4"
        >
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">{column.label}</div>
            <span
              className={`rounded-full px-2 py-1 text-xs font-medium ${column.accent}`}
            >
              {column.entries.reduce(
                (total, entry) => total + entry.details.length,
                0,
              )}
            </span>
          </div>
          <div className="flex flex-col gap-3">
            {column.entries.map(({ order, details }) => {
              return (
                <Card key={`${order.id}-${column.key}`} size="sm">
                  <CardHeader>
                    <div className="flex items-center justify-center ">
                      <Badge
                        className={deliveryBadgeClass(order.deliveryTime)}
                        variant="secondary"
                      >
                        {formatMinutesFromNow(order.deliveryTime, now)}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <CardTitle>{orderTableLabel(order)}</CardTitle>
                        <Badge variant="outline">
                          {statusLabel(order.status)}
                        </Badge>
                      </div>
                      {column.key !== OrderDetailStatus.READY && (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            onAdvanceOrderDetails(details, column.key)
                          }
                        >
                          {column.key === OrderDetailStatus.PENDING
                            ? "Iniciar"
                            : "Listo"}
                        </Button>
                      )}
                    </div>
                    <CardDescription>
                      #{order.num} ·{" "}
                      {formatStringDate(order.deliveryTime, "HH:mm")} ·{" "}
                      {order.user.person.firstName} {order.user.person.lastName}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3">
                    {details.map((detail) => (
                      <ProductionOrderDetail
                        key={detail.id}
                        detail={detail}
                        orderId={order.id}
                      />
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
};
