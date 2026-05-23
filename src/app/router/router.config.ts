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
} from "@/modules/auth/router/auth.router";
import { productionRoute } from "@/modules/production/router/production.router";
import {
  accountsRoute,
  completeRoute,
  joinRestaurantRoute,
  menuRoute,
  paymentMethodsRoute,
  productionAreasRoute,
  productsRoute,
  restaurantRoute,
  setupRoute,
  staffRoute,
  welcomeRoute,
} from "@/modules/setup/router/setup.router";
import { ordersRoute } from "@/modules/orders/router/orders.router";
import { settingsRoute } from "@/modules/settings/router/settings.router";
import { tablesRoute } from "@/modules/tables/router/tables.router";
import { AppLayout } from "@/shared/layout/app.layout";
import { useAuthStore } from "@/modules/auth/store/auth.store";

export const rootRoute = createRootRoute({
  component: App,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: async () => {
    throw redirect({ to: "/app/orders" });
  },
});

export const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "app",
  component: AppLayout,
  beforeLoad: async () => {
    const status = useAuthStore.getState().status;
    if (status === "unauthenticated") {
      throw redirect({ to: "/auth/login" });
    }
  },
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  authRoute.addChildren([loginRoute, signupRoute]),
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
  ]),
  setupRoute,
  appRoute.addChildren([
    ordersRoute,
    productionRoute,
    settingsRoute,
    tablesRoute,
  ]),
]);

export const router = createRouter({ routeTree });

// declare module "@tanstack/react-router" {
//   interface Register {
//     router: typeof router;
//   }
// }
