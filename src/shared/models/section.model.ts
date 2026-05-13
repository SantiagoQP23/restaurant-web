import type { Category } from "./category.model";

export interface Section {
  id: string;
  name: string;
  categories: Category[];
  order: number;
  isActive: boolean;
}
