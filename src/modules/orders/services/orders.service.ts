import restaurantApi from "@/app/api/restaurant-api";
import type { Order } from "@/shared/models/order.model";

export class OrdersService {
  static async getActiveOrders(): Promise<Order[]> {
    const resp = await restaurantApi.get<Order[]>("/orders/actives", {
      params: {
        limit: 50,
        offset: 0,
        startDate: new Date("01-01-2025"),
        period: "yearly",
      },
    });
    return resp.data;
  }

  static async getOrderById(orderId: string): Promise<Order> {
    const resp = await restaurantApi.get<Order>(`/orders/${orderId}`);
    return resp.data;
  }

  // static async getDashboardStats(): Promise<DashboardStatsDto> {
  //   const resp = await restaurantApi.get<DashboardStatsDto>(
  //     "/orders/daily-summary",
  //   );
  //   return resp.data;
  // }
  //
  // static async getDailyReport(
  //   filters?: FilterDailyReportDto,
  // ): Promise<DailyReportResponseDto> {
  //   const resp = await restaurantApi.get<DailyReportResponseDto>(
  //     "/orders/daily-report",
  //     {
  //       params: filters,
  //     },
  //   );
  //   return resp.data;
  // }

  // static async getOrderHistory(
  //   filters?: OrderHistoryFiltersDto,
  // ): Promise<OrderHistoryRespDto> {
  //   const resp = await restaurantApi.get<OrderHistoryRespDto>("/orders", {
  //     params: { ...filters, period: "custom" },
  //   });
  //   return resp.data;
  // }
}
