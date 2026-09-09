import { rootRoute } from "@/app/router/router.config";
import { createRoute, redirect } from "@tanstack/react-router";
import { LoginPage } from "../pages/login.page";
import SignupPage from "../pages/signup.page";
import ForgotPasswordPage from "../pages/forgot-password.page";
import ResetPasswordPage from "../pages/reset-password.page";
import DeleteAccountPage from "../pages/delete-account.page";
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

export const forgotPasswordRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "forgot-password",
  component: ForgotPasswordPage,
});

export const resetPasswordRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "reset-password/$token",
  component: ResetPasswordPage,
});

export const deleteAccountRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "delete-account",
  component: DeleteAccountPage,
});
