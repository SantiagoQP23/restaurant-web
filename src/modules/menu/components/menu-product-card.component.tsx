import NiceModal from "@ebay/nice-modal-react";
import { MoreVertical, Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
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
import { formatCurrency } from "@/shared/lib/utils";
import type { Category } from "@/shared/models/category.model";
import type { Product } from "@/shared/models/product.model";
import type { ProductOption } from "@/shared/models/product-option.model";
import type { Section } from "@/shared/models/section.model";
import {
  MenuProductSheet,
} from "@/modules/menu/components/menu-product-sheet.component";
import {
  type MenuCategoryWithIndex,
} from "@/modules/menu/components/menu-product-dialog.component";
import { MenuProductOptionsDialog } from "@/modules/menu/components/menu-product-options-dialog.component";
import { MenuProductOptionDialog } from "@/modules/menu/components/menu-product-option-dialog.component";

type MenuSection = Section & { categories: Category[] };

type MenuProduct = Product & {
  categoryId?: string;
  category?: { id: string; name: string };
};

type MenuProductCardProps = {
  product: MenuProduct;
  category: Category;
  categoryIndex: number;
  selectedSection: MenuSection;
  selectedSectionIndex: number;
  sections: MenuSection[];
  onDeleteProduct: (
    sectionId: string,
    categoryId: string,
    productId: string,
  ) => void;
  onUpdateOption: (
    sectionId: string,
    categoryId: string,
    productId: string,
    optionId: number,
    payload: { name: string; price: number },
  ) => void;
  onDeleteOption: (
    sectionId: string,
    categoryId: string,
    productId: string,
    optionId: number,
  ) => void;
  onAddOption: (productId: string, option: ProductOption) => void;
};

export const MenuProductCard = ({
  product,
  category,
  categoryIndex,
  selectedSection,
  selectedSectionIndex,
  sections,
  onDeleteProduct,
  onUpdateOption,
  onDeleteOption,
  onAddOption,
}: MenuProductCardProps) => (
  <Card key={product.id} size="sm" className="border border-border/60">
    <CardHeader>
      <div className="flex items-start justify-between gap-2">
        <div>
          <CardTitle className="text-base">{product.name}</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {product.productionArea?.name ?? "Sin area"}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Opciones para ${product.name}`}
              >
                <MoreVertical />
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
                      sectionIndex: selectedSectionIndex,
                      categoryIndex,
                    } as MenuCategoryWithIndex,
                    categories: sections.flatMap((section, sectionIndex) =>
                      section.categories.map((item, categoryIndex) => ({
                        ...item,
                        sectionIndex,
                        categoryIndex,
                      })),
                    ),
                    sections,
                    initialValues: {
                      name: product.name,
                      description: product.description,
                      categoryId: `${selectedSectionIndex}-${categoryIndex}`,
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
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem variant="destructive">
                    Eliminar
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Eliminar producto</AlertDialogTitle>
                    <AlertDialogDescription>
                      Estas a punto de eliminar "{product.name}". Esta accion no
                      se puede deshacer.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      variant="destructive"
                      onClick={() =>
                        onDeleteProduct(
                          selectedSection.id,
                          category.id,
                          product.id,
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
    </CardHeader>
    <CardContent className="flex flex-col gap-3">
      {product.description && (
        <CardDescription>{product.description}</CardDescription>
      )}
      <div className="flex flex-wrap gap-2">
        {product.options.length === 0 ? (
          <span className="text-xs text-muted-foreground">
            Sin opciones agregadas.
          </span>
        ) : (
          product.options.map((option) => (
            <div
              key={option.id}
              className="flex items-center gap-1 rounded-full border border-border/60 px-2 py-1 text-xs"
            >
              <span>
                {option.name}
                {option.price > 0 && ` · ${formatCurrency(option.price)}`}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    aria-label={`Opciones para ${option.name}`}
                  >
                    <MoreVertical />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() =>
                      NiceModal.show(MenuProductOptionDialog, {
                        productName: product.name,
                        initialValues: {
                          name: option.name,
                          price: option.price.toString(),
                        },
                        onSubmit: (values) =>
                          onUpdateOption(
                            selectedSection.id,
                            category.id,
                            product.id,
                            option.id,
                            values,
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
                        <AlertDialogTitle>Eliminar opcion</AlertDialogTitle>
                        <AlertDialogDescription>
                          Estas a punto de eliminar "{option.name}". Esta accion
                          no se puede deshacer.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          variant="destructive"
                          onClick={() =>
                            onDeleteOption(
                              selectedSection.id,
                              category.id,
                              product.id,
                              option.id,
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
          ))
        )}
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() =>
          NiceModal.show(MenuProductOptionsDialog, {
            productName: product.name,
            onSubmit: (values) => {
              values.options.forEach((option, index) => {
                const parsedPrice = Number.parseFloat(option.price);
                onAddOption(product.id, {
                  id: Date.now() + index,
                  name: option.name.trim(),
                  price: Number.isFinite(parsedPrice) ? parsedPrice : 0,
                  quantity: 0,
                  isActive: true,
                  isAvailable: true,
                  isDefault: false,
                });
              });
            },
          })
        }
      >
        <Plus />
        Agregar opción
      </Button>
    </CardContent>
  </Card>
);
