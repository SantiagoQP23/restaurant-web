import type { Category } from "@/shared/models/category.model";
import type { Product } from "@/shared/models/product.model";
import type { Section } from "@/shared/models/section.model";

export type MenuCategory = Category & { products: Product[] };
export type MenuSection = Section & { categories: MenuCategory[] };
export type MenuProduct = Product & {
  categoryId?: string;
  category?: { id: string; name: string };
  isActive?: boolean;
  isPublic?: boolean;
};

export type ProductFormValues = {
  name: string;
  description?: string;
  categoryId: string;
  productionAreaId: string;
};
