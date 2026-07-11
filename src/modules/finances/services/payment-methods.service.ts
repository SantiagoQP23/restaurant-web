import restaurantApi from "@/app/api/restaurant-api";
import type { PaymentMethod } from "@/shared/models/payment-method.model";
import type { CreatePaymentMethodDto } from "../interfaces/dto/create-payment-method.dto";
import type { UpdatePaymentMethodDto } from "../interfaces/dto/update-payment-method.dto";

export class PaymentMethodsService {
  static getAll = async (): Promise<PaymentMethod[]> => {
    const resp = await restaurantApi.get<PaymentMethod[]>(`payment-methods`);
    return resp.data;
  };

  static create = async (dto: CreatePaymentMethodDto): Promise<PaymentMethod> => {
    const resp = await restaurantApi.post<PaymentMethod>(`payment-methods`, dto);
    return resp.data;
  };

  static update = async (
    id: number,
    dto: UpdatePaymentMethodDto,
  ): Promise<PaymentMethod> => {
    const resp = await restaurantApi.patch<PaymentMethod>(
      `payment-methods/${id}`,
      dto,
    );
    return resp.data;
  };

  static delete = async (id: number): Promise<void> => {
    const resp = await restaurantApi.delete<void>(`payment-methods/${id}`);
    return resp.data;
  };
}
