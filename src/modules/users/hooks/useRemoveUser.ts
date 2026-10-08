import { queryClient, queryKeys } from "@/app/api/query-client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { UsersService } from "../services/users.service";
import i18n from "@/app/i18n/i18n.config";
import { getErrorMessage } from "@/shared/lib/errors/get-error-message";

export const useRemoveUser = () => {
  const removeUser = useMutation<void, unknown, string>({
    mutationFn: (userId: string) => UsersService.removeUserFromRestaurant(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      toast.success("Usuario eliminado correctamente");
    },
    onError: (error: unknown) => {
      console.error(error);
      toast.error(
        getErrorMessage(error, { fallback: i18n.t("actionErrors.users.remove") }),
      );
    },
  });

  return {
    removeUser,
  };
};
