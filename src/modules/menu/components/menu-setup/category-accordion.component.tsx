import NiceModal from "@ebay/nice-modal-react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Switch } from "@/shared/components/ui/switch";
import { cn } from "@/shared/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/components/ui/collapsible";
import { ChevronDown, Eye, EyeOff, MoreVertical, Plus } from "lucide-react";
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
import { MenuCategoryDialog } from "@/modules/menu/components/menu-category-dialog.component";
import {
  MenuProductDialog,
  type MenuCategoryWithIndex,
} from "@/modules/menu/components/menu-product-dialog.component";
import { MenuProductOptionsDialog } from "@/modules/menu/components/menu-product-options-dialog.component";
import { useMenuMutations } from "@/modules/menu/hooks/useMenuMutations";
import { ProductCard } from "./product-card.component";
import type {
  MenuCategory,
  MenuSection,
  MenuProduct,
} from "./menu-setup.types";

interface CategoryAccordionProps {
  category: MenuCategory;
  categoryIndex: number;
  section: MenuSection;
  sectionIndex: number;
  isOpen: boolean;
  onToggle: (open: boolean) => void;
  products: MenuProduct[];
  productCount: number;
  sections: MenuSection[];
  isLoadingProducts: boolean;
  searchQuery: string;
}

export const CategoryAccordion = ({
  category,
  categoryIndex,
  section,
  sectionIndex,
  isOpen,
  onToggle,
  products,
  productCount,
  sections,
  isLoadingProducts,
  searchQuery,
}: CategoryAccordionProps) => {
  const { updateCategory, deleteCategory } = useMenuMutations();

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <div
        className={cn(
          "rounded-lg border border-border/40 overflow-hidden",
          category.isActive ? "border-border" : "border-border/50 opacity-70",
        )}
      >
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
                  isOpen && "rotate-180",
                )}
              />
            </Button>
          </CollapsibleTrigger>

          <span className="font-medium text-sm">{category.name}</span>

          <Badge variant="secondary" className="text-xs">
            {productCount} {productCount === 1 ? "producto" : "productos"}
          </Badge>

          <div className="ml-auto flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground">Activa</span>
              <Switch
                size="sm"
                checked={category.isActive}
                onCheckedChange={(checked) =>
                  updateCategory.mutate({ id: category.id, isActive: checked })
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
                    NiceModal.show(MenuCategoryDialog, {
                      title: "Actualizar categoría",
                      submitLabel: "Guardar cambios",
                      sectionName: section.name,
                      initialValues: { name: category.name },
                      onSubmit: (name) =>
                        updateCategory.mutate({
                          id: category.id,
                          name,
                          sectionId: section.id,
                        }),
                    })
                  }
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
                      <AlertDialogTitle>Eliminar categoría</AlertDialogTitle>
                      <AlertDialogDescription>
                        Estás a punto de eliminar la categoría &quot;
                        {category.name}&quot;. Esta acción no se puede deshacer.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        variant="destructive"
                        onClick={() => deleteCategory.mutate(category.id)}
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
                {isLoadingProducts
                  ? "Cargando productos..."
                  : searchQuery
                    ? "No se encontraron productos."
                    : "Sin productos por ahora."}
              </div>
            ) : (
              products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  category={category}
                  sectionIndex={sectionIndex}
                  categoryIndex={categoryIndex}
                  sections={sections}
                />
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
                    sectionIndex,
                    categoryIndex,
                  } as MenuCategoryWithIndex,
                  categories: sections.flatMap((sec, secIdx) =>
                    sec.categories.map((item, catIdx) => ({
                      ...item,
                      sectionIndex: secIdx,
                      categoryIndex: catIdx,
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
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};
