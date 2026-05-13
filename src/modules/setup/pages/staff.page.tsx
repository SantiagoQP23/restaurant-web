import * as React from "react";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { Pencil, Trash2, UserPlus, Users } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/shared/components/ui/empty";
import { Field, FieldGroup, FieldLabel } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { SetupStepper } from "../components/setup-stepper.component";

type StaffUser = {
  id: string;
  name: string;
  email: string;
  username: string;
  role: "admin" | "waiter" | "production";
};

const mockUsers: StaffUser[] = [
  {
    id: "usr-1",
    name: "Camila Perez",
    email: "camila.perez@example.com",
    username: "camila.p",
    role: "admin",
  },
  {
    id: "usr-2",
    name: "Luis Andrade",
    email: "luis.andrade@example.com",
    username: "landrade",
    role: "waiter",
  },
  {
    id: "usr-3",
    name: "Sofia Mena",
    email: "sofia.mena@example.com",
    username: "sofia.m",
    role: "production",
  },
  {
    id: "usr-4",
    name: "David Ortiz",
    email: "david.ortiz@example.com",
    username: "dortiz",
    role: "waiter",
  },
];

const InviteUserModal = NiceModal.create(
  ({
    existingUsers,
    onInvite,
  }: {
    existingUsers: StaffUser[];
    onInvite: (user: StaffUser) => void;
  }) => {
    const modal = useModal();
    const [query, setQuery] = React.useState("");
    const [selectedId, setSelectedId] = React.useState<string | null>(null);
    const [role, setRole] = React.useState<StaffUser["role"]>("waiter");

    const normalizedQuery = query.trim().toLowerCase();
    const availableUsers = React.useMemo(
      () =>
        mockUsers.filter(
          (user) =>
            !existingUsers.some((member) => member.id === user.id) &&
            (normalizedQuery.length === 0 ||
              user.name.toLowerCase().includes(normalizedQuery) ||
              user.email.toLowerCase().includes(normalizedQuery) ||
              user.username.toLowerCase().includes(normalizedQuery))
        ),
      [existingUsers, normalizedQuery]
    );

    const handleInvite = () => {
      const selectedUser = availableUsers.find(
        (user) => user.id === selectedId
      );
      if (!selectedUser) {
        return;
      }
      onInvite({ ...selectedUser, role });
      modal.hide();
    };

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
              Busca por email o nombre de usuario para agregar al equipo.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="staff-search">
                  Email o usuario
                </FieldLabel>
                <Input
                  id="staff-search"
                  type="text"
                  placeholder="sofia.mena@example.com"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="staff-role">Rol</FieldLabel>
                <Select
                  value={role}
                  onValueChange={(value) =>
                    setRole(value as StaffUser["role"])
                  }
                >
                  <SelectTrigger id="staff-role" className="w-full">
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="waiter">Mesero</SelectItem>
                    <SelectItem value="production">Produccion</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </FieldGroup>
            <div className="flex flex-col gap-2">
              {availableUsers.length === 0 ? (
                <div className="rounded-3xl border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
                  No encontramos usuarios con ese criterio.
                </div>
              ) : (
                availableUsers.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    className={
                      selectedId === user.id
                        ? "flex items-center justify-between gap-2 rounded-3xl border border-primary/40 bg-primary/5 px-4 py-3 text-left"
                        : "flex items-center justify-between gap-2 rounded-3xl border border-border/60 px-4 py-3 text-left"
                    }
                    onClick={() => setSelectedId(user.id)}
                  >
                    <div>
                      <div className="text-sm font-medium">{user.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {user.email} · @{user.username}
                      </div>
                    </div>
                    {selectedId === user.id && (
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
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="button" onClick={handleInvite} disabled={!selectedId}>
              Invitar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);

const EditRoleModal = NiceModal.create(
  ({
    user,
    onUpdate,
  }: {
    user: StaffUser;
    onUpdate: (updatedUser: StaffUser) => void;
  }) => {
    const modal = useModal();
    const [role, setRole] = React.useState<StaffUser["role"]>(user.role);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      onUpdate({ ...user, role });
      modal.hide();
    };

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
            <DialogTitle>Editar rol</DialogTitle>
            <DialogDescription>
              Actualiza el rol de "{user.name}".
            </DialogDescription>
          </DialogHeader>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor={`staff-role-${user.id}`}>Rol</FieldLabel>
                <Select
                  value={role}
                  onValueChange={(value) =>
                    setRole(value as StaffUser["role"])
                  }
                >
                  <SelectTrigger id={`staff-role-${user.id}`} className="w-full">
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="waiter">Mesero</SelectItem>
                    <SelectItem value="production">Produccion</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </FieldGroup>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit">Guardar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  }
);

export const StaffPage = () => {
  const [staff, setStaff] = React.useState<StaffUser[]>([]);

  const handleInvite = (user: StaffUser) => {
    setStaff((current) => [...current, user]);
  };

  const handleRemove = (userId: string) => {
    setStaff((current) => current.filter((user) => user.id !== userId));
  };

  const handleUpdateRole = (updatedUser: StaffUser) => {
    setStaff((current) =>
      current.map((user) =>
        user.id === updatedUser.id ? updatedUser : user
      )
    );
  };

  const inviteButton = (
    <Button
      type="button"
      onClick={() =>
        NiceModal.show(InviteUserModal, {
          existingUsers: staff,
          onInvite: handleInvite,
        })
      }
    >
      <UserPlus />
      Invitar usuario
    </Button>
  );

  return (
    <div className="flex min-h-svh flex-col p-6 md:p-10">
      <div className="flex flex-col gap-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Equipo</h1>
            <p className="text-sm text-muted-foreground">
              Agrega usuarios para operar el restaurante.
            </p>
          </div>
          {staff.length > 0 && inviteButton}
        </div>

        {staff.length === 0 ? (
          <Empty className="border-border/70">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Users />
              </EmptyMedia>
              <EmptyTitle>No hay usuarios invitados</EmptyTitle>
              <EmptyDescription>
                Invita a tu equipo para comenzar a gestionar el restaurante.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>{inviteButton}</EmptyContent>
          </Empty>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {staff.map((user) => (
              <div
                key={user.id}
                className="rounded-4xl border border-border/60 bg-card px-4 py-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-medium">{user.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {user.email}
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      @{user.username}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Editar rol de ${user.name}`}
                      onClick={() =>
                        NiceModal.show(EditRoleModal, {
                          user,
                          onUpdate: handleUpdateRole,
                        })
                      }
                    >
                      <Pencil />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label={`Eliminar a ${user.name}`}
                        >
                          <Trash2 />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Eliminar usuario</AlertDialogTitle>
                          <AlertDialogDescription>
                            Estas a punto de eliminar a "{user.name}" del restaurante.
                            Esta accion no se puede deshacer.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            variant="destructive"
                            onClick={() => handleRemove(user.id)}
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                <div className="mt-3 inline-flex rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                  {user.role === "admin"
                    ? "Administrador"
                    : user.role === "waiter"
                      ? "Mesero"
                      : "Produccion"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <SetupStepper className="mt-auto pt-6" />
    </div>
  );
};
