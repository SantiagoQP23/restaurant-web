import {
  detailStatusDotClass,
  progressValue,
} from "@/modules/orders/helpers/orders.helper";
import { useOrders } from "@/modules/orders/hooks/useOrders";
import type { UpdateOrderDetailDto } from "@/modules/orders/interfaces/dto/update-order.dto";
import { Button } from "@/shared/components/ui/button";
import { Progress } from "@/shared/components/ui/progress";
import type { OrderDetail } from "@/shared/models/order-detail.model";
import { OrderDetailStatus } from "@/shared/models/order.model";
import NiceModal from "@ebay/nice-modal-react";
import { ArrowRight, Edit, Plus } from "lucide-react";
import { useCallback } from "react";
import { ProductionEditOrderDetailDialog } from "./production-edit-order-detail-dialog.component";

interface Props {
  detail: OrderDetail;
  orderId: string;
}

export const ProductionOrderDetail = ({ detail, orderId }: Props) => {
  const { mutate: update } = useOrders().updateOrderDetail;

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

  return (
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
              onClick={() => onUpdateReady(detail.readyQuantity + 1)}
            >
              <Plus />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              aria-label="Ajustar listo"
              onClick={() => {
                NiceModal.show(ProductionEditOrderDetailDialog, {
                  detail,
                  onUpdateQuantity: onUpdateReady,
                });
              }}
            >
              <Edit />
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
              onClick={() => onAdvanceDetail()}
            >
              <ArrowRight />
            </Button>
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
    </div>
  );
};
