import { queryClient, queryKeys } from "@/app/api/query-client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { UsersService } from "../services/users.service";
import type { UpdateUserRoleDto } from "../interfaces/dto/update-user-role.dto";
import i18n from "@/app/i18n/i18n.config";
import { getErrorMessage } from "@/shared/lib/errors/get-error-message";

export const useUpdateUserRole = () => {
  const updateUserRole = useMutation<void, unknown, UpdateUserRoleDto>({
    mutationFn: (data: UpdateUserRoleDto) => UsersService.updateUserRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      toast.success("Rol actualizado correctamente");
    },
    onError: (error: unknown) => {
      console.error(error);
      toast.error(
        getErrorMessage(error, { fallback: i18n.t("actionErrors.users.updateRole") }),
      );
    },
  });

  return {
    updateUserRole,
  };
};
