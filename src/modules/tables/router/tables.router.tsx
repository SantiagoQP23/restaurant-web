import { appRoute } from "@/app/router/router.config";
import { createRoute } from "@tanstack/react-router";
import { TablesPage } from "../pages/tables.page";

export const tablesRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "tables",
  component: TablesPage,
});
