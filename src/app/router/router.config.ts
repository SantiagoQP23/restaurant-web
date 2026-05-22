import {
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import App from "../../App";
import { authRoute } from "@/modules/auth/router/auth.router";
import { productionRoute } from "@/modules/production/router/production.router";
import { setupRoute } from "@/modules/setup/router/setup.router";
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
  beforeLoad: async (route) => {
    throw redirect({ to: "/app/orders" });
  },
});

export const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "app",
  component: AppLayout,
  beforeLoad: async (route) => {
    const status = useAuthStore.getState().status;
    if (status === "unauthenticated") {
      throw redirect({ to: "/auth/login" });
    }
  },
});

appRoute.addChildren([
  indexRoute,
  ordersRoute,
  productionRoute,
  settingsRoute,
  tablesRoute,
]);

const routeTree = rootRoute.addChildren([authRoute, setupRoute, appRoute]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
