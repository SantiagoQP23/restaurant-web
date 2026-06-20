import restaurantApi from "@/app/api/restaurant-api";
import type { LoginRespDto } from "@/modules/auth/interfaces/dto/login-resp.dto";
import type { CreateRestaurantDto } from "../interface/dto/create-restaurant.dto";

export class RestaurantService {
  static createRestaurant = async (restaurant: CreateRestaurantDto) => {
    const resp = await restaurantApi.post<LoginRespDto>(
      `restaurant`,
      restaurant,
    );

    return resp.data;
  };
}
