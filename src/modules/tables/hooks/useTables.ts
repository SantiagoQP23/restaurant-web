import { useQuery } from "@tanstack/react-query";
import { TablesService } from "../services/tables.service";

export const useTables = () => {
  const getAllQuery = useQuery({
    queryKey: ["tables"],
    queryFn: () => TablesService.getAll(),
  });

  return {
    getAllTablesQuery: getAllQuery,
  };
};
