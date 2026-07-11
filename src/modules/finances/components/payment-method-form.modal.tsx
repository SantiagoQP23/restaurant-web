import { useEffect } from "react";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { useForm } from "react-hook-form";
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
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  PaymentMethodCategory,
  type PaymentMethod,
} from "@/shared/models/payment-method.model";
import { useAccounts } from "../hooks/useAccounts";
import { useCreatePaymentMethod } from "../hooks/useCreatePaymentMethod";
import { useUpdatePaymentMethod } from "../hooks/useUpdatePaymentMethod";
import type { CreatePaymentMethodDto } from "../interfaces/dto/create-payment-method.dto";

type PaymentMethodFormModalProps = {
  method?: PaymentMethod;
  onSaved?: () => void;
};

type PaymentMethodFormValues = {
  name: string;
  type: PaymentMethodCategory;
  commissionPercentage: string;
  allowedDestinationAccountIds: number[];
  defaultDestinationAccountId: string;
};

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

export const PaymentMethodFormModal = NiceModal.create(
  ({ method, onSaved }: PaymentMethodFormModalProps) => {
    const modal = useModal();
    const isEdit = Boolean(method);
    const { accountsQuery } = useAccounts();
    const accounts = accountsQuery.data ?? [];
    const { createPaymentMethod } = useCreatePaymentMethod();
    const { updatePaymentMethod } = useUpdatePaymentMethod();

    const {
      register,
      handleSubmit,
      watch,
      reset,
      setValue,
      formState: { errors, isSubmitting },
    } = useForm<PaymentMethodFormValues>({
      defaultValues: {
        name: method?.name ?? "",
        type: method?.type ?? PaymentMethodCategory.CASH,
        commissionPercentage:
          method?.commissionPercentage?.toString() ?? "0",
        allowedDestinationAccountIds:
          method?.allowedDestinationAccounts.map((a) => a.id) ?? [],
        defaultDestinationAccountId:
          method?.defaultDestinationAccount?.id?.toString() ?? "",
      },
    });

    const watchedValues = watch();
    const normalizedInitial = {
      name: method?.name?.trim() ?? "",
      type: method?.type ?? PaymentMethodCategory.CASH,
      commissionPercentage: method?.commissionPercentage?.toString() ?? "0",
      allowedDestinationAccountIds:
        method?.allowedDestinationAccounts.map((a) => a.id).sort().join(",") ??
        "",
      defaultDestinationAccountId:
        method?.defaultDestinationAccount?.id?.toString() ?? "",
    };
    const normalizedCurrent = {
      name: watchedValues.name?.trim() ?? "",
      type: watchedValues.type ?? PaymentMethodCategory.CASH,
      commissionPercentage: watchedValues.commissionPercentage ?? "0",
      allowedDestinationAccountIds:
        [...(watchedValues.allowedDestinationAccountIds ?? [])].sort().join(","),
      defaultDestinationAccountId:
        watchedValues.defaultDestinationAccountId ?? "",
    };
    const hasChanges =
      normalizedInitial.name !== normalizedCurrent.name ||
      normalizedInitial.type !== normalizedCurrent.type ||
      normalizedInitial.commissionPercentage !==
        normalizedCurrent.commissionPercentage ||
      normalizedInitial.allowedDestinationAccountIds !==
        normalizedCurrent.allowedDestinationAccountIds ||
      normalizedInitial.defaultDestinationAccountId !==
        normalizedCurrent.defaultDestinationAccountId;
    const isSubmitDisabled = isSubmitting || (isEdit && !hasChanges);

    useEffect(() => {
      if (!modal.visible) {
        return;
      }
      reset({
        name: method?.name ?? "",
        type: method?.type ?? PaymentMethodCategory.CASH,
        commissionPercentage:
          method?.commissionPercentage?.toString() ?? "0",
        allowedDestinationAccountIds:
          method?.allowedDestinationAccounts.map((a) => a.id) ?? [],
        defaultDestinationAccountId:
          method?.defaultDestinationAccount?.id?.toString() ?? "",
      });
    }, [method, modal.visible, reset]);

    const toggleAccount = (accountId: number) => {
      const current = watchedValues.allowedDestinationAccountIds ?? [];
      const next = current.includes(accountId)
        ? current.filter((id) => id !== accountId)
        : [...current, accountId];
      setValue("allowedDestinationAccountIds", next, { shouldValidate: true });
    };

    const handleSave = async (values: PaymentMethodFormValues) => {
      const commissionValue = Number.parseFloat(values.commissionPercentage);
      const dto: CreatePaymentMethodDto = {
        name: values.name.trim(),
        type: values.type,
        commissionPercentage: Number.isFinite(commissionValue)
          ? commissionValue
          : 0,
        allowedDestinationAccountIds:
          values.allowedDestinationAccountIds.length > 0
            ? values.allowedDestinationAccountIds
            : undefined,
        defaultDestinationAccountId: values.defaultDestinationAccountId
          ? Number.parseInt(values.defaultDestinationAccountId, 10)
          : undefined,
      };

      try {
        if (isEdit && method) {
          await updatePaymentMethod.mutateAsync({
            id: method.id,
            dto,
          });
        } else {
          await createPaymentMethod.mutateAsync(dto);
        }
        modal.hide();
        onSaved?.();
      } catch (error) {
        return;
      }
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
            <DialogTitle>
              {isEdit ? "Editar metodo de pago" : "Nuevo metodo de pago"}
            </DialogTitle>
            <DialogDescription>
              {isEdit
                ? `Actualiza la configuracion de "${method?.name}".`
                : "Configura un metodo y sus cuentas destino."}
            </DialogDescription>
          </DialogHeader>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(handleSave)}
          >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="payment-name">Nombre</FieldLabel>
                <Input
                  id="payment-name"
                  type="text"
                  placeholder="Tarjeta Mastercard"
                  aria-invalid={Boolean(errors.name)}
                  {...register("name", {
                    required: "El nombre es obligatorio.",
                  })}
                />
                {errors.name?.message && (
                  <FieldDescription>{errors.name.message}</FieldDescription>
                )}
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
                  aria-invalid={Boolean(errors.commissionPercentage)}
                  {...register("commissionPercentage", {
                    required: "La comision es obligatoria.",
                  })}
                />
                {errors.commissionPercentage?.message && (
                  <FieldDescription>
                    {errors.commissionPercentage.message}
                  </FieldDescription>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="payment-type">Categoria</FieldLabel>
                <Select
                  value={watchedValues.type}
                  onValueChange={(value) =>
                    setValue("type", value as PaymentMethodCategory, {
                      shouldValidate: true,
                    })
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
                        checked={(
                          watchedValues.allowedDestinationAccountIds ?? []
                        ).includes(account.id)}
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
                  value={watchedValues.defaultDestinationAccountId ?? ""}
                  onValueChange={(value) =>
                    setValue("defaultDestinationAccountId", value, {
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger
                    id="payment-default-account"
                    className="w-full"
                  >
                    <SelectValue placeholder="Selecciona una cuenta" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((account) => (
                      <SelectItem
                        key={account.id}
                        value={account.id.toString()}
                      >
                        {account.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </FieldGroup>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isSubmitting}>
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitDisabled}>
                Guardar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  },
);
