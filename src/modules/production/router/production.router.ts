import { appRoute, rootRoute } from "@/app/router/router.config";
import { createRoute } from "@tanstack/react-router";
import { ProductionPage } from "../pages/production.page";

export const productionRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "production",
  component: ProductionPage,
});
