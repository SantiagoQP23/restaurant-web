import type { Category } from "./category.model";
import type { Product } from "./product.model";
import type { Section } from "./section.model";

export interface Menu {
  sections: Section[];
  categories: Category[];
  products: Product[];
}
