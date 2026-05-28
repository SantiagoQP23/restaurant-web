import type { Section } from "@/shared/models/section.model";
import type { UpdateSectionDto } from "../interface/dto/update-section.dto";
import restaurantApi from "@/app/api/restaurant-api";
import type { CreateSectionDto } from "../interface/dto/create-section.dto";
export class SectionsService {
  static getAll = async (restaurantId: string) => {
    const resp = await restaurantApi.get<Section[]>(
      `/sections/${restaurantId}`,
    );
    return resp.data;
  };

  static create = async (data: CreateSectionDto): Promise<Section> => {
    const resp = await restaurantApi.post<Section>("/sections", data);

    return resp.data;
  };

  static update = async (
    id: string,
    data: UpdateSectionDto,
  ): Promise<Section> => {
    const resp = await restaurantApi.patch<Section>(`/sections/${id}`, data);

    return resp.data;
  };
}
