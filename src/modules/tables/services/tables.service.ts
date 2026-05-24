import restaurantApi from "@/app/api/restaurant-api";
import type { Table } from "@/shared/models/table.model";

export class TablesService {
  static getAll = async (): Promise<Table[]> => {
    const resp = await restaurantApi.get<Table[]>("/tables");

    return resp.data;
  };
}
