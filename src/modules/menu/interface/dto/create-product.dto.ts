export interface CreateProductDto {
  name: string;
  price: number;
  categoryId: string;
  description?: string;
  productionAreaId?: number;
  unitCost?: number;
  quantity?: number;
}
