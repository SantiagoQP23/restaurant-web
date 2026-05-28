import restaurantApi from "@/app/api/restaurant-api";

export class ProductsService {
  static getAll = async (restaurantId: string) => {
    const resp = await restaurantApi.get(`/products/all/${restaurantId}`);
    return resp.data;
  };
}
