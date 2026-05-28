import { appRoute } from "@/app/router/router.config";
import { createRoute } from "@tanstack/react-router";
import { MenuPage } from "../pages/menu.page";

export const menuRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "menu",
});

const indexRoute = createRoute({
  getParentRoute: () => menuRoute,
  path: "/",
  component: MenuPage,
});

menuRoute.addChildren([indexRoute]);
