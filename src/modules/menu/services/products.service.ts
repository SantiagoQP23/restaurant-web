import restaurantApi from "@/app/api/restaurant-api";
import type { UpdateProductDto } from "../interface/dto/update-product.dto";
import type { CreateProductDto } from "../interface/dto/create-product.dto";
import type { Product } from "@/shared/models/product.model";

export class ProductsService {
  static getAll = async (restaurantId: string) => {
    const resp = await restaurantApi.get(`/products/all/${restaurantId}`);
    return resp.data;
  };

  static create = async (data: CreateProductDto): Promise<Product> => {
    const resp = await restaurantApi.post<Product>("/products", data);
    return resp.data;
  };

  static update = async (
    id: string,
    data: UpdateProductDto,
  ): Promise<Product> => {
    const resp = await restaurantApi.patch<Product>(`/products/${id}`, data);

    return resp.data;
  };
}
