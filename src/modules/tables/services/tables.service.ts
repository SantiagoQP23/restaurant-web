import restaurantApi from "@/app/api/restaurant-api";
import type { Table } from "@/shared/models/table.model";
import type { UpdateTableDto } from "../interfaces/dto/update-table.dto";
import type { CreateTableDto } from "../interfaces/dto/create-table.dto";

export class TablesService {
  static getAll = async (): Promise<Table[]> => {
    const resp = await restaurantApi.get<Table[]>("/tables");

    return resp.data;
  };

  static updateTable = async (
    updateTableDto: UpdateTableDto,
  ): Promise<Table> => {
    const { id, ...data } = updateTableDto;

    const resp = await restaurantApi.patch<Table>(`/tables/${id}`, data);

    return resp.data;
  };

  static createTable = async (data: CreateTableDto) => {
    const resp = await restaurantApi.post<Table>(`/tables`, data);

    return resp.data;
  };
}
