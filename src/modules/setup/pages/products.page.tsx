import * as React from "react";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
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
import type { Category } from "@/shared/models/category.model";
import type { ProductionArea } from "@/shared/models/production-area.model";
import type { Section } from "@/shared/models/section.model";
import { SetupStepper } from "../components/setup-stepper.component";

const menuSections: Section[] = [
  {
    id: "sec-entradas",
    name: "Entradas",
    order: 1,
    isActive: true,
    categories: [
      { id: "cat-frio", name: "Frios", isActive: true, isPublic: true },
      { id: "cat-caliente", name: "Calientes", isActive: true, isPublic: true },
    ],
  },
  {
    id: "sec-platos",
    name: "Platos fuertes",
    order: 2,
    isActive: true,
    categories: [
      { id: "cat-carnes", name: "Carnes", isActive: true, isPublic: true },
      { id: "cat-pastas", name: "Pastas", isActive: false, isPublic: true },
      {
        id: "cat-veggie",
        name: "Vegetarianos",
        isActive: true,
        isPublic: false,
      },
    ],
  },
  {
    id: "sec-bebidas",
    name: "Bebidas",
    order: 3,
    isActive: true,
    categories: [
      { id: "cat-frias", name: "Frias", isActive: true, isPublic: true },
      {
        id: "cat-calientes",
        name: "Calientes",
        isActive: true,
        isPublic: true,
      },
    ],
  },
];

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

const productsByCategory: Record<string, { id: string; name: string }[]> = {
  "cat-frio": [
    { id: "prod-ceviche", name: "Ceviche de camaron" },
    { id: "prod-ensalada", name: "Ensalada fresca" },
  ],
  "cat-caliente": [{ id: "prod-sopa", name: "Sopa del dia" }],
  "cat-carnes": [
    { id: "prod-lomo", name: "Lomo a la parrilla" },
    { id: "prod-bife", name: "Bife de chorizo" },
  ],
  "cat-pastas": [{ id: "prod-lasagna", name: "Lasaña de la casa" }],
  "cat-veggie": [{ id: "prod-bowl", name: "Bowl vegetariano" }],
  "cat-frias": [
    { id: "prod-limonada", name: "Limonada" },
    { id: "prod-te-helado", name: "Te helado" },
  ],
};

const AddProductOptionsModal = NiceModal.create(
  ({ productName }: { productName: string }) => {
    const modal = useModal();
    const [name, setName] = React.useState("");
    const [price, setPrice] = React.useState("");
    const [manageInventory, setManageInventory] = React.useState(false);
    const [startQuantity, setStartQuantity] = React.useState("");

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
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
            <DialogTitle>Opciones del producto</DialogTitle>
            <DialogDescription>
              Configura las opciones para "{productName || "Nuevo producto"}".
            </DialogDescription>
          </DialogHeader>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="product-option-name">Nombre</FieldLabel>
                <Input
                  id="product-option-name"
                  type="text"
                  placeholder="Porcion personal"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="product-option-price">Precio</FieldLabel>
                <Input
                  id="product-option-price"
                  type="number"
                  inputMode="decimal"
                  placeholder="12.00"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  required
                />
                <FieldDescription>
                  Indica el precio final para esta opcion.
                </FieldDescription>
              </Field>
              <Field>
                <div className="flex items-center gap-2">
                  <input
                    id="product-option-inventory"
                    type="checkbox"
                    className="size-4"
                    checked={manageInventory}
                    onChange={(event) =>
                      setManageInventory(event.target.checked)
                    }
                  />
                  <FieldLabel htmlFor="product-option-inventory">
                    Gestionar inventario
                  </FieldLabel>
                </div>
              </Field>
              {manageInventory && (
                <Field>
                  <FieldLabel htmlFor="product-option-quantity">
                    Cantidad inicial
                  </FieldLabel>
                  <Input
                    id="product-option-quantity"
                    type="number"
                    inputMode="numeric"
                    placeholder="25"
                    value={startQuantity}
                    onChange={(event) => setStartQuantity(event.target.value)}
                    required
                  />
                </Field>
              )}
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
  ({ category }: { category: Category }) => {
    const modal = useModal();
    const [name, setName] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [categoryId, setCategoryId] = React.useState(category.id);
    const [productionAreaId, setProductionAreaId] = React.useState<string>(
      productionAreas[0]?.id.toString() ?? "",
    );

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      modal.hide();
      NiceModal.show(AddProductOptionsModal, { productName: name });
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
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="product-name">Nombre</FieldLabel>
                <Input
                  id="product-name"
                  type="text"
                  placeholder="Tallarines especiales"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="product-description">
                  Descripcion
                </FieldLabel>
                <Input
                  id="product-description"
                  type="text"
                  placeholder="Pasta fresca con salsa de la casa."
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  required
                />
                <FieldDescription>
                  Describe los ingredientes principales o notas especiales.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="product-category">Categoria</FieldLabel>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger id="product-category" className="w-full">
                    <SelectValue placeholder="Selecciona una categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {menuSections.flatMap((section) =>
                      section.categories.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
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
                  onValueChange={setProductionAreaId}
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

const statusBadgeClass = (category: Category) => {
  if (!category.isActive) {
    return "rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground";
  }

  return "rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700";
};

const visibilityBadgeClass = (category: Category) => {
  if (!category.isPublic) {
    return "rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700";
  }

  return "rounded-full bg-sky-100 px-2 py-1 text-xs font-medium text-sky-700";
};

export const ProductsPage = () => {
  return (
    <div className="flex min-h-svh flex-col p-6 md:p-10">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-bold">Productos</h1>
          <p className="text-sm text-muted-foreground">
            Agrega productos dentro de cada categoria.
          </p>
        </div>
        <div className="flex flex-col gap-8">
          {menuSections.map((section) => (
            <section key={section.id} className="flex flex-col gap-4">
              <div>
                <h2 className="text-lg font-semibold">{section.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {section.categories.length} categorias
                </p>
              </div>
              <div className="flex flex-col gap-3">
                {section.categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex flex-col gap-3 rounded-4xl border border-border/60 bg-card px-4 py-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium">
                          {category.name}
                        </span>
                        <span className={statusBadgeClass(category)}>
                          {category.isActive ? "Activo" : "Inactivo"}
                        </span>
                        <span className={visibilityBadgeClass(category)}>
                          {category.isPublic ? "Publico" : "Privado"}
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          NiceModal.show(AddProductModal, { category })
                        }
                      >
                        <Plus />
                        Agregar producto
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(productsByCategory[category.id] ?? []).length === 0 ? (
                        <span className="text-sm text-muted-foreground">
                          Sin productos por ahora.
                        </span>
                      ) : (
                        productsByCategory[category.id].map((product) => (
                          <span
                            key={product.id}
                            className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                          >
                            {product.name}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
        <SetupStepper className="mt-auto pt-6" />
      </div>
    </div>
  );
};
