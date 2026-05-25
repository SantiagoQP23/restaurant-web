import { OrderDetailStatus, type Order } from "@/shared/models/order.model";
import type { OrderDetail } from "@/shared/models/order-detail.model";
import type { Product } from "@/shared/models/product.model";
import type { ProductionArea } from "@/shared/models/production-area.model";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { ProductionOrdersBoardView } from "../views/production-orders-board.view";
import { ProductionProductsBoardView } from "../views/production-products-board.view";
import { useOrdersStore } from "@/modules/orders/store/orders.store";
import { orderTableLabel } from "@/modules/orders/helpers/orders.helper";
import { formatStringDate } from "@/shared/lib/utils";
import { useProductionAreas } from "@/modules/production-areas/hooks/useProductionAreas";
import { useEffect, useMemo, useState } from "react";
import { useActiveOrders } from "@/modules/orders/hooks/useActiveOrders";
import { RefreshCcw } from "lucide-react";

const boardColumns = [
  {
    key: OrderDetailStatus.PENDING,
    label: "Pendiente",
    accent: "bg-amber-100 text-amber-700",
  },
  {
    key: OrderDetailStatus.IN_PROGRESS,
    label: "Preparando",
    accent: "bg-sky-100 text-sky-700",
  },
  {
    key: OrderDetailStatus.READY,
    label: "Listo",
    accent: "bg-emerald-100 text-emerald-700",
  },
] as const;

const detailsByStatus = (
  ordersList: Order[],
  status: OrderDetailStatus,
  productionAreaId: number,
) =>
  ordersList
    .map((order) => ({
      order,
      details: order.details.filter(
        (detail) =>
          detail.status === status &&
          detail.product.productionArea.id === productionAreaId,
      ),
    }))
    .filter((entry) => entry.details.length > 0);

export const ProductionPage = () => {
  const orders = useOrdersStore((state) => state.orders);
  const refectchOrders = useActiveOrders().refetchOrders;
  const { getAllQuery: productionAreasQuery } = useProductionAreas();
  const [productionAreas, setProductionAreas] = useState<ProductionArea[]>([]);

  const [selectedAreaId, setSelectedAreaId] = useState<number>(0);
  const [viewMode, setViewMode] = useState<"board" | "product">("board");
  const [isCancelledOpen, setIsCancelledOpen] = useState(false);
  const [productQuery, setProductQuery] = useState("");

  const normalizedQuery = useMemo(
    () => productQuery.trim().toLowerCase(),
    [productQuery],
  );

  const matchesQuery = (detail: OrderDetail) =>
    normalizedQuery.length === 0 ||
    detail.product.name.toLowerCase().includes(normalizedQuery);

  const grouped = useMemo(() => {
    const filteredOrders = orders
      .map((order) => ({
        ...order,
        details: order.details.filter(matchesQuery),
      }))
      .filter((order) => order.details.length > 0);

    return boardColumns.map((column) => ({
      ...column,
      entries: detailsByStatus(filteredOrders, column.key, selectedAreaId),
    }));
  }, [orders, selectedAreaId, normalizedQuery]);

  const productGroups = useMemo(() => {
    const productionAreaId = selectedAreaId;
    return boardColumns.map((column) => {
      const detailEntries = orders.flatMap((order) =>
        order.details
          .filter(
            (detail) =>
              detail.status === column.key &&
              detail.product.productionArea.id === productionAreaId &&
              matchesQuery(detail),
          )
          .map((detail) => ({ order, detail })),
      );

      const groupedByProduct = detailEntries.reduce(
        (acc, entry) => {
          const key = entry.detail.product.id;
          if (!acc.has(key)) {
            acc.set(key, {
              product: entry.detail.product,
              totalQuantity: 0,
              totalReady: 0,
              entries: [] as Array<{
                order: Order;
                detail: OrderDetail;
              }>,
            });
          }
          const current = acc.get(key);
          if (!current) {
            return acc;
          }
          current.totalQuantity += entry.detail.quantity;
          current.totalReady += entry.detail.readyQuantity;
          current.entries.push(entry);
          return acc;
        },
        new Map<
          string,
          {
            product: Product;
            totalQuantity: number;
            totalReady: number;
            entries: Array<{ order: Order; detail: OrderDetail }>;
          }
        >(),
      );

      return {
        ...column,
        products: Array.from(groupedByProduct.values()),
      };
    });
  }, [orders, selectedAreaId, normalizedQuery]);

  const cancelledDetails = useMemo(() => {
    const productionAreaId = selectedAreaId;
    return orders.flatMap((order) =>
      order.details
        .filter(
          (detail) =>
            detail.status === OrderDetailStatus.CANCELLED &&
            detail.product.productionArea.id === productionAreaId &&
            matchesQuery(detail),
        )
        .map((detail) => ({ order, detail })),
    );
  }, [orders, selectedAreaId, normalizedQuery]);

  useEffect(() => {
    if (productionAreasQuery.isSuccess && productionAreasQuery.data) {
      setProductionAreas(productionAreasQuery.data);
      if (productionAreasQuery.data.length > 0) {
        setSelectedAreaId(productionAreasQuery.data[0].id);
      }
    }
  }, [
    productionAreasQuery.data,
    productionAreasQuery.isSuccess,
    setSelectedAreaId,
    setProductionAreas,
  ]);

  return (
    <div className="flex min-h-svh flex-col gap-6 p-6 md:p-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Producción</h1>
          <p className="text-sm text-muted-foreground">
            Organiza los pedidos por estado de preparación.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsCancelledOpen(true)}
          >
            Cancelados
            <Badge className="ml-2" variant="secondary">
              {cancelledDetails.length}
            </Badge>
          </Button>
          <Button variant="outline" onClick={() => refectchOrders()}>
            <RefreshCcw />
          </Button>
          <Input
            value={productQuery}
            onChange={(event) => setProductQuery(event.target.value)}
            placeholder="Buscar producto"
            className="w-[200px]"
          />
          <Tabs
            value={viewMode}
            onValueChange={(value) => setViewMode(value as "board" | "product")}
          >
            <TabsList>
              <TabsTrigger value="board">Pedidos</TabsTrigger>
              <TabsTrigger value="product">Productos</TabsTrigger>
            </TabsList>
          </Tabs>
          <Select
            value={selectedAreaId.toString()}
            onValueChange={(value) => setSelectedAreaId(+value)}
          >
            <SelectTrigger className="min-w-[200px]">
              <SelectValue placeholder="Selecciona un area" />
            </SelectTrigger>
            <SelectContent>
              {productionAreas.map((area) => (
                <SelectItem key={area.id} value={area.id.toString()}>
                  {area.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Dialog open={isCancelledOpen} onOpenChange={setIsCancelledOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Productos cancelados</DialogTitle>
            <DialogDescription>
              Productos marcados como cancelados para el area seleccionada.
            </DialogDescription>
          </DialogHeader>
          <div className="flex max-h-[60vh] flex-col gap-3 overflow-y-auto">
            {cancelledDetails.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border/70 p-6 text-center text-sm text-muted-foreground">
                No hay productos cancelados en esta area.
              </div>
            ) : (
              cancelledDetails.map(({ order, detail }) => (
                <div
                  key={detail.id}
                  className="flex flex-col gap-2 rounded-lg border border-border/60 bg-muted/20 p-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-sm font-semibold">
                      {detail.quantity}x {detail.product.name}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">#{order.num}</Badge>
                      <Badge variant="outline">{orderTableLabel(order)}</Badge>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Creado:{" "}
                    {formatStringDate(detail.createdAt, "DD/MM/YYYY HH:mm")}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Actualizado:{" "}
                    {formatStringDate(detail.updatedAt, "DD/MM/YYYY HH:mm")}
                  </div>
                  {detail.updatedBy && (
                    <div className="text-xs text-muted-foreground">
                      Actualizado por: {detail.updatedBy.person.firstName}{" "}
                      {detail.updatedBy.person.lastName}
                    </div>
                  )}
                  {detail.description && (
                    <div className="text-xs text-muted-foreground">
                      Nota: {detail.description}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cerrar
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {viewMode === "board" ? (
        <ProductionOrdersBoardView grouped={grouped} />
      ) : (
        <ProductionProductsBoardView productGroups={productGroups} />
      )}
    </div>
  );
};
