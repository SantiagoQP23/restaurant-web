import NiceModal, { useModal } from "@ebay/nice-modal-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";

type FormValues = {
  name: string;
  price: string;
};

type Props = {
  productName: string;
  initialValues: FormValues;
  onSubmit: (values: { name: string; price: number }) => void;
};

export const MenuProductOptionDialog = NiceModal.create(
  ({ productName, initialValues, onSubmit }: Props) => {
    const modal = useModal();
    const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm<FormValues>({
      defaultValues: initialValues,
    });

    React.useEffect(() => {
      if (!modal.visible) {
        return;
      }
      reset(initialValues);
    }, [initialValues, modal.visible, reset]);

    const handleSave = (values: FormValues) => {
      const parsedPrice = Number.parseFloat(values.price);
      if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
        return;
      }
      onSubmit({ name: values.name.trim(), price: parsedPrice });
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
            <DialogTitle>Editar opcion</DialogTitle>
            <DialogDescription>
              Actualiza la opcion de "{productName}".
            </DialogDescription>
          </DialogHeader>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit(handleSave)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="option-name">Nombre</FieldLabel>
                <Input
                  id="option-name"
                  type="text"
                  placeholder="Extra queso"
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
                <FieldLabel htmlFor="option-price">Precio</FieldLabel>
                <Input
                  id="option-price"
                  type="number"
                  min={0}
                  inputMode="decimal"
                  aria-invalid={Boolean(errors.price)}
                  {...register("price", {
                    required: "El precio es obligatorio.",
                  })}
                />
                {errors.price?.message && (
                  <FieldDescription>{errors.price.message}</FieldDescription>
                )}
              </Field>
            </FieldGroup>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit">Guardar cambios</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  },
);
