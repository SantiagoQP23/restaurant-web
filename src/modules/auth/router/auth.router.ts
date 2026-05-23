import { rootRoute } from "@/app/router/router.config";
import { createRoute, redirect } from "@tanstack/react-router";
import { LoginPage } from "../pages/login.page";
import SignupPage from "../pages/signup.page";
import { useAuthStore } from "@/modules/auth/store/auth.store";

export const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "auth",
  beforeLoad: async () => {
    const status = useAuthStore.getState().status;
    if (status === "authenticated") {
      throw redirect({ to: "/app/orders" });
    }
  },
});

export const loginRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "login",
  component: LoginPage,
});

export const signupRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "signup",
  component: SignupPage,
});
