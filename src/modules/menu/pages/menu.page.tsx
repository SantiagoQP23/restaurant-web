import * as React from "react";
import NiceModal from "@ebay/nice-modal-react";
import { useQuery } from "@tanstack/react-query";
import type { Section } from "@/shared/models/section.model";
import type { Category } from "@/shared/models/category.model";
import type { Product } from "@/shared/models/product.model";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { MoreVertical, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/components/ui/collapsible";
import { MenuSectionDialog } from "@/modules/menu/components/menu-section-dialog.component";
import { MenuCategoryDialog } from "@/modules/menu/components/menu-category-dialog.component";
import {
  MenuProductDialog,
  type MenuCategoryWithIndex,
} from "@/modules/menu/components/menu-product-dialog.component";
import { MenuProductCard } from "@/modules/menu/components/menu-product-card.component";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { ProductsService } from "@/modules/menu/services/products.service";
import { queryKeys } from "@/app/api/query-client";
import { useMenu } from "../hooks/useMenu";
import { MenuProductOptionsDialog } from "../components/menu-product-options-dialog.component";

type MenuCategory = Category & { products: Product[] };
type MenuSection = Section & { categories: MenuCategory[] };
type MenuProduct = Product & {
  categoryId?: string;
  category?: { id: string; name: string };
};

export const MenuPage = () => {
  const {
    sections: fetchedSections,
    createSection,
    updateSection,
    createCategory,
    updateCategory,
    deleteCategory,
    updateProduct,
  } = useMenu();
  const { restaurant } = useAuthStore();
  const [sections, setSections] = React.useState<MenuSection[]>([]);
  const [selectedSectionId, setSelectedSectionId] = React.useState<
    string | null
  >(null);

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

  const selectedSectionIndex = React.useMemo(
    () => sections.findIndex((section) => section.id === selectedSectionId),
    [sections, selectedSectionId],
  );
  const selectedSection =
    selectedSectionIndex >= 0 ? sections[selectedSectionIndex] : undefined;

  React.useEffect(() => {
    if (fetchedSections) {
      setSections(
        fetchedSections.map((section) => ({
          ...section,
          categories: section.categories ?? [],
        })) as MenuSection[],
      );
    }
  }, [fetchedSections]);

  React.useEffect(() => {
    if (!selectedSectionId && sections.length > 0) {
      setSelectedSectionId(sections[0]?.id ?? null);
    }
  }, [sections, selectedSectionId]);

  const handleAddOption = () => undefined;

  const handleDeleteProduct = () => undefined;

  const handleUpdateOption = () => undefined;

  const handleDeleteOption = () => undefined;

  const handleUpdateSection = (sectionId: string, name: string) => {
    updateSection.mutate({ id: sectionId, name });
  };

  const handleDeleteSection = (sectionId: string) => {
    setSections((current) =>
      current.filter((section) => section.id !== sectionId),
    );
    setSelectedSectionId((current) => (current === sectionId ? null : current));
  };

  const handleUpdateCategory = (
    sectionId: string,
    categoryId: string,
    name: string,
  ) => {
    updateCategory.mutate({ id: categoryId, name, sectionId });
  };

  const handleDeleteCategory = (categoryId: string) => {
    deleteCategory.mutate(categoryId);
  };

  return (
    <div className="flex min-h-svh flex-col gap-6 p-6 md:p-10">
      <div>
        <h1 className="text-2xl font-bold">Menu</h1>
        <p className="text-sm text-muted-foreground">
          Organiza tus secciones, categorias y productos del menu.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-3xl border border-border/60 bg-card/60 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold uppercase text-muted-foreground">
              Secciones
            </div>

            <Button
              type="button"
              onClick={() =>
                NiceModal.show(MenuSectionDialog, {
                  title: "Nueva seccion",
                  submitLabel: "Guardar",
                  onSubmit: (name) => createSection.mutate({ name }),
                })
              }
              variant="ghost"
            >
              <Plus />
            </Button>
          </div>
          <div className="mt-3 flex flex-col gap-1">
            {sections.map((section) => {
              const isActive = section.id === selectedSectionId;
              return (
                <div
                  key={section.id}
                  onClick={() => setSelectedSectionId(section.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelectedSectionId(section.id);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  className={cn(
                    "flex items-center justify-between gap-2 rounded-2xl px-3 py-2 text-left text-sm transition",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                  )}
                >
                  <span className="font-medium">{section.name}</span>
                  <div className="flex items-center gap-2">
                    {/* <span className="text-xs text-muted-foreground"> */}
                    {/*   {section.categories.length} categorias */}
                    {/* </span> */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          aria-label={`Opciones para ${section.name}`}
                          onClick={(event) => event.stopPropagation()}
                          onKeyDown={(event) => event.stopPropagation()}
                        >
                          <MoreVertical />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(event) => {
                            event.stopPropagation();
                            NiceModal.show(MenuSectionDialog, {
                              title: "Actualizar seccion",
                              submitLabel: "Guardar cambios",
                              initialValues: { name: section.name },
                              onSubmit: (name) =>
                                handleUpdateSection(section.id, name),
                            });
                          }}
                        >
                          Actualizar
                        </DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={(event) => event.stopPropagation()}
                            >
                              Eliminar
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Eliminar seccion
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Estas a punto de eliminar la seccion "
                                {section.name}" y sus categorias. Esta accion no
                                se puede deshacer.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                variant="destructive"
                                onClick={() => handleDeleteSection(section.id)}
                              >
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>
        <section className="flex flex-col gap-8">
          {selectedSection ? (
            <>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">
                    Categorías de {selectedSection.name}
                  </h2>
                  {/* <p className="text-sm text-muted-foreground"> */}
                  {/*   {selectedSection.categories.length} categorias */}
                  {/* </p> */}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    NiceModal.show(MenuCategoryDialog, {
                      title: "Nueva categoria",
                      submitLabel: "Guardar",
                      sectionName: selectedSection.name,
                      onSubmit: (name) =>
                        createCategory.mutate({
                          name,
                          sectionId: selectedSection.id,
                        }),
                    })
                  }
                >
                  <Plus />
                  Agregar categoria
                </Button>
              </div>
              {selectedSection.categories.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-border/60 p-6 text-sm text-muted-foreground">
                  No hay categorias por ahora.
                </div>
              ) : (
                selectedSection.categories.map((category, categoryIndex) => {
                  const categoryId = (category as { id?: string }).id;
                  const remoteProducts = categoryId
                    ? (productsByCategory.byId.get(categoryId) ?? [])
                    : (productsByCategory.byName.get(
                        category.name.toLowerCase(),
                      ) ?? []);
                  return (
                    <Collapsible key={category.id} defaultOpen>
                      <div className="flex flex-col gap-4">
                        <div className="flex items-start justify-between gap-4">
                          <CollapsibleTrigger className="flex flex-1 items-start gap-4 text-left">
                            <div>
                              <h3 className="text-base font-semibold">
                                {category.name}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {productsQuery.isLoading
                                  ? "Cargando productos..."
                                  : `${remoteProducts.length} productos`}
                              </p>
                            </div>
                          </CollapsibleTrigger>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                aria-label={`Opciones para ${category.name}`}
                              >
                                <MoreVertical />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  NiceModal.show(MenuCategoryDialog, {
                                    title: "Actualizar categoria",
                                    submitLabel: "Guardar cambios",
                                    sectionName: selectedSection.name,
                                    initialValues: { name: category.name },
                                    onSubmit: (name) =>
                                      handleUpdateCategory(
                                        selectedSection.id,
                                        category.id,
                                        name,
                                      ),
                                  })
                                }
                              >
                                Actualizar
                              </DropdownMenuItem>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem variant="destructive">
                                    Eliminar
                                  </DropdownMenuItem>
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
                                        handleDeleteCategory(category.id)
                                      }
                                    >
                                      Eliminar
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <CollapsibleContent className="flex flex-col gap-4">
                          {remoteProducts.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-border/60 px-4 py-3 text-sm text-muted-foreground">
                              {productsQuery.isLoading
                                ? "Cargando productos..."
                                : "Sin productos por ahora."}
                            </div>
                          ) : (
                            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                              {remoteProducts.map((product) => (
                                <MenuProductCard
                                  key={product.id}
                                  product={product}
                                  category={category}
                                  categoryIndex={categoryIndex}
                                  selectedSection={selectedSection}
                                  selectedSectionIndex={selectedSectionIndex}
                                  sections={sections}
                                  onUpdateProduct={(values) =>
                                    updateProduct.mutate(values)
                                  }
                                  onDeleteProduct={handleDeleteProduct}
                                  onUpdateOption={handleUpdateOption}
                                  onDeleteOption={handleDeleteOption}
                                  onAddOption={handleAddOption}
                                />
                              ))}
                            </div>
                          )}
                          <div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                NiceModal.show(MenuProductDialog, {
                                  title: "Nuevo producto",
                                  submitLabel: "Guardar",
                                  category: {
                                    name: category.name,
                                    sectionIndex: selectedSectionIndex,
                                    categoryIndex,
                                  } as MenuCategoryWithIndex,
                                  categories: sections.flatMap(
                                    (section, sectionIndex) =>
                                      section.categories.map(
                                        (item, categoryIndex) => ({
                                          ...item,
                                          sectionIndex,
                                          categoryIndex,
                                        }),
                                      ),
                                  ),
                                  onSubmit: (values) => {
                                    NiceModal.show(MenuProductOptionsDialog, {
                                      productName: values.name,
                                      onSubmit: () => undefined,
                                    });
                                  },
                                })
                              }
                            >
                              <Plus />
                              Agregar producto
                            </Button>
                          </div>
                        </CollapsibleContent>
                      </div>
                    </Collapsible>
                  );
                })
              )}
            </>
          ) : (
            <div className="rounded-3xl border border-dashed border-border/60 p-6 text-sm text-muted-foreground">
              Selecciona una seccion para ver sus categorias.
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
