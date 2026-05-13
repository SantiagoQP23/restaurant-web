import * as React from "react";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { Link } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { SetupStepper } from "../components/setup-stepper.component";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
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
import type { Category } from "@/shared/models/category.model";
import type { Section } from "@/shared/models/section.model";

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

const categoryStatusClass = (category: Category) => {
  if (!category.isActive) {
    return "rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground";
  }

  return "rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700";
};

const categoryVisibilityClass = (category: Category) => {
  if (!category.isPublic) {
    return "rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700";
  }

  return "rounded-full bg-sky-100 px-2 py-1 text-xs font-medium text-sky-700";
};

const AddCategoryModal = NiceModal.create(
  ({ sectionName }: { sectionName: string }) => {
    const modal = useModal();
    const [name, setName] = React.useState("");
    const [description, setDescription] = React.useState("");

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
            <DialogTitle>Nueva categoria</DialogTitle>
            <DialogDescription>
              Agrega una categoria para la seccion "{sectionName}".
            </DialogDescription>
          </DialogHeader>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="category-name">Nombre</FieldLabel>
                <Input
                  id="category-name"
                  type="text"
                  placeholder="Platos especiales"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="category-description">
                  Descripcion
                </FieldLabel>
                <Input
                  id="category-description"
                  type="text"
                  placeholder="Productos destacados de temporada."
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  required
                />
                <FieldDescription>
                  Resume el contenido o tipo de productos.
                </FieldDescription>
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

const AddSectionModal = NiceModal.create(() => {
  const modal = useModal();
  const [name, setName] = React.useState("");

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
          <DialogTitle>Nueva seccion</DialogTitle>
          <DialogDescription>
            Crea una seccion para agrupar las categorias del menu.
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="section-name">Nombre</FieldLabel>
              <Input
                id="section-name"
                type="text"
                placeholder="Especialidades"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
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
});

export const MenuPage = () => {
  return (
    <div className="flex min-h-svh flex-col p-6 md:p-10">
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Menu</h1>
            <p className="text-sm text-muted-foreground">
              Organiza las secciones y categorias del menu.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline">
              Agregar categoria
            </Button>
            <Button
              type="button"
              onClick={() => NiceModal.show(AddSectionModal)}
            >
              Agregar seccion
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-8">
          {menuSections.map((section) => (
            <section key={section.id} className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">{section.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {section.categories.length} categorias
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    aria-label={`Agregar categoria a ${section.name}`}
                    onClick={() =>
                      NiceModal.show(AddCategoryModal, {
                        sectionName: section.name,
                      })
                    }
                  >
                    <Plus />
                  </Button>
                  {/* <span */}
                  {/*   className={ */}
                  {/*     section.isActive */}
                  {/*       ? "rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700" */}
                  {/*       : "rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground" */}
                  {/*   } */}
                  {/* > */}
                  {/*   {section.isActive ? "Activo" : "Inactivo"} */}
                  {/* </span> */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`Eliminar seccion ${section.name}`}
                      >
                        <Trash2 />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Eliminar seccion</AlertDialogTitle>
                        <AlertDialogDescription>
                          Estas a punto de eliminar la seccion "{section.name}"
                          y sus categorias. Esta accion no se puede deshacer.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction variant="destructive">
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {section.categories.map((category) => (
                  <Card key={category.id} size="sm">
                    <CardHeader>
                      <CardTitle>{category.name}</CardTitle>
                      <CardDescription>
                        {category.isPublic
                          ? "Visible para los clientes"
                          : "Solo uso interno"}
                      </CardDescription>
                      <CardAction>
                        <div className="flex items-center gap-2">
                          {/* <span className={categoryStatusClass(category)}> */}
                          {/*   {category.isActive ? "Activo" : "Inactivo"} */}
                          {/* </span> */}
                          {/* <span className={categoryVisibilityClass(category)}> */}
                          {/*   {category.isPublic ? "Publico" : "Privado"} */}
                          {/* </span> */}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                aria-label={`Eliminar categoria ${category.name}`}
                              >
                                <Trash2 />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Eliminar categoria
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Estas a punto de eliminar la categoria "
                                  {category.name}". Esta accion no se puede
                                  deshacer.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction variant="destructive">
                                  Eliminar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </CardAction>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>
        <div className="flex justify-end">
          <Button asChild>
            <Link to="/setup/products">Guardar y continuar</Link>
          </Button>
        </div>
      </div>
      <SetupStepper className="mt-auto pt-6" />
    </div>
  );
};
