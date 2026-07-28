import {
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import App from "../../App";
import {
  authRoute,
  loginRoute,
  signupRoute,
  forgotPasswordRoute,
  resetPasswordRoute,
} from "@/modules/auth/router/auth.router";
import { productionRoute } from "@/modules/production/router/production.router";
import {
  accountsRoute,
  completeRoute,
  joinRestaurantRoute,
  menuRoute as setupMenuRoute,
  paymentMethodsRoute,
  productionAreasRoute,
  productsRoute,
  restaurantRoute,
  setupRoute,
  staffRoute,
  welcomeRoute,
  tablesSetupRoute,
} from "@/modules/setup/router/setup.router";
import { ordersRoute } from "@/modules/orders/router/orders.router";
import { settingsRoute } from "@/modules/settings/router/settings.router";
import { tablesRoute } from "@/modules/tables/router/tables.router";
import { menuRoute } from "@/modules/menu/router/menu.router";
import { AppLayout } from "@/shared/layout/app.layout";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { usersRoute } from "@/modules/users/router/users.router";
import {
  homeRoute,
  productsReportsRoute,
} from "@/modules/home/router/home.router";

export const rootRoute = createRootRoute({
  component: App,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: async () => {
    const restaurant = useAuthStore.getState().restaurant;
    if (!restaurant) {
      throw redirect({ to: "/setup/welcome" });
    }
    throw redirect({ to: "/app/home" });
  },
});

export const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "app",
  component: AppLayout,
  beforeLoad: async () => {
    const status = useAuthStore.getState().status;
    const restaurant = useAuthStore.getState().restaurant;
    if (status === "unauthenticated") {
      throw redirect({ to: "/auth/login" });
    } else if (status === "authenticated") {
      if (!restaurant) {
        throw redirect({ to: "/setup/welcome" });
      }
    }
  },
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  authRoute.addChildren([loginRoute, signupRoute, forgotPasswordRoute, resetPasswordRoute]),
  setupRoute.addChildren([
    welcomeRoute,
    restaurantRoute,
    joinRestaurantRoute,
    productionAreasRoute,
    setupMenuRoute,
    productsRoute,
    tablesSetupRoute,
    accountsRoute,
    paymentMethodsRoute,
    staffRoute,
    completeRoute,
  ]),
  appRoute.addChildren([
    homeRoute,
    productsReportsRoute,
    ordersRoute,
    productionRoute,
    menuRoute,
    settingsRoute,
    tablesRoute,
    usersRoute,
  ]),
]);

export const router = createRouter({ routeTree });

// declare module "@tanstack/react-router" {
//   interface Register {
//     router: typeof router;
//   }
// }
