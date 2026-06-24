import { queryClient, queryKeys } from "@/app/api/query-client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { AccountsService } from "../services/accounts.service";
import type { UpdateAccountDto } from "../interfaces/dto/update-account.dto";
import type { Account } from "@/shared/models/account.model";

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
      toast.error("No se pudo actualizar la cuenta");
    },
  });

  return {
    updateAccount,
  };
};
