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
import { AccountType, type Account } from "@/shared/models/account.model";
import { useCreateAccount } from "../hooks/useCreateAccount";
import { useUpdateAccount } from "../hooks/useUpdateAccount";
import type { CreateAccountDto } from "../interfaces/dto/create-account.dto";

type AccountFormModalProps = {
  account?: Account;
  onSaved?: () => void;
};

const formatAccountType = (type: AccountType) =>
  type === AccountType.CASH ? "Efectivo" : "Banco";

export const AccountFormModal = NiceModal.create(
  ({ account, onSaved }: AccountFormModalProps) => {
    const modal = useModal();
    const isEdit = Boolean(account);
    const { createAccount } = useCreateAccount();
    const { updateAccount } = useUpdateAccount();

    const {
      register,
      handleSubmit,
      watch,
      reset,
      setValue,
      formState: { errors, isSubmitting },
    } = useForm<CreateAccountDto>({
      defaultValues: {
        name: account?.name ?? "",
        description: account?.description ?? "",
        num: account?.num ?? "",
        type: account?.type ?? AccountType.CASH,
      },
    });

    const watchedValues = watch();
    const normalizedInitial = {
      name: account?.name?.trim() ?? "",
      description: account?.description?.trim() ?? "",
      num: account?.num?.trim() ?? "",
      type: account?.type ?? AccountType.CASH,
    };
    const normalizedCurrent = {
      name: watchedValues.name?.trim() ?? "",
      description: watchedValues.description?.trim() ?? "",
      num: watchedValues.num?.trim() ?? "",
      type: watchedValues.type ?? AccountType.CASH,
    };
    const hasChanges =
      normalizedInitial.name !== normalizedCurrent.name ||
      normalizedInitial.description !== normalizedCurrent.description ||
      normalizedInitial.num !== normalizedCurrent.num ||
      normalizedInitial.type !== normalizedCurrent.type;
    const isSubmitDisabled = isSubmitting || (isEdit && !hasChanges);

    useEffect(() => {
      if (!modal.visible) {
        return;
      }
      reset({
        name: account?.name ?? "",
        description: account?.description ?? "",
        num: account?.num ?? "",
        type: account?.type ?? AccountType.CASH,
      });
    }, [account, modal.visible, reset]);

    const handleSave = async (values: CreateAccountDto) => {
      try {
        if (isEdit && account) {
          await updateAccount.mutateAsync({
            id: account.id,
            dto: values,
          });
        } else {
          await createAccount.mutateAsync(values);
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
              {isEdit ? "Editar cuenta" : "Nueva cuenta"}
            </DialogTitle>
            <DialogDescription>
              {isEdit
                ? `Actualiza la información de "${account?.name}".`
                : "Registra una cuenta de caja o banco."}
            </DialogDescription>
          </DialogHeader>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(handleSave)}
          >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="account-name">Nombre</FieldLabel>
                <Input
                  id="account-name"
                  type="text"
                  placeholder="Caja secundaria"
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
                <FieldLabel htmlFor="account-description">
                  Descripción
                </FieldLabel>
                <Input
                  id="account-description"
                  type="text"
                  placeholder="Caja de apoyo"
                  aria-invalid={Boolean(errors.description)}
                  {...register("description", {
                    required: "La descripción es obligatoria.",
                  })}
                />
                <FieldDescription>
                  Agrega una referencia para el equipo.
                </FieldDescription>
                {errors.description?.message && (
                  <FieldDescription>
                    {errors.description.message}
                  </FieldDescription>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="account-num">Número</FieldLabel>
                <Input
                  id="account-num"
                  type="text"
                  placeholder="0001234567"
                  aria-invalid={Boolean(errors.num)}
                  {...register("num", {
                    required: "El número es obligatorio.",
                  })}
                />
                {errors.num?.message && (
                  <FieldDescription>{errors.num.message}</FieldDescription>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="account-type">Tipo</FieldLabel>
                <Select
                  value={watchedValues.type}
                  onValueChange={(value) =>
                    setValue("type", value as AccountType, {
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger id="account-type" className="w-full">
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(AccountType).map((value) => (
                      <SelectItem key={value} value={value}>
                        {formatAccountType(value)}
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
