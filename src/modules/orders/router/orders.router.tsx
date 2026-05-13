import { appRoute } from "@/app/router/router.config";
import { createRoute } from "@tanstack/react-router";
import { OrdersPage } from "../pages/orders.page";

export const ordersRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "orders",
});
const indexRoute = createRoute({
  getParentRoute: () => ordersRoute,
  path: "/",
  component: OrdersPage,
});

ordersRoute.addChildren([indexRoute]);
