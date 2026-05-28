import restaurantApi from "@/app/api/restaurant-api";
import type { Category } from "@/shared/models/category.model";
import type { CreateCategoryDto } from "../interface/dto/create-category.dto";
import type { UpdateCategoryDto } from "../interface/dto/update-category.dto";

export class CategoriesService {
  static create = async (data: CreateCategoryDto): Promise<Category> => {
    const resp = await restaurantApi.post<Category>("/categories", data);
    return resp.data;
  };

  static update = async (
    id: string,
    data: UpdateCategoryDto,
  ): Promise<Category> => {
    const resp = await restaurantApi.patch<Category>(`/categories/${id}`, data);
    return resp.data;
  };

  static remove = async (id: string): Promise<void> => {
    await restaurantApi.delete(`/categories/${id}`);
  };
}
