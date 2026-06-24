import * as React from "react";
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
import { Field, FieldLabel } from "@/shared/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useRoles } from "@/modules/auth/hooks/useRoles";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { useUpdateUserRole } from "../hooks/useUpdateUserRole";
import type { User } from "@/shared/models/user.model";
import { useTranslation } from "react-i18next";

type ChangeUserRoleModalProps = {
  user: User;
  onRoleChanged?: () => void;
};

export const ChangeUserRoleModal = NiceModal.create(
  ({ user, onRoleChanged }: ChangeUserRoleModalProps) => {
    const modal = useModal();
    const { t } = useTranslation();
    const { rolesQuery } = useRoles();
    const { updateUserRole } = useUpdateUserRole();
    const restaurant = useAuthStore.getState().restaurant;

    const currentRole = user.restaurantRoles.find(
      (resRole) => resRole.restaurant.id === restaurant?.id,
    )?.role;

    const [selectedRoleId, setSelectedRoleId] = React.useState<number | null>(
      currentRole?.id ?? null,
    );

    const handleSave = async () => {
      if (!selectedRoleId) return;

      await updateUserRole.mutateAsync({
        userId: user.id,
        roleId: selectedRoleId,
      });

      modal.hide();
      onRoleChanged?.();
    };

    const isLoading = updateUserRole.isPending;
    const hasChanges = selectedRoleId !== currentRole?.id;

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
            <DialogTitle>Cambiar rol</DialogTitle>
            <DialogDescription>
              {user.person.firstName} {user.person.lastName} · @{user.username}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Field>
              <FieldLabel htmlFor="user-role">Rol</FieldLabel>
              <Select
                value={selectedRoleId?.toString() || ""}
                onValueChange={(value) => setSelectedRoleId(Number(value))}
              >
                <SelectTrigger id="user-role" className="w-full">
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  {rolesQuery.data?.map((role) => (
                    <SelectItem key={role.id} value={role.id.toString()}>
                      {t(`roles.${role.name}`, { defaultValue: role.name })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isLoading}>
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="button"
              onClick={handleSave}
              disabled={!selectedRoleId || !hasChanges || isLoading}
            >
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
);
