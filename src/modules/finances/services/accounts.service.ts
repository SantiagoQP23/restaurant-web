import restaurantApi from "@/app/api/restaurant-api";
import type { Account } from "@/shared/models/account.model";
import type { CreateAccountDto } from "../interfaces/dto/create-account.dto";
import type { UpdateAccountDto } from "../interfaces/dto/update-account.dto";

export class AccountsService {
  static getAll = async (): Promise<Account[]> => {
    const resp = await restaurantApi.get<Account[]>(`accounts`);
    return resp.data;
  };

  static create = async (dto: CreateAccountDto): Promise<Account> => {
    const resp = await restaurantApi.post<Account>(`accounts`, dto);
    return resp.data;
  };

  static update = async (id: number, dto: UpdateAccountDto): Promise<Account> => {
    const resp = await restaurantApi.patch<Account>(`accounts/${id}`, dto);
    return resp.data;
  };

  static delete = async (id: number): Promise<void> => {
    const resp = await restaurantApi.delete<void>(`accounts/${id}`);
    return resp.data;
  };
}
