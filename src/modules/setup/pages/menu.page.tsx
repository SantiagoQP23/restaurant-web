import * as React from "react";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { Link } from "@tanstack/react-router";
import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import type {
  CreateMenuSectionDto,
  CreateSectionCategoryDto,
} from "@/modules/menu/interface/dto/create-menu.dto";
import { useSetupStore } from "@/shared/store/setup.store";

type CategoryModalProps = {
  title: string;
  submitLabel: string;
  sectionName: string;
  initialValues?: Pick<CreateSectionCategoryDto, "name">;
  onSubmit: (name: string) => void;
};

const CategoryModal = NiceModal.create(
  ({
    title,
    submitLabel,
    sectionName,
    initialValues,
    onSubmit,
  }: CategoryModalProps) => {
    const modal = useModal();
    const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm<{ name: string }>({
      defaultValues: {
        name: "",
      },
    });

    React.useEffect(() => {
      if (!modal.visible) {
        return;
      }
      reset({
        name: initialValues?.name ?? "",
      });
    }, [initialValues?.name, modal.visible, reset]);

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
              Agrega una categoria para la seccion "{sectionName}".
            </DialogDescription>
          </DialogHeader>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit((values) => {
              onSubmit(values.name.trim());
              modal.hide();
            })}
          >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="category-name">Nombre</FieldLabel>
                <Input
                  id="category-name"
                  type="text"
                  placeholder="Platos especiales"
                  aria-invalid={Boolean(errors.name)}
                  {...register("name", {
                    required: "El nombre es obligatorio.",
                  })}
                />
                {errors.name?.message && (
                  <FieldDescription>{errors.name.message}</FieldDescription>
                )}
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

type SectionModalProps = {
  title: string;
  submitLabel: string;
  initialValues?: Pick<CreateMenuSectionDto, "name">;
  onSubmit: (name: string) => void;
};

const SectionModal = NiceModal.create(
  ({ title, submitLabel, initialValues, onSubmit }: SectionModalProps) => {
    const modal = useModal();
    const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm<{ name: string }>({
      defaultValues: {
        name: "",
      },
    });

    React.useEffect(() => {
      if (!modal.visible) {
        return;
      }
      reset({
        name: initialValues?.name ?? "",
      });
    }, [initialValues?.name, modal.visible, reset]);

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
              Crea una seccion para agrupar las categorias del menu.
            </DialogDescription>
          </DialogHeader>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit((values) => {
              onSubmit(values.name.trim());
              modal.hide();
            })}
          >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="section-name">Nombre</FieldLabel>
                <Input
                  id="section-name"
                  type="text"
                  placeholder="Especialidades"
                  aria-invalid={Boolean(errors.name)}
                  {...register("name", {
                    required: "El nombre es obligatorio.",
                  })}
                />
                {errors.name?.message && (
                  <FieldDescription>{errors.name.message}</FieldDescription>
                )}
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

export const MenuPage = () => {
  const menu = useSetupStore((state) => state.menu);
  const addMenuSection = useSetupStore((state) => state.addMenuSection);
  const updateMenuSection = useSetupStore((state) => state.updateMenuSection);
  const removeMenuSection = useSetupStore((state) => state.removeMenuSection);
  const addMenuCategory = useSetupStore((state) => state.addMenuCategory);
  const updateMenuCategory = useSetupStore((state) => state.updateMenuCategory);
  const removeMenuCategory = useSetupStore((state) => state.removeMenuCategory);

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
            <Button
              type="button"
              onClick={() =>
                NiceModal.show(SectionModal, {
                  title: "Nueva seccion",
                  submitLabel: "Guardar",
                  onSubmit: addMenuSection,
                })
              }
            >
              <Plus />
              Agregar seccion
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-8">
          {menu.sections.map((section, sectionIndex) => (
            <section
              key={`${section.name}-${sectionIndex}`}
              className="flex flex-col gap-4"
            >
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
                    variant="ghost"
                    size="icon"
                    aria-label={`Editar seccion ${section.name}`}
                    onClick={() =>
                      NiceModal.show(SectionModal, {
                        title: "Editar seccion",
                        submitLabel: "Guardar cambios",
                        initialValues: { name: section.name },
                        onSubmit: (name) =>
                          updateMenuSection(sectionIndex, name),
                      })
                    }
                  >
                    <Pencil />
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
                        <AlertDialogAction
                          variant="destructive"
                          onClick={() => removeMenuSection(sectionIndex)}
                        >
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              <div className="rounded-3xl border border-border/60 bg-card">
                {section.categories.length === 0 ? (
                  <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                    No hay categorias por ahora.
                  </div>
                ) : (
                  <ul className="divide-y divide-border/60">
                    {section.categories.map((category, categoryIndex) => (
                      <li
                        key={`${category.name}-${categoryIndex}`}
                        className="flex items-center justify-between gap-4 px-4 py-2"
                      >
                        <div>
                          <div className="text-sm font-medium">
                            {category.name}
                          </div>
                        </div>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              aria-label={`Acciones para ${category.name}`}
                            >
                              <MoreHorizontal />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-48 p-2">
                            <div className="flex flex-col gap-1">
                              <Button
                                type="button"
                                variant="ghost"
                                className="justify-start"
                                onClick={() =>
                                  NiceModal.show(CategoryModal, {
                                    title: "Editar categoria",
                                    submitLabel: "Guardar cambios",
                                    sectionName: section.name,
                                    initialValues: { name: category.name },
                                    onSubmit: (name) =>
                                      updateMenuCategory(
                                        sectionIndex,
                                        categoryIndex,
                                        name,
                                      ),
                                  })
                                }
                              >
                                <Pencil />
                                Editar
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    className="justify-start text-destructive"
                                  >
                                    <Trash2 />
                                    Eliminar
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
                                    <AlertDialogCancel>
                                      Cancelar
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      variant="destructive"
                                      onClick={() =>
                                        removeMenuCategory(
                                          sectionIndex,
                                          categoryIndex,
                                        )
                                      }
                                    >
                                      Eliminar
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="flex justify">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    NiceModal.show(CategoryModal, {
                      title: "Nueva categoria",
                      submitLabel: "Guardar",
                      sectionName: section.name,
                      onSubmit: (name) => addMenuCategory(sectionIndex, name),
                    })
                  }
                >
                  <Plus />
                  Agregar categoria
                </Button>
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
