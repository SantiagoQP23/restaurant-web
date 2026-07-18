import { appRoute } from "@/app/router/router.config";
import { createRoute } from "@tanstack/react-router";
import { HomePage } from "../pages/home.page";
import { ProductsReportsPage } from "../pages/products-reports.page";

export const homeRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "home",
  component: HomePage,
});

export const productsReportsRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "home/products-reports",
  component: ProductsReportsPage,
});
