import * as React from "react";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { Pencil, Plus, Trash2 } from "lucide-react";
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
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { SetupStepper } from "../components/setup-stepper.component";
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
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  AccountType,
  type Account,
} from "@/shared/models/account.model";
import {
  PaymentMethodCategory,
  type PaymentMethod,
} from "@/shared/models/payment-method.model";
import { useAccounts } from "@/modules/finances/hooks/useAccounts";
import { AccountFormModal } from "@/modules/finances/components/account-form.modal";
import { RemoveAccountModal } from "@/modules/finances/components/remove-account.modal";

const formatAccountType = (type: AccountType) =>
  type === AccountType.CASH ? "Efectivo" : "Banco";

const formatPaymentType = (type: PaymentMethodCategory) => {
  switch (type) {
    case PaymentMethodCategory.CASH:
      return "Efectivo";
    case PaymentMethodCategory.CARD:
      return "Tarjeta";
    case PaymentMethodCategory.TRANSFER:
      return "Transferencia";
    case PaymentMethodCategory.DIGITAL_WALLET:
      return "Billetera digital";
    default:
      return "Otro";
  }
};

const initialPaymentMethods: PaymentMethod[] = [
  {
    id: 1,
    name: "Efectivo",
    commissionPercentage: 0,
    type: PaymentMethodCategory.CASH,
    allowedDestinationAccounts: [],
    defaultDestinationAccount: undefined,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    name: "Tarjeta Visa",
    commissionPercentage: 3.2,
    type: PaymentMethodCategory.CARD,
    allowedDestinationAccounts: [],
    defaultDestinationAccount: undefined,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const AddPaymentMethodModal = NiceModal.create(
  ({
    accounts,
    onCreate,
  }: {
    accounts: Account[];
    onCreate: (method: PaymentMethod) => void;
  }) => {
    const modal = useModal();
    const [name, setName] = React.useState("");
    const [commission, setCommission] = React.useState("0");
    const [type, setType] = React.useState<PaymentMethodCategory>(
      PaymentMethodCategory.CASH
    );
    const [allowedAccounts, setAllowedAccounts] = React.useState<number[]>(
      accounts.map((account) => account.id)
    );
    const [defaultAccountId, setDefaultAccountId] = React.useState<number | "">(
      accounts[0]?.id ?? ""
    );

    const toggleAccount = (accountId: number) => {
      setAllowedAccounts((current) =>
        current.includes(accountId)
          ? current.filter((id) => id !== accountId)
          : [...current, accountId]
      );
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const commissionValue = Number.parseFloat(commission);
      const allowed = accounts.filter((account) =>
        allowedAccounts.includes(account.id)
      );
      const defaultAccount = allowed.find(
        (account) => account.id === defaultAccountId
      );
      onCreate({
        id: Date.now(),
        name,
        commissionPercentage: Number.isFinite(commissionValue)
          ? commissionValue
          : 0,
        type,
        allowedDestinationAccounts: allowed,
        defaultDestinationAccount: defaultAccount,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
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
            <DialogTitle>Nuevo metodo de pago</DialogTitle>
            <DialogDescription>
              Configura un metodo y sus cuentas destino.
            </DialogDescription>
          </DialogHeader>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="payment-name">Nombre</FieldLabel>
                <Input
                  id="payment-name"
                  type="text"
                  placeholder="Tarjeta Mastercard"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="payment-commission">
                  Comision (%)
                </FieldLabel>
                <Input
                  id="payment-commission"
                  type="number"
                  inputMode="decimal"
                  placeholder="3.5"
                  value={commission}
                  onChange={(event) => setCommission(event.target.value)}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="payment-type">Categoria</FieldLabel>
                <Select
                  value={type}
                  onValueChange={(value) =>
                    setType(value as PaymentMethodCategory)
                  }
                >
                  <SelectTrigger id="payment-type" className="w-full">
                    <SelectValue placeholder="Selecciona una categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(PaymentMethodCategory).map((value) => (
                      <SelectItem key={value} value={value}>
                        {formatPaymentType(value)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel>Cuentas permitidas</FieldLabel>
                <FieldDescription>
                  Selecciona las cuentas donde se puede depositar.
                </FieldDescription>
                <div className="mt-2 flex flex-col gap-2">
                  {accounts.map((account) => (
                    <label
                      key={account.id}
                      className="flex items-center gap-2 text-sm"
                    >
                      <Checkbox
                        checked={allowedAccounts.includes(account.id)}
                        onCheckedChange={() => toggleAccount(account.id)}
                      />
                      {account.name}
                    </label>
                  ))}
                </div>
              </Field>
              <Field>
                <FieldLabel htmlFor="payment-default-account">
                  Cuenta por defecto
                </FieldLabel>
                <Select
                  value={defaultAccountId.toString()}
                  onValueChange={(value) =>
                    setDefaultAccountId(Number.parseInt(value, 10))
                  }
                >
                  <SelectTrigger id="payment-default-account" className="w-full">
                    <SelectValue placeholder="Selecciona una cuenta" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.id.toString()}>
                        {account.name}
                      </SelectItem>
                    ))}
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

const EditPaymentMethodModal = NiceModal.create(
  ({
    method,
    accounts,
    onUpdate,
  }: {
    method: PaymentMethod;
    accounts: Account[];
    onUpdate: (method: PaymentMethod) => void;
  }) => {
    const modal = useModal();
    const [name, setName] = React.useState(method.name);
    const [commission, setCommission] = React.useState(
      method.commissionPercentage.toString()
    );
    const [type, setType] = React.useState<PaymentMethodCategory>(method.type);
    const [allowedAccounts, setAllowedAccounts] = React.useState<number[]>(
      method.allowedDestinationAccounts.map((account) => account.id)
    );
    const [defaultAccountId, setDefaultAccountId] = React.useState<number | "">(
      method.defaultDestinationAccount?.id ?? ""
    );

    const toggleAccount = (accountId: number) => {
      setAllowedAccounts((current) =>
        current.includes(accountId)
          ? current.filter((id) => id !== accountId)
          : [...current, accountId]
      );
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const commissionValue = Number.parseFloat(commission);
      const allowed = accounts.filter((account) =>
        allowedAccounts.includes(account.id)
      );
      const defaultAccount = allowed.find(
        (account) => account.id === defaultAccountId
      );
      onUpdate({
        ...method,
        name,
        commissionPercentage: Number.isFinite(commissionValue)
          ? commissionValue
          : 0,
        type,
        allowedDestinationAccounts: allowed,
        defaultDestinationAccount: defaultAccount,
        updatedAt: new Date(),
      });
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
            <DialogTitle>Editar metodo de pago</DialogTitle>
            <DialogDescription>
              Actualiza la configuracion de "{method.name}".
            </DialogDescription>
          </DialogHeader>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor={`edit-payment-name-${method.id}`}>
                  Nombre
                </FieldLabel>
                <Input
                  id={`edit-payment-name-${method.id}`}
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor={`edit-payment-commission-${method.id}`}>
                  Comision (%)
                </FieldLabel>
                <Input
                  id={`edit-payment-commission-${method.id}`}
                  type="number"
                  inputMode="decimal"
                  value={commission}
                  onChange={(event) => setCommission(event.target.value)}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor={`edit-payment-type-${method.id}`}>
                  Categoria
                </FieldLabel>
                <Select
                  value={type}
                  onValueChange={(value) =>
                    setType(value as PaymentMethodCategory)
                  }
                >
                  <SelectTrigger
                    id={`edit-payment-type-${method.id}`}
                    className="w-full"
                  >
                    <SelectValue placeholder="Selecciona una categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(PaymentMethodCategory).map((value) => (
                      <SelectItem key={value} value={value}>
                        {formatPaymentType(value)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel>Cuentas permitidas</FieldLabel>
                <FieldDescription>
                  Selecciona las cuentas donde se puede depositar.
                </FieldDescription>
                <div className="mt-2 flex flex-col gap-2">
                  {accounts.map((account) => (
                    <label
                      key={account.id}
                      className="flex items-center gap-2 text-sm"
                    >
                      <Checkbox
                        checked={allowedAccounts.includes(account.id)}
                        onCheckedChange={() => toggleAccount(account.id)}
                      />
                      {account.name}
                    </label>
                  ))}
                </div>
              </Field>
              <Field>
                <FieldLabel htmlFor={`edit-payment-default-${method.id}`}>
                  Cuenta por defecto
                </FieldLabel>
                <Select
                  value={defaultAccountId.toString()}
                  onValueChange={(value) =>
                    setDefaultAccountId(Number.parseInt(value, 10))
                  }
                >
                  <SelectTrigger
                    id={`edit-payment-default-${method.id}`}
                    className="w-full"
                  >
                    <SelectValue placeholder="Selecciona una cuenta" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.id.toString()}>
                        {account.name}
                      </SelectItem>
                    ))}
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

export const PaymentMethodsPage = () => {
  const { accountsQuery } = useAccounts();
  const accounts = accountsQuery.data ?? [];

  const [methods, setMethods] = React.useState<PaymentMethod[]>(
    initialPaymentMethods
  );

  const handleCreateMethod = (method: PaymentMethod) => {
    setMethods((current) => [...current, method]);
  };

  const handleUpdateMethod = (method: PaymentMethod) => {
    setMethods((current) =>
      current.map((item) => (item.id === method.id ? method : item))
    );
  };

  const handleRemoveMethod = (methodId: number) => {
    setMethods((current) => current.filter((item) => item.id !== methodId));
  };

  return (
    <div className="flex min-h-svh flex-col p-6 md:p-10">
      <div className="flex flex-col gap-10">
        <div>
          <h1 className="text-2xl font-bold">Metodos de pago</h1>
          <p className="text-sm text-muted-foreground">
            Administra tus cuentas y los metodos disponibles para cobrar.
          </p>
        </div>

        <section className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Cuentas</h2>
              <p className="text-sm text-muted-foreground">
                Gestiona cajas y cuentas bancarias.
              </p>
            </div>
            <Button
              type="button"
              onClick={() =>
                NiceModal.show(AccountFormModal, {
                  onSaved: () => accountsQuery.refetch(),
                })
              }
            >
              <Plus />
              Agregar cuenta
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {accounts.map((account) => (
              <Card key={account.id} size="sm">
                <CardHeader>
                  <CardTitle>{account.name}</CardTitle>
                  <CardDescription>
                    {account.description} · {formatAccountType(account.type)}
                  </CardDescription>
                  <CardAction>
                    <div className="flex items-center gap-2">
                      <span
                        className={
                          account.isActive
                            ? "rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700"
                            : "rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground"
                        }
                      >
                        {account.isActive ? "Activa" : "Inactiva"}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`Editar ${account.name}`}
                        onClick={() =>
                          NiceModal.show(AccountFormModal, {
                            account,
                            onSaved: () => accountsQuery.refetch(),
                          })
                        }
                      >
                        <Pencil />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`Eliminar ${account.name}`}
                        onClick={() =>
                          NiceModal.show(RemoveAccountModal, {
                            account,
                            onRemoved: () => accountsQuery.refetch(),
                          })
                        }
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </CardAction>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Metodos de pago</h2>
              <p className="text-sm text-muted-foreground">
                Define comisiones y cuentas destino.
              </p>
            </div>
            <Button
              type="button"
              onClick={() =>
                NiceModal.show(AddPaymentMethodModal, {
                  accounts,
                  onCreate: handleCreateMethod,
                })
              }
            >
              <Plus />
              Agregar metodo
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {methods.map((method) => (
              <Card key={method.id} size="sm">
                <CardHeader>
                  <CardTitle>{method.name}</CardTitle>
                  <CardDescription>
                    {formatPaymentType(method.type)} · {method.commissionPercentage}%
                  </CardDescription>
                  <CardAction>
                    <div className="flex items-center gap-2">
                      <span
                        className={
                          method.isActive
                            ? "rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700"
                            : "rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground"
                        }
                      >
                        {method.isActive ? "Activo" : "Inactivo"}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`Editar ${method.name}`}
                        onClick={() =>
                          NiceModal.show(EditPaymentMethodModal, {
                            method,
                            accounts,
                            onUpdate: handleUpdateMethod,
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
                            aria-label={`Eliminar ${method.name}`}
                          >
                            <Trash2 />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Eliminar metodo</AlertDialogTitle>
                            <AlertDialogDescription>
                              Estas a punto de eliminar "{method.name}". Esta accion no
                              se puede deshacer.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              variant="destructive"
                              onClick={() => handleRemoveMethod(method.id)}
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardAction>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>
      </div>
      <SetupStepper className="mt-auto pt-6" />
    </div>
  );
};
