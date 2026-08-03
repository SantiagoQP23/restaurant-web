import { create } from "zustand";
import type { Restaurant } from "@/shared/models/restaurant.model";
import type { User } from "@/shared/models/user.model";
import {
  authCheckStatus,
  authLogin,
  authRegister,
  authGoogleSignIn,
} from "../actions/auth.actions";

export type AuthStatus = "authenticated" | "unauthenticated" | "checking";

export type AuthState = {
  status: AuthStatus;
  token?: string;
  user?: User;
  restaurant?: Restaurant;

  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: (credential: string) => Promise<boolean>;
  register: (
    data: import("../interfaces/dto/register-user.dto").RegisterUserDto,
  ) => Promise<boolean>;
  checkStatus: () => Promise<void>;
  logout: () => Promise<void>;

  changeStatus: (
    token?: string,
    user?: User,
    currentRestaurant?: Restaurant,
  ) => Promise<boolean>;

  setRestaurant: (restaurant: Restaurant) => void;
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
    console.log("changeStatus", { token, user, currentRestaurant });
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

  loginWithGoogle: async (credential: string) => {
    const resp = await authGoogleSignIn(credential);

    return get().changeStatus(resp?.token, resp?.user, resp?.currentRestaurant);
  },

  register: async (data) => {
    const resp = await authRegister(data);

    return get().changeStatus(resp?.token, resp?.user, resp?.currentRestaurant);
  },

  checkStatus: async () => {
    const resp = await authCheckStatus();

    if (!resp) {
      set({ status: "unauthenticated" });
      return;
    }

    if (resp) {
      get().changeStatus(resp.token, resp.user, resp.currentRestaurant);
      return;
    }

    const token = localStorage.getItem("token");
    if (token) {
      set({ status: "authenticated", token });
    } else {
      set({ status: "unauthenticated" });
    }
  },

  logout: async () => {
    localStorage.removeItem("token");

    set({ status: "unauthenticated", token: undefined, user: undefined });
  },

  setRestaurant: (restaurant: Restaurant) => {
    set({ restaurant });
  },
}));
