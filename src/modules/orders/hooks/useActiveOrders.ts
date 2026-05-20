import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { useOrdersStore } from "../store/orders.store";
import { useAuthStore } from "@/modules/auth/store/auth.store";

import { OrdersService } from "../services/orders.service";

export const useActiveOrders = () => {
  console.log("[useActiveOrders] Hook called");
  const setOrders = useOrdersStore((state) => state.setOrders);
  const { restaurant } = useAuthStore((state) => state);

  const activeOrdersQuery = useQuery({
    queryKey: ["activeOrders", restaurant?.id],
    queryFn: async () => {
      console.log(
        `[useActiveOrders] Fetching orders for restaurant: ${restaurant?.id}`,
      );
      const result = await OrdersService.getActiveOrders();
      console.log(`[useActiveOrders] Fetched ${result.length} orders`);
      return result;
    },
    enabled: !!restaurant?.id,
    staleTime: 0, // Always consider data stale to ensure refetch on restaurant change
  });

  useEffect(() => {
    // Always sync the query data with the store, even if it's empty
    if (activeOrdersQuery.data !== undefined) {
      console.log(
        `[useActiveOrders] Setting active orders for restaurant ${restaurant?.id}:`,
        activeOrdersQuery.data.length,
      );
      setOrders(activeOrdersQuery.data);
    }
  }, [activeOrdersQuery.data, setOrders, restaurant?.id]);

  return {
    activeOrdersQuery,
    refetchOrders: activeOrdersQuery.refetch,
    isRefetching: activeOrdersQuery.isRefetching,
  };
};
