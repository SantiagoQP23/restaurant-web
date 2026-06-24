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
import { useRemoveUser } from "../hooks/useRemoveUser";
import type { User } from "@/shared/models/user.model";

type RemoveUserModalProps = {
  user: User;
  onRemoved?: () => void;
};

export const RemoveUserModal = NiceModal.create(
  ({ user, onRemoved }: RemoveUserModalProps) => {
    const modal = useModal();
    const { removeUser } = useRemoveUser();

    const handleRemove = async () => {
      await removeUser.mutateAsync(user.id);
      modal.hide();
      onRemoved?.();
    };

    const isLoading = removeUser.isPending;

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
            <DialogTitle>Eliminar usuario</DialogTitle>
            <DialogDescription>
              Estás a punto de eliminar a{" "}
              <strong>
                {user.person.firstName} {user.person.lastName}
              </strong>{" "}
              (@{user.username}) del restaurante. Esta acción no se puede deshacer.
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
