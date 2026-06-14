import restaurantApi from "@/app/api/restaurant-api";
import type {
  SettingsResponse,
  UpdateSettingsDto,
} from "../interfaces/dto/settings-response.dto";

export class SettingsService {
  static async getSettings(): Promise<SettingsResponse> {
    const resp = await restaurantApi.get<SettingsResponse>(`/settings`);
    return resp.data;
  }

  static async updateSettings(
    data: UpdateSettingsDto,
  ): Promise<SettingsResponse> {
    const resp = await restaurantApi.patch<SettingsResponse>(`/settings`, {
      settings: data,
    });
    return resp.data;
  }
}
