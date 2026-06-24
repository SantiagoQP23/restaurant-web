import { queryClient, queryKeys } from "@/app/api/query-client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { UsersService } from "../services/users.service";

export const useRemoveUser = () => {
  const removeUser = useMutation<void, unknown, string>({
    mutationFn: (userId: string) => UsersService.removeUserFromRestaurant(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      toast.success("Usuario eliminado correctamente");
    },
    onError: (error: unknown) => {
      console.error(error);
      toast.error("No se pudo eliminar el usuario");
    },
  });

  return {
    removeUser,
  };
};
