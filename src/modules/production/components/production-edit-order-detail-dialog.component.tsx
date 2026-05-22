import type { OrderDetail } from "@/shared/models/order-detail.model";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { useEffect, useState } from "react";

import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Progress } from "@/shared/components/ui/progress";
import { Minus, Plus } from "lucide-react";
import { progressValueFrom } from "@/modules/orders/helpers/orders.helper";

interface Props {
  detail: OrderDetail;
  onUpdateQuantity: (quantity: number) => void;
}

export const ProductionEditOrderDetailDialog = NiceModal.create(
  ({ detail, onUpdateQuantity }: Props) => {
    const modal = useModal();
    const [readyQuantity, setReadyQuantity] = useState(detail.readyQuantity);

    const handleIncrement = () => {
      if (readyQuantity >= detail.quantity) {
        return;
      }
      setReadyQuantity((current) => current + 1);
    };

    const handleDecrement = () => {
      if (readyQuantity <= 0) {
        return;
      }
      setReadyQuantity((current) => current - 1);
    };

    const onSave = () => {
      onUpdateQuantity(readyQuantity);
      modal.hide();
    };

    useEffect(() => {
      setReadyQuantity(detail.readyQuantity);
    }, [detail, setReadyQuantity]);

    const showProductOptionName =
      detail.product.options.length > 1 && detail.productOption;

    return (
      <Dialog
        open={modal.visible}
        onOpenChange={(open) => {
          if (!open) {
            modal.hide();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {detail.product.name}

              {showProductOptionName && ` ${detail.productOption!.name}`}
            </DialogTitle>
            <DialogDescription>
              Ajusta la cantidad lista para este producto.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Listo</span>
              <span>
                {readyQuantity}/{detail.quantity}
              </span>
            </div>
            <Progress
              value={progressValueFrom(readyQuantity, detail.quantity)}
            />
            <div className="flex items-center justify-between gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleDecrement}
                disabled={readyQuantity <= 0}
                aria-label="Restar listo"
              >
                <Minus />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleIncrement}
                disabled={readyQuantity >= detail.quantity}
                aria-label="Sumar listo"
              >
                <Plus />
              </Button>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="button" onClick={onSave}>
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
);
