import * as React from "react";
import NiceModal from "@ebay/nice-modal-react";
import { Link } from "@tanstack/react-router";
import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { useSetupStore } from "@/shared/store/setup.store";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { ProductsService } from "@/modules/menu/services/products.service";
import { queryKeys } from "@/app/api/query-client";
import type { Product } from "@/shared/models/product.model";

type MenuProduct = Product & {
  categoryId?: string;
  category?: { id: string; name: string };
};
import { MenuCategoryDialog } from "@/modules/menu/components/menu-category-dialog.component";
import { MenuSectionDialog } from "@/modules/menu/components/menu-section-dialog.component";

export const MenuPage = () => {
  const menu = useSetupStore((state) => state.menu);
  const { restaurant } = useAuthStore();
  const addMenuSection = useSetupStore((state) => state.addMenuSection);
  const updateMenuSection = useSetupStore((state) => state.updateMenuSection);
  const removeMenuSection = useSetupStore((state) => state.removeMenuSection);
  const addMenuCategory = useSetupStore((state) => state.addMenuCategory);
  const updateMenuCategory = useSetupStore((state) => state.updateMenuCategory);
  const removeMenuCategory = useSetupStore((state) => state.removeMenuCategory);

  const productsQuery = useQuery<MenuProduct[]>({
    queryKey: [queryKeys.menu.detail(restaurant!.id), "products"],
    queryFn: () => ProductsService.getAll(restaurant!.id),
    enabled: Boolean(restaurant?.id),
  });

  const productsByCategory = React.useMemo(() => {
    const byId = new Map<string, MenuProduct[]>();
    const byName = new Map<string, MenuProduct[]>();
    (productsQuery.data ?? []).forEach((product) => {
      if (product.categoryId) {
        const current = byId.get(product.categoryId) ?? [];
        byId.set(product.categoryId, [...current, product]);
      }
      const categoryName = product.category?.name?.trim();
      if (categoryName) {
        const key = categoryName.toLowerCase();
        const current = byName.get(key) ?? [];
        byName.set(key, [...current, product]);
      }
    });
    return { byId, byName };
  }, [productsQuery.data]);

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
                NiceModal.show(MenuSectionDialog, {
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
                      NiceModal.show(MenuSectionDialog, {
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
                     {section.categories.map((category, categoryIndex) => {
                       const categoryId = (category as { id?: string }).id;
                       const products = categoryId
                         ? productsByCategory.byId.get(categoryId) ?? []
                         : productsByCategory.byName.get(
                             category.name.toLowerCase(),
                           ) ?? [];
                       return (
                       <li
                         key={`${category.name}-${categoryIndex}`}
                         className="flex items-center justify-between gap-4 px-4 py-2"
                       >
                         <div>
                           <div className="text-sm font-medium">
                             {category.name}
                           </div>
                           <div className="mt-1 text-xs text-muted-foreground">
                             {productsQuery.isLoading
                               ? "Cargando productos..."
                               : products.length === 0
                                 ? "Sin productos"
                                 : products.map((product) => product.name).join(" · ")}
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
                                  NiceModal.show(MenuCategoryDialog, {
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
                     );
                     })}
                  </ul>
                )}
              </div>
              <div className="flex justify">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    NiceModal.show(MenuCategoryDialog, {
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
