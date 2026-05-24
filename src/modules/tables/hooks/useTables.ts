import { useMutation, useQuery } from "@tanstack/react-query";
import { TablesService } from "../services/tables.service";
import type { Table } from "@/shared/models/table.model";
import { queryClient, queryKeys } from "@/app/api/query-client";
import { toast } from "sonner";
import type { UpdateTableDto } from "../interfaces/dto/update-table.dto";
import type { CreateTableDto } from "../interfaces/dto/create-table.dto";

export const useTables = () => {
  const getAllQuery = useQuery({
    queryKey: ["tables"],
    queryFn: () => TablesService.getAll(),
  });

  const updateTable = useMutation<Table, unknown, UpdateTableDto>({
    mutationFn: (data: UpdateTableDto) => TablesService.updateTable(data),
    onSuccess: () => {
      toast.success("Mesa actualizada correctamente");

      queryClient.invalidateQueries({ queryKey: queryKeys.tables.all });
    },
    onError: () => {
      toast.error("Error al actualizar la mesa");
    },
  });

  const createTable = useMutation<Table, unknown, CreateTableDto>({
    mutationFn: (data: CreateTableDto) => TablesService.createTable(data),
    onSuccess: () => {
      toast.success("Mesa creada correctamente");

      queryClient.invalidateQueries({ queryKey: queryKeys.tables.all });
    },
    onError: () => {
      toast.error("Error al crear la mesa");
    },
  });

  return {
    getAllTablesQuery: getAllQuery,
    createTable,
    updateTable,
  };
};
