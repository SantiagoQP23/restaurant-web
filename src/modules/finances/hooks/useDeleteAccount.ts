import { queryClient, queryKeys } from "@/app/api/query-client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { AccountsService } from "../services/accounts.service";
import i18n from "@/app/i18n/i18n.config";
import { getErrorMessage } from "@/shared/lib/errors/get-error-message";

export const useDeleteAccount = () => {
  const deleteAccount = useMutation<void, unknown, number>({
    mutationFn: (id: number) => AccountsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });
      toast.success("Cuenta eliminada correctamente");
    },
    onError: (error: unknown) => {
      console.error(error);
      toast.error(
        getErrorMessage(error, { fallback: i18n.t("actionErrors.accounts.delete") }),
      );
    },
  });

  return {
    deleteAccount,
  };
};
