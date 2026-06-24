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
import { useDeleteAccount } from "../hooks/useDeleteAccount";
import type { Account } from "@/shared/models/account.model";

type RemoveAccountModalProps = {
  account: Account;
  onRemoved?: () => void;
};

export const RemoveAccountModal = NiceModal.create(
  ({ account, onRemoved }: RemoveAccountModalProps) => {
    const modal = useModal();
    const { deleteAccount } = useDeleteAccount();

    const handleRemove = async () => {
      await deleteAccount.mutateAsync(account.id);
      modal.hide();
      onRemoved?.();
    };

    const isLoading = deleteAccount.isPending;

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
            <DialogTitle>Eliminar cuenta</DialogTitle>
            <DialogDescription>
              Estás a punto de eliminar{" "}
              <strong>{account.name}</strong>. Esta acción no se puede
              deshacer.
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
