import * as React from "react";
import { Link } from "@tanstack/react-router";
import NiceModal from "@ebay/nice-modal-react";
import { useQuery } from "@tanstack/react-query";
import type { Section } from "@/shared/models/section.model";
import type { Category } from "@/shared/models/category.model";
import type { Product } from "@/shared/models/product.model";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/lib/utils";
import { MoreVertical, Plus, Search } from "lucide-react";
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
import { MenuSectionDialog } from "@/modules/menu/components/menu-section-dialog.component";
import { MenuCategoryDialog } from "@/modules/menu/components/menu-category-dialog.component";
import {
  MenuProductDialog,
  type MenuCategoryWithIndex,
} from "@/modules/menu/components/menu-product-dialog.component";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { ProductsService } from "@/modules/menu/services/products.service";
import { queryKeys } from "@/app/api/query-client";
import { useMenu } from "@/modules/menu/hooks/useMenu";
import { MenuProductOptionsDialog } from "@/modules/menu/components/menu-product-options-dialog.component";
import { SetupStepper } from "../components/setup-stepper.component";

type MenuCategory = Category & { products: Product[] };
type MenuSection = Section & { categories: MenuCategory[] };
type MenuProduct = Product & {
  categoryId?: string;
  category?: { id: string; name: string };
};

export const MenuSetupPage = () => {
  const {
    sections: fetchedSections,
    createSection,
    // updateSection,
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
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<
    string | null
  >(null);
  const [searchQuery, setSearchQuery] = React.useState("");

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

  const selectedSection = React.useMemo(
    () => sections.find((section) => section.id === selectedSectionId),
    [sections, selectedSectionId],
  );

  const selectedSectionIndex = React.useMemo(
    () => sections.findIndex((section) => section.id === selectedSectionId),
    [sections, selectedSectionId],
  );

  const selectedCategory = React.useMemo(
    () =>
      selectedSection?.categories.find(
        (category) => category.id === selectedCategoryId,
      ),
    [selectedSection, selectedCategoryId],
  );

  const selectedCategoryIndex = React.useMemo(
    () =>
      selectedSection?.categories.findIndex(
        (category) => category.id === selectedCategoryId,
      ) ?? -1,
    [selectedSection, selectedCategoryId],
  );

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

  React.useEffect(() => {
    if (
      selectedSection &&
      !selectedCategoryId &&
      selectedSection.categories.length > 0
    ) {
      setSelectedCategoryId(selectedSection.categories[0]?.id ?? null);
    }
  }, [selectedSection, selectedCategoryId]);

  const handleSelectSection = (sectionId: string) => {
    setSelectedSectionId(sectionId);
    setSelectedCategoryId(null);
    setSearchQuery("");
  };

  // const handleUpdateSection = (sectionId: string, name: string) => {
  //   updateSection.mutate({ id: sectionId, name });
  // };

  // const handleDeleteSection = (sectionId: string) => {
  //   setSections((current) =>
  //     current.filter((section) => section.id !== sectionId),
  //   );
  //   if (selectedSectionId === sectionId) {
  //     setSelectedSectionId(null);
  //     setSelectedCategoryId(null);
  //   }
  // };

  const handleUpdateCategory = (
    sectionId: string,
    categoryId: string,
    name: string,
  ) => {
    updateCategory.mutate({ id: categoryId, name, sectionId });
  };

  const handleDeleteCategory = (categoryId: string) => {
    deleteCategory.mutate(categoryId);
    if (selectedCategoryId === categoryId) {
      setSelectedCategoryId(null);
    }
  };

  const handleUpdateProduct = (
    productId: string,
    values: {
      name: string;
      description?: string;
      categoryId: string;
      productionAreaId: string;
    },
  ) => {
    const [sectionIndex, nextCategoryIndex] = values.categoryId
      .split("-")
      .map((v) => Number.parseInt(v, 10));
    const targetSection = sections[sectionIndex];
    const targetCategory = targetSection?.categories[nextCategoryIndex];
    updateProduct.mutate({
      id: productId,
      name: values.name,
      description: values.description ?? "",
      categoryId: targetCategory?.id ?? "",
      productionAreaId: values.productionAreaId
        ? Number.parseInt(values.productionAreaId, 10)
        : undefined,
    });
  };

  const getCategoryProductCount = (category: Category) => {
    const categoryId = (category as { id?: string }).id;
    const products = categoryId
      ? (productsByCategory.byId.get(categoryId) ?? [])
      : (productsByCategory.byName.get(category.name.toLowerCase()) ?? []);
    return products.length;
  };

  const getFilteredProducts = (category: Category) => {
    const categoryId = (category as { id?: string }).id;
    const products = categoryId
      ? (productsByCategory.byId.get(categoryId) ?? [])
      : (productsByCategory.byName.get(category.name.toLowerCase()) ?? []);
    if (!searchQuery.trim()) return products;
    const q = searchQuery.toLowerCase();
    return products.filter((p) => p.name.toLowerCase().includes(q));
  };

  return (
    <div className="flex min-h-svh flex-col p-6 md:p-10">
      <div className="flex flex-1 flex-col gap-6 w-full max-w-7xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-600">Menú</h1>
          <p className="text-sm text-muted-foreground">
            Organiza tus secciones, categorias y productos del menú.
          </p>
        </div>

        {/* Section Tabs */}
        <div className="flex items-center gap-1 border-b border-border/60 pb-1 overflow-x-auto">
          {sections.map((section) => {
            const isActive = section.id === selectedSectionId;
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => handleSelectSection(section.id)}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors rounded-t-lg",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {section.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            );
          })}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="rounded-full shrink-0"
            onClick={() =>
              NiceModal.show(MenuSectionDialog, {
                title: "Nueva seccion",
                submitLabel: "Guardar",
                onSubmit: (name) => createSection.mutate({ name }),
              })
            }
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* 2 Columns: Categories + Products */}
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          {/* Column 1: Categories */}
          <aside className="rounded-3xl border border-border/60 bg-card/60 p-4 shadow-sm h-fit">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">
                {selectedSection
                  ? `Categorías de "${selectedSection.name}"`
                  : "Categorías"}
              </div>
              {selectedSection && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
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
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>
            {selectedSection ? (
              <>
                <div className="flex flex-col gap-1">
                  {selectedSection.categories.map((category) => {
                    const isActive = category.id === selectedCategoryId;
                    const count = getCategoryProductCount(category);
                    return (
                      <div
                        key={category.id}
                        onClick={() => setSelectedCategoryId(category.id)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            setSelectedCategoryId(category.id);
                          }
                        }}
                        role="button"
                        tabIndex={0}
                        className={cn(
                          "group flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left text-sm transition cursor-pointer border-l-4",
                          isActive
                            ? "bg-muted/80 text-foreground font-medium border-l-primary"
                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground border-l-transparent",
                        )}
                      >
                        <div className="min-w-0">
                          <div className="font-medium truncate">
                            {category.name}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {count} {count === 1 ? "producto" : "productos"}
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                              aria-label={`Opciones para ${category.name}`}
                              onClick={(event) => event.stopPropagation()}
                              onKeyDown={(event) => event.stopPropagation()}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={(event) => {
                                event.stopPropagation();
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
                                    Eliminar categoria
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Estas a punto de eliminar la categoria
                                    &quot;
                                    {category.name}&quot;. Esta accion no se
                                    puede deshacer.
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
                    );
                  })}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full mt-3 rounded-full text-sm justify-start"
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
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar categoria
                </Button>
              </>
            ) : (
              <div className="text-sm text-muted-foreground py-4 text-center">
                Selecciona una seccion
              </div>
            )}
          </aside>

          {/* Column 2: Products */}
          <section className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-lg font-semibold">
                {selectedCategory
                  ? `Productos en ${selectedCategory.name}`
                  : "Productos"}
              </h2>
              {selectedCategory && (
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full"
                  onClick={() =>
                    NiceModal.show(MenuProductDialog, {
                      title: "Nuevo producto",
                      submitLabel: "Guardar",
                      category: {
                        name: selectedCategory.name,
                        sectionIndex: selectedSectionIndex,
                        categoryIndex: selectedCategoryIndex,
                      } as MenuCategoryWithIndex,
                      categories: sections.flatMap((section, sectionIndex) =>
                        section.categories.map((item, categoryIndex) => ({
                          ...item,
                          sectionIndex,
                          categoryIndex,
                        })),
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
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar producto
                </Button>
              )}
            </div>

            {selectedCategory ? (
              (() => {
                const remoteProducts = getFilteredProducts(selectedCategory);
                const totalCount = getCategoryProductCount(selectedCategory);

                return (
                  <div className="flex flex-col gap-3">
                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Buscar productos..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 rounded-full"
                      />
                    </div>

                    {/* Products count */}
                    <div className="text-xs text-muted-foreground">
                      {remoteProducts.length} de {totalCount}{" "}
                      {totalCount === 1 ? "producto" : "productos"}
                    </div>

                    {/* Products list */}
                    {remoteProducts.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-border/60 px-4 py-6 text-sm text-muted-foreground text-center">
                        {productsQuery.isLoading
                          ? "Cargando productos..."
                          : searchQuery
                            ? "No se encontraron productos."
                            : "Sin productos por ahora."}
                      </div>
                    ) : (
                      remoteProducts.map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center justify-between gap-4 rounded-2xl border border-border/60 bg-card px-4 py-3"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-lg shrink-0">
                              🍽️
                            </div>
                            <div className="min-w-0">
                              <div className="font-medium text-sm truncate">
                                {product.name}
                              </div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <Badge variant="outline" className="text-xs">
                                  {product.productionArea?.name ?? "Sin area"}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() =>
                                    NiceModal.show(MenuProductDialog, {
                                      title: "Actualizar producto",
                                      submitLabel: "Guardar cambios",
                                      category: {
                                        name: selectedCategory.name,
                                        sectionIndex: selectedSectionIndex,
                                        categoryIndex: selectedCategoryIndex,
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
                                      initialValues: {
                                        name: product.name,
                                        description: product.description,
                                        categoryId: `${selectedSectionIndex}-${selectedCategoryIndex}`,
                                        productionAreaId:
                                          product.productionArea?.id.toString() ??
                                          "",
                                      },
                                      onSubmit: (values) =>
                                        handleUpdateProduct(product.id, values),
                                    })
                                  }
                                >
                                  Actualizar
                                </DropdownMenuItem>
                                <DropdownMenuItem variant="destructive">
                                  Eliminar
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                );
              })()
            ) : (
              <div className="rounded-2xl border border-dashed border-border/60 px-4 py-6 text-sm text-muted-foreground text-center">
                Selecciona una categoria para ver sus productos.
              </div>
            )}
          </section>
        </div>

        {/* Footer */}
        <div className="flex justify-end">
          <Button asChild className="rounded-full px-6">
            <Link to="/setup/products">Guardar y continuar</Link>
          </Button>
        </div>
      </div>
      <SetupStepper className="mt-auto pt-6" />
    </div>
  );
};
