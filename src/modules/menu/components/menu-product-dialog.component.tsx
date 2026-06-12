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
import { useProductionAreas } from "@/modules/production-areas/hooks/useProductionAreas";

export type MenuCategoryWithIndex = {
  name: string;
  sectionIndex: number;
  categoryIndex: number;
};

type FormValues = {
  name: string;
  description?: string;
  categoryId: string;
  productionAreaId: string;
};

type Props = {
  title: string;
  submitLabel: string;
  category: MenuCategoryWithIndex;
  categories: MenuCategoryWithIndex[];
  initialValues?: Partial<FormValues>;
  onSubmit: (values: FormValues) => void;
};

export const MenuProductDialog = NiceModal.create(
  ({
    title,
    submitLabel,
    category,
    categories,
    initialValues,
    onSubmit,
  }: Props) => {
    const modal = useModal();
    const { productionAreas } = useProductionAreas();
    const {
      register,
      handleSubmit,
      setValue,
      watch,
      reset,
      formState: { errors },
    } = useForm<FormValues>({
      defaultValues: {
        name: "",
        description: "",
        categoryId: `${category.sectionIndex}-${category.categoryIndex}`,
        productionAreaId: productionAreas[0]?.id.toString() ?? "",
        ...initialValues,
      },
    });

    const categoryId = watch("categoryId");
    const productionAreaId = watch("productionAreaId");

    React.useEffect(() => {
      if (!modal.visible) {
        return;
      }
      reset({
        name: initialValues?.name ?? "",
        description: initialValues?.description ?? "",
        categoryId:
          initialValues?.categoryId ??
          `${category.sectionIndex}-${category.categoryIndex}`,
        productionAreaId:
          initialValues?.productionAreaId ??
          productionAreas[0]?.id.toString() ??
          "",
      });
    }, [
      category.categoryIndex,
      category.sectionIndex,
      initialValues?.categoryId,
      initialValues?.description,
      initialValues?.name,
      initialValues?.productionAreaId,
      modal.visible,
      productionAreas,
      reset,
    ]);

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
              Registra un producto para la categoria "{category.name}".
            </DialogDescription>
          </DialogHeader>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit((values) => {
              onSubmit({
                ...values,
                name: values.name.trim(),
                description: values.description?.trim() || "",
              });
              modal.hide();
            })}
          >
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
              <Field>
                <FieldLabel htmlFor="product-production-area">
                  Area de produccion
                </FieldLabel>
                <Select
                  value={productionAreaId}
                  onValueChange={(value) => setValue("productionAreaId", value)}
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
              <Button type="submit">{submitLabel}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  },
);
