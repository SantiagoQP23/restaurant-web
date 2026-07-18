import { useEffect } from "react";
import { Printer } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Label } from "@/shared/components/ui/label";
import { formatCurrency } from "@/shared/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
  DashboardService,
  type BestSellingProductsResponse,
  type BestSellingCategoriesResponse,
} from "../services/dashboard.service";
import { useFilterSoldProducts } from "../hooks/useFilterSoldProducts";
import { usePaginationAsync } from "../hooks/usePaginationAsync";
import { CategoriesBestSelling } from "../components/categories-best-selling.component";

export const ProductsReportsPage = () => {
  const filters = useFilterSoldProducts("daily");
  const { period, startDate, endDate, handleChangePeriod, handleChangeStartDate, handleChangeEndDate } =
    filters;

  const { page, rowsPerPage, handleChangePage, handleChangeRowsPerPage } =
    usePaginationAsync(10);

  const productsQuery = useQuery<BestSellingProductsResponse>({
    queryKey: [
      "best-selling-products-reports",
      { startDate, endDate, offset: page, limit: rowsPerPage },
    ],
    queryFn: () =>
      DashboardService.getBestSellingProducts({
        startDate,
        endDate,
        offset: page,
        limit: rowsPerPage,
      }),
  });

  const categoriesQuery = useQuery<BestSellingCategoriesResponse>({
    queryKey: [
      "best-selling-categories-reports",
      { startDate, endDate, offset: page, limit: rowsPerPage },
    ],
    queryFn: () =>
      DashboardService.getBestSellingCategories({
        startDate,
        endDate,
        offset: page,
        limit: rowsPerPage,
      }),
  });

  useEffect(() => {
    productsQuery.refetch();
    categoriesQuery.refetch();
  }, [page, rowsPerPage, period, startDate, endDate]);

  const products = productsQuery.data?.products ?? [];
  const totalCount = productsQuery.data?.count ?? 0;
  const totalPages = Math.ceil(totalCount / rowsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Productos</h1>
        <Button variant="outline" size="sm">
          <Printer className="mr-1 h-4 w-4" />
          Imprimir
        </Button>
      </div>

      {/* Summary Cards - commented out for now
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Secciones</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/app/menu">
                  <Settings className="h-4 w-4" />
                  <span className="sr-only">Administrar</span>
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold">{sectionsCount}</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Categorías</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/app/menu">
                  <Settings className="h-4 w-4" />
                  <span className="sr-only">Administrar</span>
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold">{categoriesCount}</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Productos</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/app/menu">
                  <Settings className="h-4 w-4" />
                  <span className="sr-only">Administrar</span>
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold">{productsCount}</span>
          </CardContent>
        </Card>
      </div>
      */}

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-1.5">
          <Label>Periodo</Label>
          <Select
            value={period}
            onValueChange={(v) => handleChangePeriod(v as typeof period)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Diario</SelectItem>
              <SelectItem value="monthly">Mensual</SelectItem>
              <SelectItem value="yearly">Anual</SelectItem>
              <SelectItem value="custom">Personalizado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Fecha de inicio</Label>
          <input
            type="date"
            value={startDate.toISOString().split("T")[0]}
            onChange={(e) => handleChangeStartDate(new Date(e.target.value))}
            className="h-9 rounded-3xl border border-input bg-input/50 px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
          />
        </div>

        {period === "custom" && (
          <div className="flex flex-col gap-1.5">
            <Label>Fecha de fin</Label>
            <input
              type="date"
              value={endDate.toISOString().split("T")[0]}
              onChange={(e) => handleChangeEndDate(new Date(e.target.value))}
              className="h-9 rounded-3xl border border-input bg-input/50 px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
            />
          </div>
        )}
      </div>

      {/* Products Table & Categories */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Productos más vendidos</CardTitle>
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
                {productsQuery.isLoading ? (
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
                        {formatCurrency(
                          product.totalSold * product.productPrice,
                        )}
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

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Filas por página:
                </span>
                <Select
                  value={String(rowsPerPage)}
                  onValueChange={(v) => handleChangeRowsPerPage(Number(v))}
                >
                  <SelectTrigger className="w-[80px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[10, 25, 50, 100].map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 0}
                  onClick={() => handleChangePage(page - 1)}
                >
                  Anterior
                </Button>
                <span className="text-sm text-muted-foreground">
                  Página {page + 1} de {Math.max(totalPages, 1)}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page + 1 >= totalPages}
                  onClick={() => handleChangePage(page + 1)}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <CategoriesBestSelling categoriesQuery={categoriesQuery} />
      </div>
    </div>
  );
};
