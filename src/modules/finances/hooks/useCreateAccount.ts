import { queryClient, queryKeys } from "@/app/api/query-client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { AccountsService } from "../services/accounts.service";
import type { CreateAccountDto } from "../interfaces/dto/create-account.dto";
import type { Account } from "@/shared/models/account.model";
import i18n from "@/app/i18n/i18n.config";
import { getErrorMessage } from "@/shared/lib/errors/get-error-message";

export const useCreateAccount = () => {
  const createAccount = useMutation<Account, unknown, CreateAccountDto>({
    mutationFn: (data: CreateAccountDto) => AccountsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });
      toast.success("Cuenta creada correctamente");
    },
    onError: (error: unknown) => {
      console.error(error);
      toast.error(
        getErrorMessage(error, { fallback: i18n.t("actionErrors.accounts.create") }),
      );
    },
  });

  return {
    createAccount,
  };
};
