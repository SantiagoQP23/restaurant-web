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
import { ChevronDown, MoreVertical, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { MenuSectionDialog } from "@/modules/menu/components/menu-section-dialog.component";
import { MenuCategoryDialog } from "@/modules/menu/components/menu-category-dialog.component";
import { useMenuMutations } from "@/modules/menu/hooks/useMenuMutations";
import { CategoryAccordion } from "./category-accordion.component";
import type { MenuSection, MenuProduct } from "./menu-setup.types";

interface SectionAccordionProps {
  section: MenuSection;
  sectionIndex: number;
  isOpen: boolean;
  onToggle: (open: boolean) => void;
  expandedCategories: Set<string>;
  onToggleCategory: (categoryId: string, open: boolean) => void;
  categoryProducts: Map<string, MenuProduct[]>;
  categoryProductCounts: Map<string, number>;
  searchQuery: string;
  isLoadingProducts: boolean;
  sections: MenuSection[];
}

export const SectionAccordion = ({
  section,
  sectionIndex,
  isOpen,
  onToggle,
  expandedCategories,
  onToggleCategory,
  categoryProducts,
  categoryProductCounts,
  searchQuery,
  isLoadingProducts,
  sections,
}: SectionAccordionProps) => {
  const { updateSection, createCategory } = useMenuMutations();

  const categoryCount = section.categories.length;
  const totalProductCount = section.categories.reduce(
    (sum, cat) => sum + (categoryProductCounts.get(cat.id) ?? 0),
    0,
  );

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <div
        className={cn(
          "rounded-xl border border-border/60 bg-card shadow-sm overflow-hidden ",
          section.isActive ? "border-border" : "border-border/50 opacity-70",
        )}
      >
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
                  isOpen && "rotate-180",
                )}
              />
            </Button>
          </CollapsibleTrigger>

          <span className="font-semibold text-sm">{section.name}</span>

          <Badge variant="secondary" className="text-xs">
            {categoryCount} {categoryCount === 1 ? "categoría" : "categorías"}
          </Badge>

          <Badge variant="secondary" className="text-xs">
            {totalProductCount}{" "}
            {totalProductCount === 1 ? "producto" : "productos"}
          </Badge>

          <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground">Activa</span>
              <Switch
                size="sm"
                checked={section.isActive}
                onCheckedChange={(checked) =>
                  updateSection.mutate({ id: section.id, isActive: checked })
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
                        updateSection.mutate({ id: section.id, name }),
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
            {section.categories.map((category, categoryIndex) => (
              <CategoryAccordion
                key={category.id}
                category={category}
                categoryIndex={categoryIndex}
                section={section}
                sectionIndex={sectionIndex}
                isOpen={expandedCategories.has(category.id)}
                onToggle={(open) => onToggleCategory(category.id, open)}
                products={categoryProducts.get(category.id) ?? []}
                productCount={categoryProductCounts.get(category.id) ?? 0}
                sections={sections}
                isLoadingProducts={isLoadingProducts}
                searchQuery={searchQuery}
              />
            ))}

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
                    createCategory.mutate({ name, sectionId: section.id }),
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
};
