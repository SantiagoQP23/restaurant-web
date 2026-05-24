import restaurantApi from "@/app/api/restaurant-api";
import type { LoginRespDto } from "../interfaces/dto/login-resp.dto";

export class AuthService {
  static async switchRestaurant(restaurantId: string) {
    const resp = await restaurantApi.post<LoginRespDto>(
      `/auth/switch-restaurant/${restaurantId}`,
    );
    return resp.data;
  }
}
