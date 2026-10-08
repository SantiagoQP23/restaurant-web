import { queryClient, queryKeys } from "@/app/api/query-client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { AccountsService } from "../services/accounts.service";
import type { UpdateAccountDto } from "../interfaces/dto/update-account.dto";
import type { Account } from "@/shared/models/account.model";
import i18n from "@/app/i18n/i18n.config";
import { getErrorMessage } from "@/shared/lib/errors/get-error-message";

export const useUpdateAccount = () => {
  const updateAccount = useMutation<
    Account,
    unknown,
    { id: number; dto: UpdateAccountDto }
  >({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateAccountDto }) =>
      AccountsService.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });
      toast.success("Cuenta actualizada correctamente");
    },
    onError: (error: unknown) => {
      console.error(error);
      toast.error(
        getErrorMessage(error, { fallback: i18n.t("actionErrors.accounts.update") }),
      );
    },
  });

  return {
    updateAccount,
  };
};
