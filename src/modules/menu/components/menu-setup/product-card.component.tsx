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
  MenuProductSheet,
} from "@/modules/menu/components/menu-product-sheet.component";
import {
  type MenuCategoryWithIndex,
} from "@/modules/menu/components/menu-product-dialog.component";
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
}: ProductCardProps) => (
  <div
    className={cn(
      "flex items-start gap-3 rounded-md border border-border px-3 py-2.5 bg-background",
      !product.isActive && "opacity-50",
    )}
  >

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
              variant="neutral"
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
              NiceModal.show(MenuProductSheet, {
                mode: "update",
                productId: product.id,
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
                sections,
                initialValues: {
                  name: product.name,
                  description: product.description,
                  categoryId: `${sectionIndex}-${categoryIndex}`,
                  productionAreaId:
                    product.productionArea?.id.toString() ?? "",
                  price: product.price,
                  unitCost: product.unitCost,
                  quantity: product.quantity,
                  options: product.options,
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
