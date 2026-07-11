import type { UserFiltersDto } from "@/modules/users/interfaces/dto/user-filters.dto";
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

export const queryKeys = {
  // Users module
  users: {
    all: ["users"] as const,
    lists: () => ["users", "list"] as const,
    list: (filters: UserFiltersDto) => ["users", "list", filters] as const,
    suggestions: (search: string) => ["users-suggestions", search] as const,
    detail: (id: string) => ["user", id] as const,
  },

  // Tables module
  tables: {
    all: ["tables"] as const,
    // lists: () => ['tables', 'list'] as const,
    // list: (filters?: TableFilters) => ['tables', 'list', filters] as const,
    // detail: (id: string) => ['table', id] as const
  },
  menu: {
    all: ["menu"] as const,
    detail: (restaurantId: string) => ["menu", restaurantId] as const,
  },
  roles: {
    all: ["roles"] as const,
  },
  accounts: {
    all: ["accounts"] as const,
  },
  paymentMethods: {
    all: ["payment-methods"] as const,
  },
} as const;
