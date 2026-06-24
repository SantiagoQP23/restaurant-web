import { queryClient, queryKeys } from "@/app/api/query-client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { AccountsService } from "../services/accounts.service";

export const useDeleteAccount = () => {
  const deleteAccount = useMutation<void, unknown, number>({
    mutationFn: (id: number) => AccountsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });
      toast.success("Cuenta eliminada correctamente");
    },
    onError: (error: unknown) => {
      console.error(error);
      toast.error("No se pudo eliminar la cuenta");
    },
  });

  return {
    deleteAccount,
  };
};
