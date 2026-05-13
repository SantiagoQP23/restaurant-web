import { rootRoute } from "@/app/router/router.config";
import { createRoute } from "@tanstack/react-router";
import { LoginPage } from "../pages/login.page";
import SignupPage from "../pages/signup.page";

export const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "auth",
});

const loginRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "login",
  component: LoginPage,
});

const signupRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "signup",
  component: SignupPage,
});

authRoute.addChildren([loginRoute, signupRoute]);
