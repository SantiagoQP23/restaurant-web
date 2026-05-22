import * as React from "react";
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
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { ProductionOrdersBoardView } from "../views/production-orders-board.view";
import { ProductionProductsBoardView } from "../views/production-products-board.view";
import { useOrdersStore } from "@/modules/orders/store/orders.store";

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

const mockProductionArea: ProductionArea = {
  id: 10,
  name: "Cocina",
  description: "Preparacion principal",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const productionAreas: ProductionArea[] = [
  mockProductionArea,
  {
    id: 11,
    name: "Bar",
    description: "Bebidas y cocteles",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

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
  const [selectedAreaId, setSelectedAreaId] = React.useState(
    productionAreas[0]?.id.toString() ?? "",
  );
  const [viewMode, setViewMode] = React.useState<"board" | "product">("board");

  const grouped = React.useMemo(
    () =>
      boardColumns.map((column) => ({
        ...column,
        entries: detailsByStatus(
          orders,
          column.key,
          Number.parseInt(selectedAreaId, 10),
        ),
      })),
    [orders, selectedAreaId],
  );

  const productGroups = React.useMemo(() => {
    const productionAreaId = Number.parseInt(selectedAreaId, 10);
    return boardColumns.map((column) => {
      const detailEntries = orders.flatMap((order) =>
        order.details
          .filter(
            (detail) =>
              detail.status === column.key &&
              detail.product.productionArea.id === productionAreaId,
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
  }, [orders, selectedAreaId]);

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
          <Tabs
            value={viewMode}
            onValueChange={(value) => setViewMode(value as "board" | "product")}
          >
            <TabsList>
              <TabsTrigger value="board">Pedidos</TabsTrigger>
              <TabsTrigger value="product">Productos</TabsTrigger>
            </TabsList>
          </Tabs>
          <Select value={selectedAreaId} onValueChange={setSelectedAreaId}>
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
      {viewMode === "board" ? (
        <ProductionOrdersBoardView grouped={grouped} />
      ) : (
        <ProductionProductsBoardView productGroups={productGroups} />
      )}
    </div>
  );
};
