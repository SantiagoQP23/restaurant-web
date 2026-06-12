import restaurantApi from "@/app/api/restaurant-api";
import type { Role } from "@/shared/models/role.model";

export class RolesService {
  static getAll = async (): Promise<Role[]> => {
    const resp = await restaurantApi.get<Role[]>(`roles`);

    return resp.data;
  };
}
