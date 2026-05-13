import type { ProductOption } from "./product-option.model";
import type { ProductionArea } from "./production-area.model";

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string;
  productionArea: ProductionArea;
  unitCost: number;
  quantity: number;
  options: ProductOption[];
}
