import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
} from "@/shared/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { formatCurrency } from "@/shared/lib/utils";
import { useBestSellingProducts } from "../hooks/useBestSellingProducts";

interface BestSellingProductsProps {
  startDate: Date;
  endDate: Date;
}

export const BestSellingProducts = ({
  startDate,
  endDate,
}: BestSellingProductsProps) => {
  const { data, isLoading } = useBestSellingProducts({
    startDate,
    endDate,
    limit: 5,
    offset: 0,
  });

  const products = data?.products ?? [];

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-1">
          <CardTitle>Productos</CardTitle>
          <CardDescription>
            Productos más vendidos del periodo
          </CardDescription>
        </div>
        <CardAction>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/app/home/products-reports">
              Ver todo
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardAction>
      </CardHeader>

      <div className="px-6 pb-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead className="text-center">Cantidad</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  Cargando...
                </TableCell>
              </TableRow>
            ) : products.length > 0 ? (
              products.map((product) => (
                <TableRow key={product.productId}>
                  <TableCell>
                    <span className="whitespace-nowrap font-medium">
                      {product.productName}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {product.categoryName}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {product.totalSold}
                  </TableCell>
                  <TableCell className="text-right text-green-600">
                    {formatCurrency(product.totalSold * product.productPrice)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  <span className="text-muted-foreground">
                    No hay datos para mostrar
                  </span>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
