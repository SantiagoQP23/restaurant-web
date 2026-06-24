import { queryClient, queryKeys } from "@/app/api/query-client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { AccountsService } from "../services/accounts.service";
import type { CreateAccountDto } from "../interfaces/dto/create-account.dto";
import type { Account } from "@/shared/models/account.model";

export const useCreateAccount = () => {
  const createAccount = useMutation<Account, unknown, CreateAccountDto>({
    mutationFn: (data: CreateAccountDto) => AccountsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });
      toast.success("Cuenta creada correctamente");
    },
    onError: (error: unknown) => {
      console.error(error);
      toast.error("No se pudo crear la cuenta");
    },
  });

  return {
    createAccount,
  };
};
