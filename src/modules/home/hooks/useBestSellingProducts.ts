import { useQuery } from "@tanstack/react-query";
import {
  DashboardService,
  type BestSellingProductsResponse,
  type GetBestSellingProductsFilters,
} from "../services/dashboard.service";

export const useBestSellingProducts = (filters: GetBestSellingProductsFilters) => {
  return useQuery<BestSellingProductsResponse>({
    queryKey: ["best-selling-products", filters],
    queryFn: () => DashboardService.getBestSellingProducts(filters),
  });
};
