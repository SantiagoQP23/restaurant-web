import restaurantApi from "@/app/api/restaurant-api";
import type { LoginRespDto } from "@/modules/auth/interfaces/dto/login-resp.dto";
import type { CreateRestaurantDto } from "../interface/dto/create-restaurant.dto";
import type { UpdateRestaurantDto } from "../interface/dto/update-restaurant.dto";
import type { Restaurant } from "@/shared/models/restaurant.model";

export class RestaurantService {
  static createRestaurant = async (restaurant: CreateRestaurantDto) => {
    const resp = await restaurantApi.post<LoginRespDto>(
      `restaurant`,
      restaurant,
    );

    return resp.data;
  };

  static update = async (
    restaurantId: string,
    restaurant: UpdateRestaurantDto,
  ): Promise<Restaurant> => {
    const resp = await restaurantApi.patch<Restaurant>(
      `restaurant/${restaurantId}`,
      restaurant,
    );
    return resp.data;
  };
}
