import restaurantApi from "@/app/api/restaurant-api";
import type { User } from "@/shared/models/user.model";
import type { UserFiltersDto } from "../interfaces/dto/user-filters.dto";

export class UsersService {
  static getAll = async (
    pagination: UserFiltersDto,
  ): Promise<{ users: User[]; count: number }> => {
    const { offset = 0, limit = 5, search } = pagination;

    const resp = await restaurantApi.get<{ users: User[]; count: number }>(
      `users/`,
      {
        params: {
          offset: offset * limit,
          limit,
          search,
        },
      },
    );

    return resp.data;
  };
}
