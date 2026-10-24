import restaurantApi from "@/app/api/restaurant-api";
import type { ProductOption } from "@/shared/models/product-option.model";

export class ProductOptionsService {
  static update = async (
    id: number,
    data: Partial<Pick<ProductOption, "name" | "price" | "isActive">>,
  ): Promise<ProductOption> => {
    const resp = await restaurantApi.patch<ProductOption>(
      `/product-options/${id}`,
      data,
    );
    return resp.data;
  };
}
