import restaurantApi from "@/app/api/restaurant-api";
import type { ProductionArea } from "@/shared/models/production-area.model";
import type { CreateProductionAreaDto } from "../interfaces/dto/create-production-area.dto";
import type { UpdateProductionAreaDto } from "../interfaces/dto/update-production-area.dto";

export class ProductionAreasService {
  static async getAll() {
    const resp = await restaurantApi.get<ProductionArea[]>(`production-areas/`);

    return resp.data;
  }

  static async create(data: CreateProductionAreaDto) {
    const resp = await restaurantApi.post<ProductionArea>(`production-areas/`, data);

    return resp.data;
  }

  static async update(data: UpdateProductionAreaDto) {
    const { id, ...updateData } = data;
    const resp = await restaurantApi.patch<ProductionArea>(`production-areas/${id}`, updateData);

    return resp.data;
  }

  static async delete(id: number) {
    await restaurantApi.delete(`production-areas/${id}`);
  }
}
