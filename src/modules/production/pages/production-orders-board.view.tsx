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
} from "./production.views.helpers";
import { orderTableLabel } from "@/modules/orders/helpers/orders.helper";
import { formatStringDate } from "@/shared/lib/utils";

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
  editReadyQuantityModal: unknown;
};

export const ProductionOrdersBoardView = ({
  grouped,
  onAdvanceOrderDetails,
  onAdvanceDetail,
  onIncrementReady,
  onDecrementReady,
  editReadyQuantityModal,
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
                  <div key={detail.id} className="flex flex-col gap-1">
                    <div className="group flex items-start justify-between gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <span
                          className={`mt-1 size-2.5 shrink-0 rounded-full ${detailStatusDotClass(
                            detail.status,
                          )}`}
                        />
                        <div>
                          <div className="font-medium">
                            {detail.quantity}x {detail.product.name}
                          </div>
                        </div>
                      </div>
                      {detail.status !== OrderDetailStatus.READY && (
                        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-xs"
                            aria-label="Sumar listo"
                            onClick={() =>
                              onIncrementReady(order.id, detail.id)
                            }
                          >
                            <Plus />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-xs"
                            aria-label="Ajustar listo"
                            onClick={() =>
                              NiceModal.show(editReadyQuantityModal, {
                                detail,
                                onIncrement: () =>
                                  onIncrementReady(order.id, detail.id),
                                onDecrement: () =>
                                  onDecrementReady(order.id, detail.id),
                              })
                            }
                          >
                            <Sliders />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-xs"
                            aria-label={
                              detail.status === OrderDetailStatus.PENDING
                                ? "Marcar como preparando"
                                : "Marcar como listo"
                            }
                            onClick={() => onAdvanceDetail(order.id, detail.id)}
                          >
                            <ArrowRight />
                          </Button>
                        </div>
                      )}
                    </div>
                    {detail.quantity > 1 && detail.readyQuantity > 0 && (
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                          <span>Listo</span>
                          <span>
                            {detail.readyQuantity}/{detail.quantity}
                          </span>
                        </div>
                        <Progress
                          value={progressValue(detail)}
                          className="h-1"
                        />
                      </div>
                    )}
                    {detail.description && (
                      <span className="text-xs text-muted-foreground">
                        Nota: {detail.description}
                      </span>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    ))}
  </div>
);
