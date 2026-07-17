import NiceModal from "@ebay/nice-modal-react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { SetupStepper } from "../components/setup-stepper.component";
import { WhatsappFAB } from "../components/whatsapp-fab.component";
import { AccountType } from "@/shared/models/account.model";
import { PaymentMethodCategory } from "@/shared/models/payment-method.model";
import { useAccounts } from "@/modules/finances/hooks/useAccounts";
import { usePaymentMethods } from "@/modules/finances/hooks/usePaymentMethods";
import { AccountFormModal } from "@/modules/finances/components/account-form.modal";
import { RemoveAccountModal } from "@/modules/finances/components/remove-account.modal";
import { PaymentMethodFormModal } from "@/modules/finances/components/payment-method-form.modal";
import { RemovePaymentMethodModal } from "@/modules/finances/components/remove-payment-method.modal";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

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

export const PaymentMethodsPage = () => {
  const { accountsQuery } = useAccounts();
  const { paymentMethodsQuery } = usePaymentMethods();
  const accounts = accountsQuery.data ?? [];
  const methods = paymentMethodsQuery.data ?? [];
  const navigate = useNavigate();

  const onContinue = () => {
    if (methods.length === 0) {
      toast.error("Debes agregar al menos un método de pago");
      return;
    }
    navigate({ to: "/setup/staff" });
  };

  return (
    <div className="flex min-h-svh flex-col p-6 md:p-10">
      <div className="flex flex-col gap-10">
        <div>
          <h1 className="text-2xl font-bold">Métodos de pago</h1>
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
                    {formatAccountType(account.type)}
                  </CardDescription>
                  {account.description && (
                    <CardDescription>{account.description}</CardDescription>
                  )}
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
                NiceModal.show(PaymentMethodFormModal, {
                  onSaved: () => paymentMethodsQuery.refetch(),
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
                    {formatPaymentType(method.type)} ·{" "}
                    {method.commissionPercentage}%
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
                          NiceModal.show(PaymentMethodFormModal, {
                            method,
                            onSaved: () => paymentMethodsQuery.refetch(),
                          })
                        }
                      >
                        <Pencil />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`Eliminar ${method.name}`}
                        onClick={() =>
                          NiceModal.show(RemovePaymentMethodModal, {
                            method,
                            onRemoved: () => paymentMethodsQuery.refetch(),
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
        <div className="flex justify-center">
          <Button size="lg" onClick={onContinue}>
            Continuar
          </Button>
        </div>
      </div>
      <SetupStepper className="mt-auto pt-6" />
      <WhatsappFAB />
    </div>
  );
};
