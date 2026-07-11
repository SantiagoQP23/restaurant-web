import NiceModal, { useModal } from "@ebay/nice-modal-react";
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
import { useDeletePaymentMethod } from "../hooks/useDeletePaymentMethod";
import type { PaymentMethod } from "@/shared/models/payment-method.model";

type RemovePaymentMethodModalProps = {
  method: PaymentMethod;
  onRemoved?: () => void;
};

export const RemovePaymentMethodModal = NiceModal.create(
  ({ method, onRemoved }: RemovePaymentMethodModalProps) => {
    const modal = useModal();
    const { deletePaymentMethod } = useDeletePaymentMethod();

    const handleRemove = async () => {
      await deletePaymentMethod.mutateAsync(method.id);
      modal.hide();
      onRemoved?.();
    };

    const isLoading = deletePaymentMethod.isPending;

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
            <DialogTitle>Eliminar metodo de pago</DialogTitle>
            <DialogDescription>
              Estas a punto de eliminar{" "}
              <strong>{method.name}</strong>. Esta accion no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isLoading}>
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="button"
              variant="destructive"
              onClick={handleRemove}
              disabled={isLoading}
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
);
