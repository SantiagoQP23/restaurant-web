import { rootRoute } from "@/app/router/router.config";
import { createRoute, redirect } from "@tanstack/react-router";
import { AccountsPage } from "../pages/accounts.page";
import { CompletePage } from "../pages/complete.page";
import { MenuSetupPage } from "../pages/menu-setup.page";
import { PaymentMethodsPage } from "../pages/payment-methods.page";
import { ProductsPage } from "../pages/products.page";
import { StaffPage } from "../pages/staff.page";
import { TablesPage } from "../pages/tables.page";
import { WelcomePage } from "../pages/welcome.page";
import { JoinRestaurantPage } from "../pages/join-restaurant.page";

import { useAuthStore } from "@/modules/auth/store/auth.store";
import { SetupProductionAreasPage } from "../pages/setup-production-areas.page";
import { CreateRestaurantPage } from "../pages/create-restaurant.page";

export const setupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "setup",
  beforeLoad: async () => {
    const status = useAuthStore.getState().status;
    if (status === "unauthenticated") {
      throw redirect({ to: "/auth/login" });
    }
  },
});

export const welcomeRoute = createRoute({
  getParentRoute: () => setupRoute,
  path: "welcome",
  component: WelcomePage,
});

export const restaurantRoute = createRoute({
  getParentRoute: () => setupRoute,
  path: "restaurant",
  component: CreateRestaurantPage,
});

export const joinRestaurantRoute = createRoute({
  getParentRoute: () => setupRoute,
  path: "join-restaurant",
  component: JoinRestaurantPage,
});

export const productionAreasRoute = createRoute({
  getParentRoute: () => setupRoute,
  path: "production-areas",
  component: SetupProductionAreasPage,
});

export const menuRoute = createRoute({
  getParentRoute: () => setupRoute,
  path: "menu",
  component: MenuSetupPage,
});

export const productsRoute = createRoute({
  getParentRoute: () => setupRoute,
  path: "products",
  component: ProductsPage,
});

export const tablesRoute = createRoute({
  getParentRoute: () => setupRoute,
  path: "tables",
  component: TablesPage,
});

export const accountsRoute = createRoute({
  getParentRoute: () => setupRoute,
  path: "accounts",
  component: AccountsPage,
});

export const paymentMethodsRoute = createRoute({
  getParentRoute: () => setupRoute,
  path: "payment-methods",
  component: PaymentMethodsPage,
});

export const staffRoute = createRoute({
  getParentRoute: () => setupRoute,
  path: "staff",
  component: StaffPage,
});

export const completeRoute = createRoute({
  getParentRoute: () => setupRoute,
  path: "complete",
  component: CompletePage,
});
