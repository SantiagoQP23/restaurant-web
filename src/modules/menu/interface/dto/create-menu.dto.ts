export interface CreateMenuProductOptionDto {
  name: string;
  price?: number;
  cost?: number;
  trackStock?: boolean;
  quantity?: number;
  productId: string;
  isDefault?: boolean;
}

export interface CreateCategoryProductDto {
  name: string;
  description?: string;
  productionArea?: string;
  options?: CreateMenuProductOptionDto[];
}

export interface CreateSectionCategoryDto {
  name: string;
  products: CreateCategoryProductDto[];
}

export interface CreateMenuSectionDto {
  name: string;
  categories: CreateSectionCategoryDto[];
}

export interface CreateMenuDto {
  sections: CreateMenuSectionDto[];
}
