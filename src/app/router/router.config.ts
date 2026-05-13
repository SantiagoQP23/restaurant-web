import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import App from "../../App";
import { authRoute } from "@/modules/auth/router/auth.router";
import { productionRoute } from "@/modules/production/router/production.router";
import { setupRoute } from "@/modules/setup/router/setup.router";
import { ordersRoute } from "@/modules/orders/router/orders.router";
import { settingsRoute } from "@/modules/settings/router/settings.router";
import { tablesRoute } from "@/modules/tables/router/tables.router";
import { AppLayout } from "@/shared/layout/app.layout";

export const rootRoute = createRootRoute({
  component: App,
});

export const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "app",
  component: AppLayout,
});

appRoute.addChildren([ordersRoute, productionRoute, settingsRoute, tablesRoute]);

const routeTree = rootRoute.addChildren([authRoute, setupRoute, appRoute]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
