import restaurantApi from "@/app/api/restaurant-api";
import type { Printer } from "@/shared/models/printer.model";
import type { CreatePrinterDto } from "../interfaces/dto/create-printer.dto";
import type { UpdatePrinterDto } from "../interfaces/dto/update-printer.dto";

export class PrintersService {
  static getAll = async (): Promise<Printer[]> => {
    const resp = await restaurantApi.get<Printer[]>("/printers");

    return resp.data;
  };

  static create = async (data: CreatePrinterDto) => {
    const resp = await restaurantApi.post<Printer>(`/printers`, data);

    return resp.data;
  };

  static update = async (updatePrinterDto: UpdatePrinterDto) => {
    const { id, ...data } = updatePrinterDto;

    const resp = await restaurantApi.patch<Printer>(`/printers/${id}`, data);

    return resp.data;
  };

  static delete = async (id: string) => {
    await restaurantApi.delete(`/printers/${id}`);
  };

  static test = async (id: string) => {
    await restaurantApi.post(`/printers/${id}/test`);
  };
}
