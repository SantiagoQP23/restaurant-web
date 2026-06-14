import { appRoute } from "@/app/router/router.config";
import { createRoute } from "@tanstack/react-router";
import { SettingsLayout } from "../layout/settings.layout";
import { RestaurantSettingsPage } from "../pages/restaurant-settings.page";
import { ProductsPage } from "@/modules/setup/pages/products.page";
import { PaymentMethodsPage } from "@/modules/setup/pages/payment-methods.page";
import { TablesSettings } from "../views/tables-settings.view";
import { PrintersPage } from "../pages/printers.page";
import { ProductionAreasPage } from "../pages/production-areas.page";

export const settingsRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "settings",
  component: SettingsLayout,
});

const restaurantRoute = createRoute({
  getParentRoute: () => settingsRoute,
  path: "restaurant",
  component: RestaurantSettingsPage,
});

const settingsIndexRoute = createRoute({
  getParentRoute: () => settingsRoute,
  path: "/",
  component: RestaurantSettingsPage,
});

const productionAreasRoute = createRoute({
  getParentRoute: () => settingsRoute,
  path: "production-areas",
  component: ProductionAreasPage,
});

const productsRoute = createRoute({
  getParentRoute: () => settingsRoute,
  path: "products",
  component: ProductsPage,
});

const tablesRoute = createRoute({
  getParentRoute: () => settingsRoute,
  path: "tables",
  component: TablesSettings,
});

const printersRoute = createRoute({
  getParentRoute: () => settingsRoute,
  path: "printers",
  component: PrintersPage,
});

const paymentMethodsRoute = createRoute({
  getParentRoute: () => settingsRoute,
  path: "payment-methods",
  component: PaymentMethodsPage,
});

settingsRoute.addChildren([
  settingsIndexRoute,
  restaurantRoute,
  productionAreasRoute,
  productsRoute,
  tablesRoute,
  printersRoute,
  paymentMethodsRoute,
]);
