import { useEffect, useState } from "react";
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
import { Checkbox } from "@/shared/components/ui/checkbox";
import { useProductionAreas } from "@/modules/production-areas/hooks/useProductionAreas";
import { usePrinters } from "../hooks/usePrinters";

type ProductionAreaFormValues = {
  name: string;
  description: string;
};

type Props = {
  title: string;
  submitLabel: string;
  description?: string;
  initialValues: ProductionAreaFormValues;
  printerIds?: string[];
  areaId?: number;
};

export const ProductionAreaFormDialog = NiceModal.create(
  ({ title, submitLabel, description, initialValues, printerIds, areaId }: Props) => {
    const modal = useModal();
    const { createProductionArea, updateProductionArea } = useProductionAreas();
    const { getAllQuery } = usePrinters();
    const [selectedPrinterIds, setSelectedPrinterIds] = useState<string[]>(printerIds ?? []);

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
      normalizedInitial.description !== normalizedCurrent.description ||
      JSON.stringify(printerIds ?? []) !== JSON.stringify(selectedPrinterIds);
    const isSubmitDisabled = isSubmitting || (!!areaId && !hasChanges);

    useEffect(() => {
      if (!modal.visible) {
        return;
      }
      reset(initialValues);
      setSelectedPrinterIds(printerIds ?? []);
    }, [initialValues, modal.visible, reset, printerIds]);

    const handleSave = async (values: ProductionAreaFormValues) => {
      try {
        const payload = {
          name: values.name.trim(),
          description: values.description.trim(),
          printerIds: selectedPrinterIds.length > 0 ? selectedPrinterIds : undefined,
        };

        if (areaId) {
          await updateProductionArea.mutateAsync({
            id: areaId,
            ...payload,
          });
        } else {
          await createProductionArea.mutateAsync(payload);
        }
        modal.hide();
      } catch {
        return;
      }
    };

    const togglePrinter = (printerId: string) => {
      setSelectedPrinterIds((prev) =>
        prev.includes(printerId)
          ? prev.filter((id) => id !== printerId)
          : [...prev, printerId]
      );
    };

    const printers = getAllQuery.data ?? [];
    const isLoadingPrinters = getAllQuery.isLoading;

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
              <Field>
                <FieldLabel>Impresoras</FieldLabel>
                <div className="flex flex-col gap-2">
                  {isLoadingPrinters ? (
                    <div className="text-sm text-muted-foreground">
                      Cargando impresoras...
                    </div>
                  ) : printers.length === 0 ? (
                    <div className="text-sm text-muted-foreground">
                      No hay impresoras configuradas.
                    </div>
                  ) : (
                    printers.map((printer) => (
                      <div
                        key={printer.id}
                        className="flex items-center gap-2"
                      >
                        <Checkbox
                          id={`printer-${printer.id}`}
                          checked={selectedPrinterIds.includes(printer.id)}
                          onCheckedChange={() => togglePrinter(printer.id)}
                        />
                        <label
                          htmlFor={`printer-${printer.id}`}
                          className="cursor-pointer text-sm"
                        >
                          {printer.name}
                        </label>
                      </div>
                    ))
                  )}
                </div>
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