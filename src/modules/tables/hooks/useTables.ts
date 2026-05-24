import { useMutation, useQuery } from "@tanstack/react-query";
import { TablesService } from "../services/tables.service";
import type { Table } from "@/shared/models/table.model";
import { queryClient, queryKeys } from "@/app/api/query-client";
import { toast } from "sonner";
import type { UpdateTableDto } from "../interfaces/dto/update-table.dto";
import type { CreateTableDto } from "../interfaces/dto/create-table.dto";
import type { ApiErrorRespDto } from "@/shared/interfaces/dto/api-error-resp.dto";

export const useTables = () => {
  const getAllQuery = useQuery({
    queryKey: ["tables"],
    queryFn: () => TablesService.getAll(),
  });

  const updateTable = useMutation<Table, ApiErrorRespDto, UpdateTableDto>({
    mutationFn: (data: UpdateTableDto) => TablesService.updateTable(data),
    onSuccess: () => {
      toast.success("Mesa actualizada correctamente");

      queryClient.invalidateQueries({ queryKey: queryKeys.tables.all });
    },
    onError: (error) => {
      console.log("Error updating table", error);
      toast.error(error.data.message);
    },
  });

  const createTable = useMutation<Table, ApiErrorRespDto, CreateTableDto>({
    mutationFn: (data: CreateTableDto) => TablesService.createTable(data),
    onSuccess: () => {
      toast.success("Mesa creada correctamente");

      queryClient.invalidateQueries({ queryKey: queryKeys.tables.all });
    },
    onError: (error) => {
      console.log("Error creating table", error);
      toast.error(error.data.message);
    },
  });

  return {
    getAllTablesQuery: getAllQuery,
    createTable,
    updateTable,
  };
};
