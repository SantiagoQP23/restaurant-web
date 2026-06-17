import type { Product } from "./product.model";

export interface Category {
  id: string;
  name: string;
  products: Product[];
  isActive: boolean;
  isPublic: boolean;
}
