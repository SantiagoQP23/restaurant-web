import type { CreateRestaurantDto } from "./create-restaurant.dto";

export interface UpdateRestaurantDto extends Partial<CreateRestaurantDto> {}
