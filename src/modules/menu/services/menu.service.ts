import restaurantApi from "@/app/api/restaurant-api";
import type { Menu } from "@/shared/models/menu.model";

export class MenuService {
  static getAllMenu = async (restaurantId: string): Promise<Menu> => {
    const resp = await restaurantApi.get<Menu>(`/menu/${restaurantId}`);
    return resp.data;
  };
}
