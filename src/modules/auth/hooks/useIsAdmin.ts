import { isAdminLevelRole } from "@/shared/models/roles";
import { useAuthStore } from "../store/auth.store";

/** Role in the current restaurant is owner or admin. */
export const useIsAdmin = () =>
  useAuthStore((state) => isAdminLevelRole(state.user?.role?.name));
