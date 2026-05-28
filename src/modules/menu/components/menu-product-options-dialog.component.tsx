import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
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
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { Plus, Trash2 } from "lucide-react";

type FormValues = {
  options: {
    name: string;
    price: string;
    trackStock: boolean;
    quantity?: string;
  }[];
};

type Props = {
  productName: string;
  onSubmit: (values: FormValues) => void;
};

export const MenuProductOptionsDialog = NiceModal.create(
  ({ productName, onSubmit }: Props) => {
    const modal = useModal();
    const {
      control,
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<FormValues>({
      defaultValues: {
        options: [
          {
            name: "",
            price: "",
            trackStock: false,
            quantity: "",
          },
        ],
      },
    });

    const { fields, append, remove } = useFieldArray({
      control,
      name: "options",
    });
    const trackStockValues = useWatch({
      control,
      name: "options",
    });

    return (
      <Dialog
        open={modal.visible}
        onOpenChange={(open) => {
          if (!open) {
            modal.hide();
          }
        }}
      >
        <DialogContent className="max-h-[90svh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Opciones del producto</DialogTitle>
            <DialogDescription>
              Configura las opciones para "{productName || "Nuevo producto"}".
            </DialogDescription>
          </DialogHeader>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit((values) => {
              onSubmit(values);
              modal.hide();
            })}
          >
            <FieldGroup>
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="rounded-3xl border border-border/60 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm font-medium">
                        Opcion {index + 1}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Configura precio y stock.
                      </p>
                    </div>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="Eliminar opcion"
                        onClick={() => remove(index)}
                      >
                        <Trash2 />
                      </Button>
                    )}
                  </div>
                  <div className="mt-4 grid gap-4">
                    <Field>
                      <FieldLabel htmlFor={`product-option-name-${index}`}>
                        Nombre
                      </FieldLabel>
                      <Input
                        id={`product-option-name-${index}`}
                        type="text"
                        placeholder="Porcion personal"
                        aria-invalid={Boolean(errors.options?.[index]?.name)}
                        {...register(`options.${index}.name`, {
                          required: "El nombre es obligatorio.",
                        })}
                      />
                      {errors.options?.[index]?.name?.message && (
                        <FieldDescription>
                          {errors.options[index]?.name?.message}
                        </FieldDescription>
                      )}
                    </Field>
                    <Field>
                      <FieldLabel htmlFor={`product-option-price-${index}`}>
                        Precio
                      </FieldLabel>
                      <Input
                        id={`product-option-price-${index}`}
                        type="number"
                        inputMode="decimal"
                        step="0.01"
                        placeholder="12.00"
                        aria-invalid={Boolean(errors.options?.[index]?.price)}
                        {...register(`options.${index}.price`, {
                          required: "El precio es obligatorio.",
                        })}
                      />
                      {errors.options?.[index]?.price?.message ? (
                        <FieldDescription>
                          {errors.options[index]?.price?.message}
                        </FieldDescription>
                      ) : (
                        <FieldDescription>
                          Indica el precio final para esta opcion.
                        </FieldDescription>
                      )}
                    </Field>
                    <Field>
                      <div className="flex items-center gap-2">
                        <Controller
                          control={control}
                          name={`options.${index}.trackStock`}
                          render={({ field: checkboxField }) => (
                            <Checkbox
                              checked={checkboxField.value}
                              onCheckedChange={(checked) =>
                                checkboxField.onChange(Boolean(checked))
                              }
                            />
                          )}
                        />
                        <FieldLabel>Gestionar inventario</FieldLabel>
                      </div>
                    </Field>
                    {Boolean(trackStockValues?.[index]?.trackStock) && (
                      <Field>
                        <FieldLabel
                          htmlFor={`product-option-quantity-${index}`}
                        >
                          Cantidad inicial
                        </FieldLabel>
                        <Input
                          id={`product-option-quantity-${index}`}
                          type="number"
                          inputMode="numeric"
                          placeholder="25"
                          min={1}
                          aria-invalid={Boolean(
                            errors.options?.[index]?.quantity,
                          )}
                          {...register(`options.${index}.quantity`, {
                            required: "La cantidad es obligatoria.",
                          })}
                        />
                        {errors.options?.[index]?.quantity?.message && (
                          <FieldDescription>
                            {errors.options[index]?.quantity?.message}
                          </FieldDescription>
                        )}
                      </Field>
                    )}
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  append({
                    name: "",
                    price: "",
                    trackStock: false,
                    quantity: "",
                  })
                }
              >
                <Plus />
                Agregar opcion
              </Button>
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
  },
);
