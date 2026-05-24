import { useEffect } from "react";
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
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";

type TableFormValues = {
  name: string;
  description: string;
  chairs: string;
};

type Props = {
  title: string;
  submitLabel: string;
  description?: string;
  initialValues: TableFormValues;
  onSubmit?: (values: {
    name: string;
    description: string;
    chairs: number;
  }) => void;
};

export const TableFormDialog = NiceModal.create(
  ({ title, submitLabel, description, initialValues, onSubmit }: Props) => {
    const modal = useModal();
    const {
      register,
      handleSubmit,
      reset,
      formState: { errors, isSubmitting },
    } = useForm<TableFormValues>({
      defaultValues: initialValues,
    });

    useEffect(() => {
      if (!modal.visible) {
        return;
      }
      reset(initialValues);
    }, [initialValues, modal.visible, reset]);

    const handleSave = (values: TableFormValues) => {
      const parsedChairs = Number.parseInt(values.chairs, 10);
      if (!Number.isFinite(parsedChairs) || parsedChairs <= 0) {
        return;
      }
      onSubmit?.({
        name: values.name.trim(),
        description: values.description.trim(),
        chairs: parsedChairs,
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
            <DialogTitle>{title}</DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(handleSave)}
          >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="table-name">Nombre</FieldLabel>
                <Input
                  id="table-name"
                  type="text"
                  placeholder="Mesa terraza"
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
                <FieldLabel htmlFor="table-description">Descripcion</FieldLabel>
                <Input
                  id="table-description"
                  type="text"
                  placeholder="Cerca de la ventana"
                  aria-invalid={Boolean(errors.description)}
                  {...register("description")}
                />
                {errors.description?.message && (
                  <FieldDescription>
                    {errors.description.message}
                  </FieldDescription>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="table-chairs">Sillas</FieldLabel>
                <Input
                  id="table-chairs"
                  type="number"
                  min={1}
                  inputMode="numeric"
                  aria-invalid={Boolean(errors.chairs)}
                  {...register("chairs", {
                    required: "La cantidad de sillas es obligatoria.",
                  })}
                />
                {errors.chairs?.message && (
                  <FieldDescription>{errors.chairs.message}</FieldDescription>
                )}
              </Field>
            </FieldGroup>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isSubmitting}>
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {submitLabel}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  },
);
