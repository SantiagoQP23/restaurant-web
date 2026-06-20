import restaurantApi from "@/app/api/restaurant-api";
import type { Restaurant } from "@/shared/models/restaurant.model";
import type { User } from "@/shared/models/user.model";
import type { RegisterUserDto } from "../interfaces/dto/register-user.dto";
import type { Role } from "@/shared/models/role.model";

export interface AuthResponse {
  token: string;
  user: User;
  currentRestaurant: Restaurant;
}

const returnUserToken = (
  data: AuthResponse,
): {
  user: User;
  token: string;
  currentRestaurant: Restaurant;
} => {
  const { token, user, currentRestaurant } = data;
  const currentRestaurantRole = data.user.restaurantRoles.find(
    (resRole) => resRole.restaurant.id === data.currentRestaurant?.id,
  );

  const currentRole: Role | null = currentRestaurantRole?.role ?? null;

  return {
    user: { ...user, role: currentRole },
    token,
    currentRestaurant,
  };
};

export const authLogin = async (username: string, password: string) => {
  try {
    const { data } = await restaurantApi.post<AuthResponse>("/auth/login", {
      username,
      password,
    });

    return returnUserToken(data);
  } catch (error) {
    console.log("Auth error", error);
    // throw new Error('User and/or password not valid');
    return null;
  }
};

export const authCheckStatus = async () => {
  try {
    const { data } = await restaurantApi.get<AuthResponse>("/auth/auth-renew");

    return returnUserToken(data);
  } catch {
    return null;
  }
};

export const authRegister = async ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  samePassword,
  ...data
}: RegisterUserDto) => {
  if (data.numPhone === "") {
    delete data.numPhone;
  }

  const { data: respData } = await restaurantApi.post<AuthResponse>(
    "/auth/register",
    data,
  );

  return returnUserToken(respData);
};
