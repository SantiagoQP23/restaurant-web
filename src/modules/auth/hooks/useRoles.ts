import { queryKeys } from "@/app/api/query-client";
import type { Role } from "@/shared/models/role.model";
import { useQuery } from "@tanstack/react-query";
import { RolesService } from "../services/roles.service";

export const useRoles = () => {
  const rolesQuery = useQuery<Role[]>({
    queryKey: queryKeys.roles.all,
    queryFn: () => RolesService.getAll(),
  });

  return {
    rolesQuery,
  };
};
