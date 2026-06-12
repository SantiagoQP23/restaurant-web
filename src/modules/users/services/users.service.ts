import restaurantApi from "@/app/api/restaurant-api";
import type { User } from "@/shared/models/user.model";
import type { UserFiltersDto } from "../interfaces/dto/user-filters.dto";
import type { InviteUserDto } from "../interfaces/dto/invite-user.dto";
import type { InviteUserRespDto } from "../interfaces/dto/invite-user-resp.dto";

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

  static getUsersSuggestions = async (
    search: string,
  ): Promise<{ users: User[] }> => {
    const resp = await restaurantApi.get<{ users: User[] }>(
      `users/suggestions`,
      {
        params: {
          search,
        },
      },
    );

    return resp.data;
  };

  static async inviteUser(inviteUserDto: InviteUserDto) {
    const resp = await restaurantApi.post<InviteUserRespDto>(
      `restaurant/invite-user`,
      inviteUserDto,
    );

    return resp.data;
  }
}
