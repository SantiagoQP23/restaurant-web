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
import { Switch } from "@/shared/components/ui/switch";
import { cn } from "@/shared/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/components/ui/collapsible";
import {
  ChevronDown,
  Eye,
  EyeOff,
  MoreVertical,
  Plus,
  Search,
} from "lucide-react";
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
  isActive?: boolean;
  isPublic?: boolean;
};

export const MenuSetupPage = () => {
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
  const [expandedSections, setExpandedSections] = React.useState<Set<string>>(
    new Set(),
  );
  const [expandedCategories, setExpandedCategories] = React.useState<
    Set<string>
  >(new Set());
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

  React.useEffect(() => {
    if (fetchedSections) {
      const mapped = fetchedSections.map((section) => ({
        ...section,
        categories: section.categories ?? [],
      })) as MenuSection[];
      setSections(mapped);
      // Expand all sections and categories by default
      setExpandedSections(new Set(mapped.map((s) => s.id)));
      setExpandedCategories(
        new Set(mapped.flatMap((s) => s.categories.map((c) => c.id))),
      );
    }
  }, [fetchedSections]);

  const getCategoryProducts = (category: Category) => {
    const categoryId = (category as { id?: string }).id;
    const products = categoryId
      ? (productsByCategory.byId.get(categoryId) ?? [])
      : (productsByCategory.byName.get(category.name.toLowerCase()) ?? []);
    if (!searchQuery.trim()) return products;
    const q = searchQuery.toLowerCase();
    return products.filter((p) => p.name.toLowerCase().includes(q));
  };

  const getCategoryProductCount = (category: Category) => {
    const categoryId = (category as { id?: string }).id;
    const products = categoryId
      ? (productsByCategory.byId.get(categoryId) ?? [])
      : (productsByCategory.byName.get(category.name.toLowerCase()) ?? []);
    return products.length;
  };

  const getSectionProductCount = (section: MenuSection) => {
    return section.categories.reduce(
      (sum, cat) => sum + getCategoryProductCount(cat),
      0,
    );
  };

  const toggleSection = (sectionId: string, open: boolean) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (open) next.add(sectionId);
      else next.delete(sectionId);
      return next;
    });
  };

  const toggleCategory = (categoryId: string, open: boolean) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (open) next.add(categoryId);
      else next.delete(categoryId);
      return next;
    });
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

  return (
    <div className="flex min-h-svh flex-col p-6 md:p-10">
      <div className="flex flex-1 flex-col gap-6 w-full max-w-4xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold">Menú</h1>
          <p className="text-sm text-muted-foreground">
            Organiza tus secciones, categorías y productos del menú.
          </p>
        </div>

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

        {/* Sections */}
        <div className="flex flex-col gap-4">
          {sections.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/60 px-4 py-8 text-sm text-muted-foreground text-center">
              No hay secciones creadas aún.
            </div>
          ) : (
            sections.map((section) => {
              const sectionIndex = sections.findIndex(
                (s) => s.id === section.id,
              );
              const isSectionOpen = expandedSections.has(section.id);
              const categoryCount = section.categories.length;
              const productCount = getSectionProductCount(section);

              return (
                <Collapsible
                  key={section.id}
                  open={isSectionOpen}
                  onOpenChange={(open) => toggleSection(section.id, open)}
                >
                  <div className="rounded-xl border border-border/60 bg-card shadow-sm overflow-hidden">
                    {/* Section Header */}
                    <div className="flex items-center gap-2 px-4 py-3">
                      <CollapsibleTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0"
                        >
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 transition-transform duration-200",
                              isSectionOpen && "rotate-180",
                            )}
                          />
                        </Button>
                      </CollapsibleTrigger>

                      <span className="font-semibold text-sm">
                        {section.name}
                      </span>

                      <Badge variant="secondary" className="text-xs">
                        {categoryCount}{" "}
                        {categoryCount === 1
                          ? "categoría"
                          : "categorías"}
                      </Badge>

                      <Badge variant="secondary" className="text-xs">
                        {productCount}{" "}
                        {productCount === 1 ? "producto" : "productos"}
                      </Badge>

                      <div className="ml-auto flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-muted-foreground">
                            Activa
                          </span>
                          <Switch
                            size="sm"
                            checked={section.isActive}
                            onCheckedChange={(checked) =>
                              updateSection.mutate({
                                id: section.id,
                                isActive: checked,
                              })
                            }
                          />
                        </div>

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
                                NiceModal.show(MenuSectionDialog, {
                                  title: "Actualizar sección",
                                  submitLabel: "Guardar cambios",
                                  initialValues: { name: section.name },
                                  onSubmit: (name) =>
                                    updateSection.mutate({
                                      id: section.id,
                                      name,
                                    }),
                                })
                              }
                            >
                              Actualizar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    <CollapsibleContent>
                      <div className="px-4 pb-4 flex flex-col gap-3">
                        {section.categories.map((category) => {
                          const categoryIndex = section.categories.findIndex(
                            (c) => c.id === category.id,
                          );
                          const isCategoryOpen = expandedCategories.has(
                            category.id,
                          );
                          const catProductCount = getCategoryProductCount(
                            category,
                          );
                          const products = getCategoryProducts(category);

                          return (
                            <Collapsible
                              key={category.id}
                              open={isCategoryOpen}
                              onOpenChange={(open) =>
                                toggleCategory(category.id, open)
                              }
                            >
                              <div className="rounded-lg border border-border/40 overflow-hidden">
                                {/* Category Header */}
                                <div className="flex items-center gap-2 px-3 py-2">
                                  <CollapsibleTrigger asChild>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 shrink-0"
                                    >
                                      <ChevronDown
                                        className={cn(
                                          "h-4 w-4 transition-transform duration-200",
                                          isCategoryOpen && "rotate-180",
                                        )}
                                      />
                                    </Button>
                                  </CollapsibleTrigger>

                                  <span className="font-medium text-sm">
                                    {category.name}
                                  </span>

                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {catProductCount}{" "}
                                    {catProductCount === 1
                                      ? "producto"
                                      : "productos"}
                                  </Badge>

                                  <div className="ml-auto flex items-center gap-2">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-xs text-muted-foreground">
                                        Activa
                                      </span>
                                      <Switch
                                        size="sm"
                                        checked={category.isActive}
                                        onCheckedChange={(checked) =>
                                          updateCategory.mutate({
                                            id: category.id,
                                            isActive: checked,
                                          })
                                        }
                                      />
                                    </div>

                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7"
                                      onClick={() =>
                                        updateCategory.mutate({
                                          id: category.id,
                                          isPublic: !category.isPublic,
                                        })
                                      }
                                    >
                                      {category.isPublic ? (
                                        <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                                      ) : (
                                        <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
                                      )}
                                    </Button>

                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="icon"
                                          className="h-7 w-7"
                                        >
                                          <MoreVertical className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                          onClick={() =>
                                            NiceModal.show(
                                              MenuCategoryDialog,
                                              {
                                                title:
                                                  "Actualizar categoría",
                                                submitLabel:
                                                  "Guardar cambios",
                                                sectionName: section.name,
                                                initialValues: {
                                                  name: category.name,
                                                },
                                                onSubmit: (name) =>
                                                  handleUpdateCategory(
                                                    section.id,
                                                    category.id,
                                                    name,
                                                  ),
                                              },
                                            )
                                          }
                                        >
                                          Actualizar
                                        </DropdownMenuItem>
                                        <AlertDialog>
                                          <AlertDialogTrigger asChild>
                                            <DropdownMenuItem
                                              variant="destructive"
                                              onClick={(event) =>
                                                event.stopPropagation()
                                              }
                                            >
                                              Eliminar
                                            </DropdownMenuItem>
                                          </AlertDialogTrigger>
                                          <AlertDialogContent>
                                            <AlertDialogHeader>
                                              <AlertDialogTitle>
                                                Eliminar categoría
                                              </AlertDialogTitle>
                                              <AlertDialogDescription>
                                                Estás a punto de eliminar la
                                                categoría &quot;
                                                {category.name}&quot;. Esta
                                                acción no se puede deshacer.
                                              </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                              <AlertDialogCancel>
                                                Cancelar
                                              </AlertDialogCancel>
                                              <AlertDialogAction
                                                variant="destructive"
                                                onClick={() =>
                                                  handleDeleteCategory(
                                                    category.id,
                                                  )
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
                                </div>

                                <CollapsibleContent>
                                  <div className="px-3 pb-3 flex flex-col gap-2">
                                    {products.length === 0 ? (
                                      <div className="rounded-lg border border-dashed border-border/40 px-3 py-4 text-xs text-muted-foreground text-center">
                                        {productsQuery.isLoading
                                          ? "Cargando productos..."
                                          : searchQuery
                                            ? "No se encontraron productos."
                                            : "Sin productos por ahora."}
                                      </div>
                                    ) : (
                                      products.map((product) => (
                                        <div
                                          key={product.id}
                                          className="flex items-start gap-3 rounded-lg border border-border/40 px-3 py-2.5 bg-background/50"
                                        >
                                          {/* Status dot */}
                                          <div
                                            className={cn(
                                              "mt-1.5 h-2 w-2 rounded-full shrink-0",
                                              product.isActive
                                                ? "bg-emerald-500"
                                                : "bg-gray-300",
                                            )}
                                          />

                                          <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                              <span className="font-medium text-sm">
                                                {product.name}
                                              </span>
                                              <Badge
                                                variant="outline"
                                                className="text-xs"
                                              >
                                                {product.productionArea
                                                  ?.name ?? "Sin área"}
                                              </Badge>
                                            </div>
                                            {product.description && (
                                              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                                                {product.description}
                                              </p>
                                            )}
                                            {product.options &&
                                              product.options.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5 mt-1.5">
                                                  {product.options.map(
                                                    (option) => (
                                                      <Badge
                                                        key={option.id}
                                                        variant="secondary"
                                                        className="text-xs font-normal"
                                                      >
                                                        {option.name} ${" "}
                                                        {option.price.toLocaleString()}
                                                      </Badge>
                                                    ),
                                                  )}
                                                </div>
                                              )}
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
                                                    NiceModal.show(
                                                      MenuProductDialog,
                                                      {
                                                        title:
                                                          "Actualizar producto",
                                                        submitLabel:
                                                          "Guardar cambios",
                                                        category: {
                                                          name: category.name,
                                                          sectionIndex:
                                                            sectionIndex,
                                                          categoryIndex:
                                                            categoryIndex,
                                                        } as MenuCategoryWithIndex,
                                                        categories:
                                                          sections.flatMap(
                                                            (
                                                              sec,
                                                              secIdx,
                                                            ) =>
                                                              sec.categories.map(
                                                                (
                                                                  item,
                                                                  catIdx,
                                                                ) => ({
                                                                  ...item,
                                                                  sectionIndex:
                                                                    secIdx,
                                                                  categoryIndex:
                                                                    catIdx,
                                                                }),
                                                              ),
                                                          ),
                                                        initialValues: {
                                                          name: product.name,
                                                          description:
                                                            product.description,
                                                          categoryId: `${sectionIndex}-${categoryIndex}`,
                                                          productionAreaId:
                                                            product.productionArea?.id.toString() ??
                                                            "",
                                                        },
                                                        onSubmit: (values) =>
                                                          handleUpdateProduct(
                                                            product.id,
                                                            values,
                                                          ),
                                                      },
                                                    )
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

                                    <Button
                                      type="button"
                                      variant="ghost"
                                      className="w-full justify-start text-sm rounded-lg mt-1"
                                      onClick={() =>
                                        NiceModal.show(MenuProductDialog, {
                                          title: "Nuevo producto",
                                          submitLabel: "Guardar",
                                          category: {
                                            name: category.name,
                                            sectionIndex: sectionIndex,
                                            categoryIndex: categoryIndex,
                                          } as MenuCategoryWithIndex,
                                          categories: sections.flatMap(
                                            (sec, secIdx) =>
                                              sec.categories.map(
                                                (item, catIdx) => ({
                                                  ...item,
                                                  sectionIndex: secIdx,
                                                  categoryIndex: catIdx,
                                                }),
                                              ),
                                          ),
                                          onSubmit: (values) => {
                                            NiceModal.show(
                                              MenuProductOptionsDialog,
                                              {
                                                productName: values.name,
                                                onSubmit: () => undefined,
                                              },
                                            );
                                          },
                                        })
                                      }
                                    >
                                      <Plus className="h-4 w-4 mr-2" />
                                      Agregar producto
                                    </Button>
                                  </div>
                                </CollapsibleContent>
                              </div>
                            </Collapsible>
                          );
                        })}

                        <Button
                          type="button"
                          variant="ghost"
                          className="w-full justify-start text-sm rounded-lg"
                          onClick={() =>
                            NiceModal.show(MenuCategoryDialog, {
                              title: "Nueva categoría",
                              submitLabel: "Guardar",
                              sectionName: section.name,
                              onSubmit: (name) =>
                                createCategory.mutate({
                                  name,
                                  sectionId: section.id,
                                }),
                            })
                          }
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Agregar categoría
                        </Button>
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              );
            })
          )}

          {/* Add Section Button */}
          <Button
            type="button"
            variant="ghost"
            className="w-full justify-start text-sm rounded-xl"
            onClick={() =>
              NiceModal.show(MenuSectionDialog, {
                title: "Nueva sección",
                submitLabel: "Guardar",
                onSubmit: (name) => createSection.mutate({ name }),
              })
            }
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar sección
          </Button>
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
