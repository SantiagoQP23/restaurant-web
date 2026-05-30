import { queryKeys } from "@/app/api/query-client";
import { useSearch } from "@/shared/hooks/useSearch";
import type { User } from "@/shared/models/user.model";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { UsersService } from "../services/users.service";
import { usePaginationAsync } from "@/shared/hooks/usePaginationAsync";

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);

  const { page, rowsPerPage, handleChangePage, handleChangeRowsPerPage } =
    usePaginationAsync();

  const { search, debouncedSearch, handleChangeSearch } = useSearch();

  const usersQuery = useQuery<{ users: User[]; count: number }>({
    queryKey: queryKeys.users.list({
      offset: page,
      limit: rowsPerPage,
      search,
    }),
    queryFn: () =>
      UsersService.getAll({
        offset: page,
        limit: rowsPerPage,
        search,
      }),
  });

  // Handle Redux integration - dispatch on successful data fetch
  useEffect(() => {
    if (usersQuery.isSuccess && usersQuery.data) {
      setUsers(usersQuery.data.users);
    }
  }, [usersQuery.data, usersQuery.isSuccess]);

  return {
    usersQuery,
    users,
    page,
    search,
    debouncedSearch,

    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    handleChangeSearch,
  };
};
