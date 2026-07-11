import NiceModal from "@ebay/nice-modal-react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  MenuProductDialog,
  type MenuCategoryWithIndex,
} from "@/modules/menu/components/menu-product-dialog.component";
import { useMenuMutations } from "@/modules/menu/hooks/useMenuMutations";
import type {
  MenuProduct,
  MenuCategory,
  MenuSection,
} from "./menu-setup.types";

interface ProductCardProps {
  product: MenuProduct;
  category: MenuCategory;
  sectionIndex: number;
  categoryIndex: number;
  sections: MenuSection[];
}

export const ProductCard = ({
  product,
  category,
  sectionIndex,
  categoryIndex,
  sections,
}: ProductCardProps) => {
  const { updateProduct } = useMenuMutations();

  return (
    <div className="flex items-start gap-3 rounded-lg border border-border/40 px-3 py-2.5 bg-background/50">
      {/* Status dot */}
      <div
        className={cn(
          "mt-1.5 h-2 w-2 rounded-full shrink-0",
          product.isActive ? "bg-emerald-500" : "bg-gray-300",
        )}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-sm">{product.name}</span>
          <Badge variant="outline" className="text-xs">
            {product.productionArea?.name ?? "Sin área"}
          </Badge>
        </div>
        {product.description && (
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
            {product.description}
          </p>
        )}
        {product.options && product.options.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {product.options.map((option) => (
              <Badge
                key={option.id}
                variant="secondary"
                className="text-xs font-normal"
              >
                {option.name} $ {option.price.toLocaleString()}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
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
                  initialValues: {
                    name: product.name,
                    description: product.description,
                    categoryId: `${sectionIndex}-${categoryIndex}`,
                    productionAreaId:
                      product.productionArea?.id.toString() ?? "",
                  },
                  onSubmit: (values) => {
                    const [secIdx, catIdx] = values.categoryId
                      .split("-")
                      .map((v) => Number.parseInt(v, 10));
                    const targetSection = sections[secIdx];
                    const targetCategory =
                      targetSection?.categories[catIdx];
                    updateProduct.mutate({
                      id: product.id,
                      name: values.name,
                      description: values.description ?? "",
                      categoryId: targetCategory?.id ?? "",
                      productionAreaId: values.productionAreaId
                        ? Number.parseInt(values.productionAreaId, 10)
                        : undefined,
                    });
                  },
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
  );
};
