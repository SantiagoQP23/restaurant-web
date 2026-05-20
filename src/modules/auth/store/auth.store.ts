import { create } from "zustand";
import type { Restaurant } from "@/shared/models/restaurant.model";
import type { User } from "@/shared/models/user.model";
import { authCheckStatus, authLogin } from "../actions/auth.actions";

export type AuthStatus = "authenticated" | "unauthenticated" | "checking";

export type AuthState = {
  status: AuthStatus;
  token?: string;
  user?: User;
  restaurant?: Restaurant;

  login: (email: string, password: string) => Promise<boolean>;
  checkStatus: () => Promise<void>;
  logout: () => Promise<void>;

  changeStatus: (
    token?: string,
    user?: User,
    currentRestaurant?: Restaurant,
  ) => Promise<boolean>;
};

export const useAuthStore = create<AuthState>()((set, get) => ({
  // Properties
  status: "checking",
  token: undefined,
  user: undefined,
  restaurant: undefined,

  // Actions
  changeStatus: async (
    token?: string,
    user?: User,
    currentRestaurant?: Restaurant,
  ) => {
    if (!token || !user) {
      set({ status: "unauthenticated", token: undefined, user: undefined });
      localStorage.removeItem("token");
      return false;
    }

    set({
      status: "authenticated",
      token: token,
      user: user,
      restaurant: currentRestaurant,
    });

    localStorage.setItem("token", token);

    return true;
  },

  login: async (email: string, password: string) => {
    const resp = await authLogin(email, password);

    return get().changeStatus(resp?.token, resp?.user, resp?.currentRestaurant);
  },

  checkStatus: async () => {
    const resp = await authCheckStatus();
    get().changeStatus(resp?.token, resp?.user, resp?.currentRestaurant);
  },

  logout: async () => {
    localStorage.removeItem("token");

    set({ status: "unauthenticated", token: undefined, user: undefined });
  },
}));
