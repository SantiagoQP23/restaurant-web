import restaurantApi from "@/app/api/restaurant-api";
import type { ProductionArea } from "@/shared/models/production-area.model";

export class ProductionAreasService {
  static create(createProductionAreaDto: any) {
    return "This action adds a new productionArea";
  }

  static async getAll() {
    const resp = await restaurantApi.get<ProductionArea[]>(`production-areas/`);

    return resp.data;
  }

  findOne(id: number) {
    return `This action returns a #${id} productionArea`;
  }
  update(id: number, updateProductionAreaDto: any) {
    return `This action updates a #${id} productionArea`;
  }
  remove(id: number) {
    return `This action removes a #${id} productionArea`;
  }
}
