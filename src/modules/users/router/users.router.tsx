import { appRoute } from "@/app/router/router.config";
import { createRoute } from "@tanstack/react-router";
import { UsersPage } from "../pages/users.page";

export const usersRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "users",
  component: UsersPage,
});
