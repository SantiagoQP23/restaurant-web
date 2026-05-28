import * as React from "react";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
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

type Props = {
  title: string;
  submitLabel: string;
  sectionName: string;
  initialValues?: { name: string };
  onSubmit: (name: string) => void;
};

export const MenuCategoryDialog = NiceModal.create(
  ({ title, submitLabel, sectionName, initialValues, onSubmit }: Props) => {
    const modal = useModal();
    const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm<{ name: string }>({
      defaultValues: {
        name: "",
      },
    });

    React.useEffect(() => {
      if (!modal.visible) {
        return;
      }
      reset({ name: initialValues?.name ?? "" });
    }, [initialValues?.name, modal.visible, reset]);

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
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              Agrega una categoria para la seccion "{sectionName}".
            </DialogDescription>
          </DialogHeader>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit((values) => {
              onSubmit(values.name.trim());
              modal.hide();
            })}
          >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="category-name">Nombre</FieldLabel>
                <Input
                  id="category-name"
                  type="text"
                  placeholder="Platos especiales"
                  aria-invalid={Boolean(errors.name)}
                  {...register("name", {
                    required: "El nombre es obligatorio.",
                  })}
                />
                {errors.name?.message && (
                  <FieldDescription>{errors.name.message}</FieldDescription>
                )}
              </Field>
            </FieldGroup>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit">{submitLabel}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  },
);
