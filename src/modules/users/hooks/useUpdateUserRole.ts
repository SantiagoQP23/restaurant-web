import { queryClient, queryKeys } from "@/app/api/query-client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { UsersService } from "../services/users.service";
import type { UpdateUserRoleDto } from "../interfaces/dto/update-user-role.dto";

export const useUpdateUserRole = () => {
  const updateUserRole = useMutation<void, unknown, UpdateUserRoleDto>({
    mutationFn: (data: UpdateUserRoleDto) => UsersService.updateUserRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      toast.success("Rol actualizado correctamente");
    },
    onError: (error: unknown) => {
      console.error(error);
      toast.error("No se pudo actualizar el rol");
    },
  });

  return {
    updateUserRole,
  };
};
