import type { Restaurant } from "@/shared/models/restaurant.model";
import type { User } from "@/shared/models/user.model";

export interface LoginRespDto {
  token: string;
  user: User;
  currentRestaurant: Restaurant | null;
}
