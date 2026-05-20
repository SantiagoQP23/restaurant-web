import * as React from "react";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Checkbox } from "@/shared/components/ui/checkbox";
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
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import type { ProductionArea } from "@/shared/models/production-area.model";
import { SetupStepper } from "../components/setup-stepper.component";
import { useSetupStore } from "@/shared/store/setup.store";
import type { CreateSectionCategoryDto } from "@/modules/menu/interface/dto/create-menu.dto";

const productionAreas: ProductionArea[] = [
  {
    id: 1,
    name: "Cocina",
    description: "Preparacion principal de platos calientes.",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    name: "Bar",
    description: "Cocteles, bebidas frias y cafe.",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    name: "Postres",
    description: "Pasteleria y emplatado de dulces.",
    isActive: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

type CategoryWithIndex = CreateSectionCategoryDto & {
  sectionIndex: number;
  categoryIndex: number;
};

type ProductOptionFormValues = {
  options: {
    name: string;
    price: string;
    trackStock: boolean;
    quantity?: string;
  }[];
};

const AddProductOptionsModal = NiceModal.create(
  ({ productName }: { productName: string }) => {
    const modal = useModal();
    const {
      control,
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<ProductOptionFormValues>({
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

    const onSubmit = (values: ProductOptionFormValues) => {
      void values;
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
        <DialogContent className="max-h-[90svh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Opciones del producto</DialogTitle>
            <DialogDescription>
              Configura las opciones para "{productName || "Nuevo producto"}".
            </DialogDescription>
          </DialogHeader>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
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

const AddProductModal = NiceModal.create(
  ({ category }: { category: CategoryWithIndex }) => {
    const modal = useModal();
    const {
      register,
      handleSubmit,
      setValue,
      watch,
      formState: { errors },
    } = useForm<{
      name: string;
      description?: string;
      categoryId: string;
      productionAreaId: string;
    }>({
      defaultValues: {
        name: "",
        description: "",
        categoryId: `${category.sectionIndex}-${category.categoryIndex}`,
        productionAreaId: productionAreas[0]?.id.toString() ?? "",
      },
    });

    const categoryId = watch("categoryId");
    const productionAreaId = watch("productionAreaId");

    const addMenuProduct = useSetupStore((state) => state.addMenuProduct);
    const menu = useSetupStore((state) => state.menu);

    const onSubmit = (values: {
      name: string;
      description?: string;
      categoryId: string;
      productionAreaId: string;
    }) => {
      const [sectionIndex, categoryIndex] = values.categoryId
        .split("-")
        .map((value) => Number.parseInt(value, 10));
      addMenuProduct(sectionIndex, categoryIndex, {
        name: values.name.trim(),
        description: values.description?.trim() || undefined,
      });
      modal.hide();
      NiceModal.show(AddProductOptionsModal, { productName: values.name });
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
            <DialogTitle>Nuevo producto</DialogTitle>
            <DialogDescription>
              Registra un producto para la categoria "{category.name}".
            </DialogDescription>
          </DialogHeader>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="product-name">Nombre</FieldLabel>
                <Input
                  id="product-name"
                  type="text"
                  placeholder="Tallarines especiales"
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
                  Descripcion
                </FieldLabel>
                <Input
                  id="product-description"
                  type="text"
                  placeholder="Pasta fresca con salsa de la casa."
                  {...register("description")}
                />
                <FieldDescription>
                  Describe los ingredientes principales o notas especiales.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="product-category">Categoria</FieldLabel>
                <Select
                  value={categoryId}
                  onValueChange={(value) => setValue("categoryId", value)}
                >
                  <SelectTrigger id="product-category" className="w-full">
                    <SelectValue placeholder="Selecciona una categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {menu.sections.flatMap((section, sectionIndex) =>
                      section.categories.map((item, categoryIndex) => (
                        <SelectItem
                          key={`${sectionIndex}-${categoryIndex}`}
                          value={`${sectionIndex}-${categoryIndex}`}
                        >
                          {section.name} · {item.name}
                        </SelectItem>
                      )),
                    )}
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="product-production-area">
                  Area de produccion
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
                    <SelectValue placeholder="Selecciona un area" />
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

export const ProductsPage = () => {
  const menu = useSetupStore((state) => state.menu);
  const allProducts = menu.sections.flatMap((section, sectionIndex) =>
    section.categories.flatMap((category, categoryIndex) =>
      category.products.map((product, productIndex) => ({
        id: `${sectionIndex}-${categoryIndex}-${productIndex}`,
        name: product.name,
        description: product.description,
        sectionName: section.name,
        categoryName: category.name,
        category: {
          ...category,
          sectionIndex,
          categoryIndex,
        },
      })),
    ),
  );

  return (
    <div className="flex min-h-svh flex-col p-6 md:p-10">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-bold">Productos</h1>
          <p className="text-sm text-muted-foreground">
            Agrega productos dentro de cada categoria.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Productos</h2>
              <span className="text-sm text-muted-foreground">
                {allProducts.length} productos
              </span>
            </div>
            {allProducts.length === 0 ? (
              <div className="rounded-3xl border border-dashed px-4 py-10 text-center text-sm text-muted-foreground">
                No hay productos registrados.
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {allProducts.map((product) => (
                  <Card key={product.id} size="sm">
                    <CardHeader>
                      <CardTitle>{product.name}</CardTitle>
                      <CardDescription>
                        {product.categoryName} · {product.sectionName}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                      <p className="text-sm text-muted-foreground">
                        {product.description || "Sin descripcion."}
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          NiceModal.show(AddProductModal, {
                            category: product.category,
                          })
                        }
                      >
                        <Plus />
                        Agregar producto
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>
          <aside className="flex flex-col gap-4">
            <div>
              <h2 className="text-lg font-semibold">Secciones</h2>
              <p className="text-sm text-muted-foreground">
                {menu.sections.length} secciones
              </p>
            </div>
            <div className="rounded-3xl border border-border/60 bg-card">
              {menu.sections.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                  No hay secciones creadas.
                </div>
              ) : (
                <div className="flex flex-col divide-y divide-border/60">
                  {menu.sections.map((section, sectionIndex) => (
                    <div key={`${section.name}-${sectionIndex}`} className="px-4 py-3">
                      <div className="text-sm font-medium">{section.name}</div>
                      <div className="mt-2 flex flex-col gap-2">
                        {section.categories.length === 0 ? (
                          <div className="text-xs text-muted-foreground">
                            Sin categorias
                          </div>
                        ) : (
                          section.categories.map((category, categoryIndex) => (
                            <div
                              key={`${category.name}-${categoryIndex}`}
                              className="rounded-2xl border border-border/60 px-3 py-2 text-xs"
                            >
                              <div className="font-medium">{category.name}</div>
                              <div className="text-muted-foreground">
                                {category.products.length} productos
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="mt-2 h-7 px-2"
                                onClick={() =>
                                  NiceModal.show(AddProductModal, {
                                    category: {
                                      ...category,
                                      sectionIndex,
                                      categoryIndex,
                                    },
                                  })
                                }
                              >
                                <Plus />
                                Agregar producto
                              </Button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
        <SetupStepper className="mt-auto pt-6" />
      </div>
    </div>
  );
};
