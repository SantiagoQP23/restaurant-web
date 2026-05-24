import {
  detailStatusDotClass,
  progressValue,
} from "@/modules/orders/helpers/orders.helper";
import { useOrders } from "@/modules/orders/hooks/useOrders";
import type { UpdateOrderDetailDto } from "@/modules/orders/interfaces/dto/update-order.dto";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Progress } from "@/shared/components/ui/progress";
import type { OrderDetail } from "@/shared/models/order-detail.model";
import { OrderDetailStatus } from "@/shared/models/order.model";
import NiceModal from "@ebay/nice-modal-react";
import { ArrowRight, Edit, Pause, Plus } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { ProductionEditOrderDetailDialog } from "./production-edit-order-detail-dialog.component";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";

interface Props {
  detail: OrderDetail;
  orderId: string;
}

export const ProductionOrderDetail = ({ detail, orderId }: Props) => {
  const { mutate: update } = useOrders().updateOrderDetail;
  const [isOpen, setIsOpen] = useState(false);

  const formattedCreatedAt = useMemo(
    () =>
      detail.createdAt
        ? new Date(detail.createdAt).toLocaleString("es-EC", {
            dateStyle: "medium",
            timeStyle: "short",
          })
        : "—",
    [detail.createdAt],
  );

  const formattedUpdatedAt = useMemo(
    () =>
      detail.updatedAt
        ? new Date(detail.updatedAt).toLocaleString("es-EC", {
            dateStyle: "medium",
            timeStyle: "short",
          })
        : "—",
    [detail.updatedAt],
  );

  const recentUpdateLabel = useMemo(() => {
    if (!detail.updatedAt) {
      return null;
    }
    const updatedAtTime = new Date(detail.updatedAt).getTime();
    if (Number.isNaN(updatedAtTime)) {
      return null;
    }
    const diffMs = Date.now() - updatedAtTime;
    if (diffMs < 0 || diffMs > 2 * 60 * 1000) {
      return null;
    }
    const minutes = Math.max(0, Math.round(diffMs / 60000));
    if (minutes <= 0) {
      return "Actualizado hace menos de 1 min";
    }
    return `Actualizado hace ${minutes} min`;
  }, [detail.updatedAt]);

  const onAdvanceDetail = useCallback(() => {
    const data: UpdateOrderDetailDto = {
      orderId,
      id: detail.id,
      status:
        detail.status === OrderDetailStatus.PENDING
          ? OrderDetailStatus.IN_PROGRESS
          : OrderDetailStatus.READY,
    };

    update(data);
  }, [detail.id, orderId, update]);

  const onStopPreparation = useCallback(() => {
    const data: UpdateOrderDetailDto = {
      orderId,
      id: detail.id,
      status: OrderDetailStatus.PENDING,
    };

    update(data);
  }, [detail.id, orderId, update]);

  const onUpdateReady = useCallback(
    (readyQuantity: number) => {
      const data: UpdateOrderDetailDto = {
        orderId: orderId,
        id: detail.id,
        readyQuantity,
      };

      update(data);
    },
    [orderId, detail, update],
  );

  const showProductOptionName =
    detail.product.options.length > 1 && detail.productOption;

  return (
    <div key={detail.id} className="flex flex-col gap-1">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalle del pedido</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 text-sm">
            <div className="flex flex-col gap-1">
              <div className="text-base font-semibold">
                {detail.quantity}x {detail.product.name}
              </div>
              {detail.productOption && (
                <span className="text-xs text-muted-foreground">
                  Opcion: {detail.productOption.name}
                </span>
              )}
              {detail.description && (
                <span className="text-xs text-muted-foreground">
                  Nota: {detail.description}
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">
                Listo: {detail.readyQuantity}/{detail.quantity}
              </Badge>
              {detail.price > 0 && (
                <Badge variant="outline">Precio: ${detail.price}</Badge>
              )}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
                <div className="text-xs uppercase text-muted-foreground">
                  Creado por
                </div>
                <div className="font-medium">
                  {detail.createdBy
                    ? `${detail.createdBy.person.firstName} ${detail.createdBy.person.lastName}`
                    : "—"}
                </div>
                <div className="text-xs text-muted-foreground">
                  {formattedCreatedAt}
                </div>
              </div>
              <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
                <div className="text-xs uppercase text-muted-foreground">
                  Actualizado por
                </div>
                <div className="font-medium">
                  {detail.updatedBy
                    ? `${detail.updatedBy.person.firstName} ${detail.updatedBy.person.lastName}`
                    : "—"}
                </div>
                <div className="text-xs text-muted-foreground">
                  {formattedUpdatedAt}
                </div>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
                <div className="text-xs uppercase text-muted-foreground">
                  Cantidad servida
                </div>
                <div className="font-medium">{detail.qtyDelivered}</div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cerrar
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div
        className="group flex items-start justify-between gap-3 text-sm"
        role="button"
        tabIndex={0}
        onClick={() => setIsOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setIsOpen(true);
          }
        }}
      >
        <div className="flex items-center gap-2">
          <span
            className={`mt-1 size-2.5 shrink-0 rounded-full ${detailStatusDotClass(
              detail.status,
            )}`}
          />
          <div>
            <div className="font-medium">
              {detail.quantity}x {detail.product.name}{" "}
              {detail.productOption &&
                detail.price !== detail.productOption?.price &&
                `($${detail.price})`}
              {showProductOptionName && ` ${detail.productOption!.name}`}
            </div>
          </div>
        </div>
        {detail.status !== OrderDetailStatus.READY && (
          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  aria-label="Sumar listo"
                  onClick={(event) => {
                    event.stopPropagation();
                    onUpdateReady(detail.readyQuantity + 1);
                  }}
                >
                  <Plus />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" align="center">
                Sumar listo
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  aria-label="Ajustar listo"
                  onClick={(event) => {
                    event.stopPropagation();
                    NiceModal.show(ProductionEditOrderDetailDialog, {
                      detail,
                      onUpdateQuantity: onUpdateReady,
                    });
                  }}
                >
                  <Edit />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" align="center">
                Ajustar listo
              </TooltipContent>
            </Tooltip>
            {detail.status === OrderDetailStatus.IN_PROGRESS && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    aria-label="Detener preparación"
                    onClick={(event) => {
                      event.stopPropagation();
                      onStopPreparation();
                    }}
                  >
                    <Pause />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" align="center">
                  Detener preparación
                </TooltipContent>
              </Tooltip>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  aria-label={
                    detail.status === OrderDetailStatus.PENDING
                      ? "Marcar como preparando"
                      : "Marcar como listo"
                  }
                  onClick={(event) => {
                    event.stopPropagation();
                    onAdvanceDetail();
                  }}
                >
                  <ArrowRight />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" align="center">
                {detail.status === OrderDetailStatus.PENDING
                  ? "Marcar como preparando"
                  : "Marcar como listo"}
              </TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>

      {detail.description && (
        <span className=" text-gray-500">{detail.description}</span>
      )}
      {detail.quantity > 1 && detail.readyQuantity > 0 && (
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Listo</span>
            <span>
              {detail.readyQuantity}/{detail.quantity}
            </span>
          </div>
          <Progress value={progressValue(detail)} className="h-1" />
        </div>
      )}
      {recentUpdateLabel && (
        <span className="text-xs text-muted-foreground">
          {recentUpdateLabel}
        </span>
      )}
    </div>
  );
};
