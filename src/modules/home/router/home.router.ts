import { appRoute } from "@/app/router/router.config";
import { createRoute } from "@tanstack/react-router";
import { HomePage } from "../pages/home.page";

export const homeRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "home",
  component: HomePage,
});
