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
import { useProductionAreas } from "@/modules/production-areas/hooks/useProductionAreas";

type ProductionAreaFormValues = {
  name: string;
  description: string;
};

type Props = {
  title: string;
  submitLabel: string;
  description?: string;
  initialValues: ProductionAreaFormValues;
  areaId?: number;
};

export const ProductionAreaFormDialog = NiceModal.create(
  ({ title, submitLabel, description, initialValues, areaId }: Props) => {
    const modal = useModal();
    const { createProductionArea, updateProductionArea } = useProductionAreas();

    const {
      register,
      handleSubmit,
      watch,
      reset,
      formState: { errors, isSubmitting },
    } = useForm<ProductionAreaFormValues>({
      defaultValues: initialValues,
    });

    const watchedValues = watch();
    const normalizedInitial = {
      name: initialValues.name.trim(),
      description: initialValues.description.trim(),
    };
    const normalizedCurrent = {
      name: watchedValues.name?.trim() ?? "",
      description: watchedValues.description?.trim() ?? "",
    };
    const hasChanges =
      normalizedInitial.name !== normalizedCurrent.name ||
      normalizedInitial.description !== normalizedCurrent.description;
    const isSubmitDisabled = isSubmitting || (!!areaId && !hasChanges);

    useEffect(() => {
      if (!modal.visible) {
        return;
      }
      reset(initialValues);
    }, [initialValues, modal.visible, reset]);

    const handleSave = async (values: ProductionAreaFormValues) => {
      try {
        if (areaId) {
          await updateProductionArea.mutateAsync({
            id: areaId,
            name: values.name.trim(),
            description: values.description.trim(),
          });
        } else {
          await createProductionArea.mutateAsync({
            name: values.name.trim(),
            description: values.description.trim(),
          });
        }
        modal.hide();
      } catch {
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
                <FieldLabel htmlFor="area-name">Nombre</FieldLabel>
                <Input
                  id="area-name"
                  type="text"
                  placeholder="Cocina principal"
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
                <FieldLabel htmlFor="area-description">Descripción</FieldLabel>
                <Input
                  id="area-description"
                  type="text"
                  placeholder="Área de preparación de alimentos"
                  aria-invalid={Boolean(errors.description)}
                  {...register("description")}
                />
                {errors.description?.message && (
                  <FieldDescription>
                    {errors.description.message}
                  </FieldDescription>
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