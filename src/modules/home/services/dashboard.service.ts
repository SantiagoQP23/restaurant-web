import restaurantApi from "@/app/api/restaurant-api";

export interface BestSellingProduct {
  productId: string;
  productName: string;
  productPrice: number;
  categoryName: string;
  totalSold: number;
}

export interface BestSellingProductsResponse {
  products: BestSellingProduct[];
  count: number;
}

export interface GetBestSellingProductsFilters {
  startDate: Date;
  endDate: Date;
  limit?: number;
  offset?: number;
}

export class DashboardService {
  static async getBestSellingProducts(
    filters: GetBestSellingProductsFilters,
  ): Promise<BestSellingProductsResponse> {
    const { startDate, endDate, limit = 5, offset = 0 } = filters;

    const resp = await restaurantApi.get<BestSellingProductsResponse>(
      "/orders/best-selling-products/",
      {
        params: {
          period: "custom",
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          limit,
          offset: limit * offset,
        },
      },
    );

    return resp.data;
  }
}
