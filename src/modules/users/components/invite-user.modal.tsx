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
import { Field, FieldGroup, FieldLabel } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useUsersSuggestions } from "../hooks/useUsers";
import { useRoles } from "@/modules/auth/hooks/useRoles";
import { useInvitation } from "../hooks/useInvitation";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import type { User } from "@/shared/models/user.model";

type InviteUserModalProps = {
  existingUsers: User[];
  onInvite?: () => void;
};

export const InviteUserModal = NiceModal.create(
  ({ existingUsers, onInvite }: InviteUserModalProps) => {
    const modal = useModal();
    const { search, handleChangeSearch, usersQuery } = useUsersSuggestions();
    const { rolesQuery } = useRoles();
    const { sendInvitation } = useInvitation();
    const restaurant = useAuthStore.getState().restaurant;

    const [selectedUserId, setSelectedUserId] = React.useState<string | null>(
      null,
    );
    const [selectedRoleId, setSelectedRoleId] = React.useState<number | null>(
      null,
    );

    // Filter out users that already exist in the restaurant
    const availableUsers = React.useMemo(
      () =>
        usersQuery.data?.users.filter(
          (user) =>
            !existingUsers.some(
              (existingUser) =>
                existingUser.id === user.id &&
                existingUser.restaurantRoles.some(
                  (role) => role.restaurant.id === restaurant?.id,
                ),
            ),
        ) || [],
      [usersQuery.data?.users, existingUsers, restaurant?.id],
    );

    const handleInvite = async () => {
      if (!selectedUserId || !selectedRoleId) {
        return;
      }

      await sendInvitation.mutateAsync({
        userId: selectedUserId,
        roleId: selectedRoleId,
      });

      modal.hide();
      onInvite?.();
    };

    const isLoading = sendInvitation.isPending;

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
            <DialogTitle>Invitar usuario</DialogTitle>
            <DialogDescription>
              Busca por email o nombre de usuario para agregar al restaurante.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="user-search">Email o usuario</FieldLabel>
                <Input
                  id="user-search"
                  type="text"
                  placeholder="sofia.mena@example.com"
                  value={search}
                  onChange={(event) => handleChangeSearch(event.target.value)}
                />
              </Field>
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
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </FieldGroup>
            <div className="flex flex-col gap-2">
              {usersQuery.isLoading ? (
                <div className="rounded-3xl border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
                  Buscando usuarios...
                </div>
              ) : availableUsers.length === 0 ? (
                <div className="rounded-3xl border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
                  No encontramos usuarios con ese criterio.
                </div>
              ) : (
                availableUsers.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    className={
                      selectedUserId === user.id
                        ? "flex items-center justify-between gap-2 rounded-3xl border border-primary/40 bg-primary/5 px-4 py-3 text-left"
                        : "flex items-center justify-between gap-2 rounded-3xl border border-border/60 px-4 py-3 text-left"
                    }
                    onClick={() => setSelectedUserId(user.id)}
                  >
                    <div>
                      <div className="text-sm font-medium">
                        {user.person.firstName} {user.person.lastName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {user.person.email} · @{user.username}
                      </div>
                    </div>
                    {selectedUserId === user.id && (
                      <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">
                        Seleccionado
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isLoading}>
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="button"
              onClick={handleInvite}
              disabled={!selectedUserId || !selectedRoleId || isLoading}
              // loading={isLoading}
            >
              Invitar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
);
