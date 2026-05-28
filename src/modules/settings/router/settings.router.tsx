import { appRoute } from "@/app/router/router.config";
import { createRoute } from "@tanstack/react-router";
import { SettingsLayout } from "../pages/settings.page";
import { RestaurantSettingsPage } from "../pages/restaurant-settings.page";
import { ProductionAreasPage } from "@/modules/setup/pages/production-areas.page";
import { ProductsPage } from "@/modules/setup/pages/products.page";
import { AccountsPage } from "@/modules/setup/pages/accounts.page";
import { PaymentMethodsPage } from "@/modules/setup/pages/payment-methods.page";
import { StaffPage } from "@/modules/setup/pages/staff.page";
import { TablesSettings } from "../views/tables-settings.view";

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

const accountsRoute = createRoute({
  getParentRoute: () => settingsRoute,
  path: "accounts",
  component: AccountsPage,
});

const paymentMethodsRoute = createRoute({
  getParentRoute: () => settingsRoute,
  path: "payment-methods",
  component: PaymentMethodsPage,
});

const staffRoute = createRoute({
  getParentRoute: () => settingsRoute,
  path: "staff",
  component: StaffPage,
});

settingsRoute.addChildren([
  settingsIndexRoute,
  restaurantRoute,
  productionAreasRoute,
  productsRoute,
  tablesRoute,
  accountsRoute,
  paymentMethodsRoute,
  staffRoute,
]);
