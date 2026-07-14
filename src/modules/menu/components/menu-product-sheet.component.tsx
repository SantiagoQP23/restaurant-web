import * as React from "react";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/shared/components/ui/sheet";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Plus, Trash2 } from "lucide-react";
import { useProductionAreas } from "@/modules/production-areas/hooks/useProductionAreas";
import { useMenuMutations } from "@/modules/menu/hooks/useMenuMutations";
import type { MenuCategoryWithIndex } from "@/modules/menu/components/menu-product-dialog.component";
import type { ProductOption } from "@/shared/models/product-option.model";
import type { MenuSection } from "@/modules/menu/components/menu-setup/menu-setup.types";

export type MenuProductSheetMode = "create" | "update";

export type MenuProductSheetProps = {
  mode: MenuProductSheetMode;
  productId?: string;
  category: MenuCategoryWithIndex;
  categories: MenuCategoryWithIndex[];
  sections: MenuSection[];
  initialValues?: {
    name?: string;
    description?: string;
    categoryId?: string;
    productionAreaId?: string;
    price?: number;
    unitCost?: number;
    quantity?: number;
    options?: ProductOption[];
  };
};

type OptionFormValues = {
  name: string;
  price: string;
  quantity: string;
  trackStock: boolean;
  isDefault: boolean;
};

type FormValues = {
  name: string;
  description: string;
  categoryId: string;
  productionAreaId: string;
  price: string;
  unitCost: string;
  quantity: string;
  options: OptionFormValues[];
};

const defaultOption = (): OptionFormValues => ({
  name: "",
  price: "",
  quantity: "",
  trackStock: false,
  isDefault: false,
});

export const MenuProductSheet = NiceModal.create(
  ({
    mode,
    productId,
    category,
    categories,
    sections,
    initialValues,
  }: MenuProductSheetProps) => {
    const modal = useModal();
    const { productionAreas } = useProductionAreas();
    const { createProduct, updateProduct } = useMenuMutations();

    const {
      register,
      handleSubmit,
      setValue,
      watch,
      reset,
      control,
      formState: { errors },
    } = useForm<FormValues>({
      defaultValues: {
        name: "",
        description: "",
        categoryId: `${category.sectionIndex}-${category.categoryIndex}`,
        productionAreaId: productionAreas[0]?.id.toString() ?? "",
        price: "",
        unitCost: "",
        quantity: "",
        options: [],
      },
    });

    const { fields, append, remove } = useFieldArray({
      control,
      name: "options",
    });

    const categoryId = watch("categoryId");
    const productionAreaId = watch("productionAreaId");

    // Capture props in refs so they don't trigger the reset effect on every render.
    const initialValuesRef = React.useRef(initialValues);
    const productionAreasRef = React.useRef(productionAreas);
    const categoryRef = React.useRef(category);

    React.useEffect(() => {
      if (modal.visible) {
        initialValuesRef.current = initialValues;
        productionAreasRef.current = productionAreas;
        categoryRef.current = category;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modal.visible]);

    // Reset form only when the modal becomes visible.
    React.useEffect(() => {
      if (!modal.visible) return;

      const iv = initialValuesRef.current;
      const pa = productionAreasRef.current;
      const cat = categoryRef.current;

      const opts =
        iv?.options?.map((o) => ({
          name: o.name,
          price: o.price?.toString() ?? "",
          quantity: o.quantity?.toString() ?? "",
          trackStock: o.manageStock ?? false,
          isDefault: o.isDefault ?? false,
        })) ?? [];

      const defaultOptions =
        opts.length > 0
          ? opts
          : [
              {
                name: "Normal",
                price: "",
                quantity: "",
                trackStock: false,
                isDefault: true,
              },
            ];

      reset({
        name: iv?.name ?? "",
        description: iv?.description ?? "",
        categoryId:
          iv?.categoryId ?? `${cat.sectionIndex}-${cat.categoryIndex}`,
        productionAreaId: iv?.productionAreaId ?? pa[0]?.id.toString() ?? "",
        price: iv?.price?.toString() ?? "",
        unitCost: iv?.unitCost?.toString() ?? "",
        quantity: iv?.quantity?.toString() ?? "",
        options: defaultOptions,
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modal.visible, reset]);

    const onSubmit = (values: FormValues) => {
      const [secIdx, catIdx] = values.categoryId
        .split("-")
        .map((v) => Number.parseInt(v, 10));
      const targetSection = sections[secIdx];
      const targetCategory = targetSection?.categories[catIdx];

      const payload = {
        name: values.name.trim(),
        description: values.description?.trim() || "",
        categoryId: targetCategory?.id ?? "",
        hasVariants: values.options.length > 0,
        productionAreaId: values.productionAreaId
          ? Number.parseInt(values.productionAreaId, 10)
          : undefined,
        price: Number.parseFloat(values.price) || 0,
        unitCost: values.unitCost
          ? Number.parseFloat(values.unitCost)
          : undefined,
        quantity: values.quantity
          ? Number.parseInt(values.quantity, 10)
          : undefined,
        productOptions: values.options.map((opt) => ({
          name: opt.name.trim(),
          price: Number.parseFloat(opt.price) || 0,
          quantity: opt.quantity
            ? Number.parseInt(opt.quantity, 10)
            : undefined,
          trackStock: opt.trackStock,
          isDefault: opt.isDefault,
        })),
      };

      if (mode === "create") {
        createProduct.mutateAsync(payload).then(() => {
          modal.hide();
        });
      } else if (mode === "update" && productId) {
        updateProduct.mutateAsync({ id: productId, ...payload }).then(() => {
          modal.hide();
        });
      }
    };

    const isCreate = mode === "create";

    return (
      <Sheet
        open={modal.visible}
        onOpenChange={(open) => {
          if (!open) modal.hide();
        }}
      >
        <SheetContent
          side="right"
          className="w-full sm:max-w-md overflow-y-auto"
        >
          <SheetHeader>
            <SheetTitle>
              {isCreate ? "Nuevo producto" : "Actualizar producto"}
            </SheetTitle>
            <SheetDescription>
              Completa la información para {isCreate ? "crear" : "actualizar"}{" "}
              el producto.
            </SheetDescription>
          </SheetHeader>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col h-full"
          >
            <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-6">
              {/* Información general */}
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-semibold">Información general</h3>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="product-name">
                      Nombre <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      id="product-name"
                      type="text"
                      placeholder="ej. Milanesa de ternera"
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
                    <FieldLabel htmlFor="product-description">
                      Descripción
                    </FieldLabel>
                    <Input
                      id="product-description"
                      type="text"
                      placeholder="Describe brevemente el producto..."
                      {...register("description")}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="product-production-area">
                      Área de producción
                    </FieldLabel>
                    <Select
                      value={productionAreaId}
                      onValueChange={(value) =>
                        setValue("productionAreaId", value)
                      }
                    >
                      <SelectTrigger
                        id="product-production-area"
                        className="w-full"
                      >
                        <SelectValue placeholder="Selecciona un área" />
                      </SelectTrigger>
                      <SelectContent>
                        {productionAreas.map((area) => (
                          <SelectItem key={area.id} value={area.id.toString()}>
                            {area.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="product-category">
                      Categoría
                    </FieldLabel>
                    <Select
                      value={categoryId}
                      onValueChange={(value) => setValue("categoryId", value)}
                    >
                      <SelectTrigger id="product-category" className="w-full">
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((item) => (
                          <SelectItem
                            key={`${item.sectionIndex}-${item.categoryIndex}`}
                            value={`${item.sectionIndex}-${item.categoryIndex}`}
                          >
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </FieldGroup>
              </div>

              {/* <Separator /> */}

              {/* Precio y costo */}
              {/* <div className="flex flex-col gap-3"> */}
              {/*   <h3 className="text-sm font-semibold">Precio y costo</h3> */}
              {/*   <div className="grid grid-cols-3 gap-3"> */}
              {/*     <Field> */}
              {/*       <FieldLabel htmlFor="product-price"> */}
              {/*         Precio de venta */}
              {/*       </FieldLabel> */}
              {/*       <Input */}
              {/*         id="product-price" */}
              {/*         type="number" */}
              {/*         inputMode="decimal" */}
              {/*         step="0.01" */}
              {/*         placeholder="0" */}
              {/*         {...register("price")} */}
              {/*       /> */}
              {/*     </Field> */}
              {/*     <Field> */}
              {/*       <FieldLabel htmlFor="product-unit-cost"> */}
              {/*         Costo unitario */}
              {/*       </FieldLabel> */}
              {/*       <Input */}
              {/*         id="product-unit-cost" */}
              {/*         type="number" */}
              {/*         inputMode="decimal" */}
              {/*         step="0.01" */}
              {/*         placeholder="0" */}
              {/*         {...register("unitCost")} */}
              {/*       /> */}
              {/*     </Field> */}
              {/*     <Field> */}
              {/*       <FieldLabel htmlFor="product-quantity">Stock</FieldLabel> */}
              {/*       <Input */}
              {/*         id="product-quantity" */}
              {/*         type="number" */}
              {/*         inputMode="numeric" */}
              {/*         placeholder="0" */}
              {/*         {...register("quantity")} */}
              {/*       /> */}
              {/*     </Field> */}
              {/*   </div> */}
              {/* </div> */}

              <Separator />

              {/* Variantes / Opciones */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">
                    Variantes / Opciones
                  </h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append(defaultOption())}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Agregar variante
                  </Button>
                </div>

                {fields.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-border/60 px-4 py-6 text-sm text-muted-foreground text-center">
                    No hay variantes. Agrega una para comenzar.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[140px]">Nombre</TableHead>
                        <TableHead className="min-w-[100px]">Precio</TableHead>
                        <TableHead className="min-w-[100px]">Stock</TableHead>
                        <TableHead className="w-[70px]">Inventario</TableHead>
                        <TableHead className="w-[60px]">Default</TableHead>
                        <TableHead className="w-[40px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fields.map((field, index) => (
                        <TableRow key={field.id}>
                          <TableCell>
                            <Input
                              type="text"
                              placeholder="Nombre"
                              className="h-8 text-xs"
                              {...register(`options.${index}.name`, {
                                required: "Requerido",
                              })}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              inputMode="decimal"
                              step="0.01"
                              placeholder="0"
                              className="h-8 text-xs"
                              {...register(`options.${index}.price`, {
                                required: "Requerido",
                              })}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              inputMode="numeric"
                              min={0}
                              placeholder="0"
                              className="h-8 text-xs"
                              {...register(`options.${index}.quantity`)}
                            />
                          </TableCell>
                          <TableCell>
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
                          </TableCell>
                          <TableCell>
                            <Controller
                              control={control}
                              name={`options.${index}.isDefault`}
                              render={({ field: radioField }) => (
                                <input
                                  type="radio"
                                  name="defaultOption"
                                  className="h-4 w-4 accent-primary cursor-pointer"
                                  checked={radioField.value}
                                  onChange={() => {
                                    fields.forEach((_, idx) => {
                                      setValue(
                                        `options.${idx}.isDefault`,
                                        idx === index,
                                        { shouldValidate: false },
                                      );
                                    });
                                  }}
                                />
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => remove(index)}
                              disabled={fields.length === 1}
                            >
                              <Trash2 className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </div>
            <SheetFooter>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => modal.hide()}
              >
                Cancelar
              </Button>
              <Button type="submit" className="w-full">
                {isCreate ? "Crear producto" : "Guardar cambios"}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    );
  },
);
