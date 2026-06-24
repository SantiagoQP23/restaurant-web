import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/app/api/query-client";
import { AccountsService } from "../services/accounts.service";

export const useAccounts = () => {
  const accountsQuery = useQuery({
    queryKey: queryKeys.accounts.all,
    queryFn: () => AccountsService.getAll(),
  });

  return {
    accountsQuery,
  };
};
