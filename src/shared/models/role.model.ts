import type { Restaurant } from "./restaurant.model";

export interface Role {
  id: number;
  name: string;
  description: string;
}

export interface RestaurantRole {
  id: number;
  restaurant: Restaurant;
  role: Role;
}
