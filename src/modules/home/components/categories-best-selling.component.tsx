import { Card, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { formatCurrency } from "@/shared/lib/utils";
import type { BestSellingCategoriesResponse } from "../services/dashboard.service";
import type { UseQueryResult } from "@tanstack/react-query";

interface Props {
  categoriesQuery: UseQueryResult<BestSellingCategoriesResponse, Error>;
}

export const CategoriesBestSelling = ({ categoriesQuery }: Props) => {
  const categories = categoriesQuery.data?.categories ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Categorías más vendidas</CardTitle>
      </CardHeader>

      <div className="px-6 pb-6 space-y-3">
        {categoriesQuery.isLoading ? (
          <p className="text-center text-muted-foreground">Cargando...</p>
        ) : categories.length > 0 ? (
          categories.map((category) => (
            <div
              key={category.categoryId}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex flex-col gap-0.5">
                <span className="font-medium">{category.categoryName}</span>
                <span className="text-xs text-muted-foreground">
                  Cantidad: {category.totalSold}
                </span>
              </div>
              <Badge variant="secondary">{formatCurrency(category.totalAmountSold)}</Badge>
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground">
            No hay datos para mostrar
          </p>
        )}
      </div>
    </Card>
  );
};
