import { rootRoute } from "@/app/router/router.config";
import { createRoute, redirect } from "@tanstack/react-router";
import { AccountsPage } from "../pages/accounts.page";
import { CompletePage } from "../pages/complete.page";
import { MenuPage } from "../pages/menu.page";
import { PaymentMethodsPage } from "../pages/payment-methods.page";
import { ProductionAreasPage } from "../pages/production-areas.page";
import { ProductsPage } from "../pages/products.page";
import { RestaurantPage } from "../pages/restaurant.page";
import { StaffPage } from "../pages/staff.page";
import { TablesPage } from "../pages/tables.page";
import { WelcomePage } from "../pages/welcome.page";
import { JoinRestaurantPage } from "../pages/join-restaurant.page";

import { useAuthStore } from "@/modules/auth/store/auth.store";

export const setupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "setup",
  beforeLoad: async (route) => {
    const status = useAuthStore.getState().status;
    if (status === "unauthenticated") {
      throw redirect({ to: "/auth/login" });
    }
  },
});

const welcomeRoute = createRoute({
  getParentRoute: () => setupRoute,
  path: "welcome",
  component: WelcomePage,
});

const restaurantRoute = createRoute({
  getParentRoute: () => setupRoute,
  path: "restaurant",
  component: RestaurantPage,
});

const joinRestaurantRoute = createRoute({
  getParentRoute: () => setupRoute,
  path: "join-restaurant",
  component: JoinRestaurantPage,
});

const productionAreasRoute = createRoute({
  getParentRoute: () => setupRoute,
  path: "production-areas",
  component: ProductionAreasPage,
});

const menuRoute = createRoute({
  getParentRoute: () => setupRoute,
  path: "menu",
  component: MenuPage,
});

const productsRoute = createRoute({
  getParentRoute: () => setupRoute,
  path: "products",
  component: ProductsPage,
});

const tablesRoute = createRoute({
  getParentRoute: () => setupRoute,
  path: "tables",
  component: TablesPage,
});

const accountsRoute = createRoute({
  getParentRoute: () => setupRoute,
  path: "accounts",
  component: AccountsPage,
});

const paymentMethodsRoute = createRoute({
  getParentRoute: () => setupRoute,
  path: "payment-methods",
  component: PaymentMethodsPage,
});

const staffRoute = createRoute({
  getParentRoute: () => setupRoute,
  path: "staff",
  component: StaffPage,
});

const completeRoute = createRoute({
  getParentRoute: () => setupRoute,
  path: "complete",
  component: CompletePage,
});

setupRoute.addChildren([
  welcomeRoute,
  restaurantRoute,
  joinRestaurantRoute,
  productionAreasRoute,
  menuRoute,
  productsRoute,
  tablesRoute,
  accountsRoute,
  paymentMethodsRoute,
  staffRoute,
  completeRoute,
]);
