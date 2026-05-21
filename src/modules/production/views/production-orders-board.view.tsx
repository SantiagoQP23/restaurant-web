import * as React from "react";
import NiceModal from "@ebay/nice-modal-react";
import { ArrowRight, Plus, Sliders } from "lucide-react";
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
import { Progress } from "@/shared/components/ui/progress";
import {
  detailStatusDotClass,
  formatTime,
  progressValue,
  statusLabel,
} from "../pages/production.views.helpers";
import { orderTableLabel } from "@/modules/orders/helpers/orders.helper";
import { formatStringDate } from "@/shared/lib/utils";
import { ProductionOrderDetail } from "../components/production-order-detail.component";

type BoardColumn = {
  key: OrderDetailStatus;
  label: string;
  accent: string;
  entries: Array<{ order: Order; details: OrderDetail[] }>;
};

type ProductionOrdersBoardViewProps = {
  grouped: BoardColumn[];
  onAdvanceOrderDetails: (orderId: string, status: OrderDetailStatus) => void;
  onAdvanceDetail: (orderId: string, detailId: string) => void;
  onIncrementReady: (orderId: string, detailId: string) => void;
  onDecrementReady: (orderId: string, detailId: string) => void;
};

export const ProductionOrdersBoardView = ({
  grouped,
  onAdvanceOrderDetails,
  onAdvanceDetail,
  onIncrementReady,
  onDecrementReady,
}: ProductionOrdersBoardViewProps) => (
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
          {column.entries.map(({ order, details }) => (
            <Card key={`${order.id}-${column.key}`} size="sm">
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <CardTitle>{orderTableLabel(order)}</CardTitle>
                    <Badge variant="outline">{statusLabel(order.status)}</Badge>
                  </div>
                  {column.key !== OrderDetailStatus.READY && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        onAdvanceOrderDetails(order.id, column.key)
                      }
                    >
                      {column.key === OrderDetailStatus.PENDING
                        ? "Iniciar"
                        : "Listo"}
                    </Button>
                  )}
                </div>
                <CardDescription>
                  #{order.num} · {formatStringDate(order.createdAt, "HH:mm")} ·{" "}
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
          ))}
        </div>
      </section>
    ))}
  </div>
);
