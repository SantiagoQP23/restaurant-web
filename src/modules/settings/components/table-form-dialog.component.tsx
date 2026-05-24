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
  isEdit?: boolean;
  onSubmit?: (values: {
    name: string;
    description: string;
    chairs: number;
  }) => Promise<boolean> | boolean;
};

export const TableFormDialog = NiceModal.create(
  ({
    title,
    submitLabel,
    description,
    initialValues,
    isEdit,
    onSubmit,
  }: Props) => {
    const modal = useModal();
    const {
      register,
      handleSubmit,
      watch,
      reset,
      formState: { errors, isSubmitting },
    } = useForm<TableFormValues>({
      defaultValues: initialValues,
    });

    const watchedValues = watch();
    const normalizedInitial = {
      name: initialValues.name.trim(),
      description: initialValues.description.trim(),
      chairs: Number.parseInt(initialValues.chairs, 10),
    };
    const normalizedCurrent = {
      name: watchedValues.name?.trim() ?? "",
      description: watchedValues.description?.trim() ?? "",
      chairs: Number.parseInt(watchedValues.chairs ?? "", 10),
    };
    const hasChanges =
      normalizedInitial.name !== normalizedCurrent.name ||
      normalizedInitial.description !== normalizedCurrent.description ||
      normalizedInitial.chairs !== normalizedCurrent.chairs;
    const isSubmitDisabled = isSubmitting || (isEdit && !hasChanges);

    useEffect(() => {
      if (!modal.visible) {
        return;
      }
      reset(initialValues);
    }, [initialValues, modal.visible, reset]);

    const handleSave = async (values: TableFormValues) => {
      const parsedChairs = Number.parseInt(values.chairs, 10);
      if (!Number.isFinite(parsedChairs) || parsedChairs <= 0) {
        return;
      }
      try {
        const result = await onSubmit?.({
          name: values.name.trim(),
          description: values.description.trim(),
          chairs: parsedChairs,
        });
        if (result !== false) {
          modal.hide();
        }
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
              <Button type="submit" disabled={isSubmitDisabled}>
                {submitLabel}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  },
);
