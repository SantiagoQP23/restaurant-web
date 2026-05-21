import * as React from "react";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { Minus, Plus } from "lucide-react";
import {
  OrderDetailStatus,
  OrderStatus,
  OrderType,
  type Order,
} from "@/shared/models/order.model";
import type { OrderDetail } from "@/shared/models/order-detail.model";
import type { Product } from "@/shared/models/product.model";
import type { ProductOption } from "@/shared/models/product-option.model";
import type { ProductionArea } from "@/shared/models/production-area.model";
import type { Table } from "@/shared/models/table.model";
import type { User } from "@/shared/models/user.model";
import { Button } from "@/shared/components/ui/button";
import { Progress } from "@/shared/components/ui/progress";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
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
import { useActiveOrders } from "@/modules/orders/hooks/useActiveOrders";
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

const mockOptions: ProductOption[] = [
  {
    id: 1,
    name: "Porcion personal",
    price: 0,
    quantity: 100,
    isActive: true,
    isAvailable: true,
    isDefault: true,
  },
  {
    id: 2,
    name: "Porcion grande",
    price: 2.5,
    quantity: 50,
    isActive: true,
    isAvailable: true,
    isDefault: false,
  },
];

const mockProducts: Record<string, Product> = {
  ceviche: {
    id: "prod-ceviche",
    name: "Ceviche de camaron",
    price: 8.5,
    description: "Mariscos frescos con limon",
    images: "",
    productionArea: mockProductionArea,
    unitCost: 4,
    quantity: 20,
    options: mockOptions,
  },
  sopa: {
    id: "prod-sopa",
    name: "Sopa del dia",
    price: 6.5,
    description: "Sopa caliente",
    images: "",
    productionArea: mockProductionArea,
    unitCost: 3,
    quantity: 40,
    options: mockOptions,
  },
  limonada: {
    id: "prod-limonada",
    name: "Limonada",
    price: 3.5,
    description: "Bebida fresca",
    images: "",
    productionArea: mockProductionArea,
    unitCost: 1,
    quantity: 60,
    options: mockOptions,
  },
  lomo: {
    id: "prod-lomo",
    name: "Lomo a la parrilla",
    price: 14,
    description: "Carne a la parrilla",
    images: "",
    productionArea: mockProductionArea,
    unitCost: 7,
    quantity: 15,
    options: mockOptions,
  },
  ensalada: {
    id: "prod-ensalada",
    name: "Ensalada fresca",
    price: 6,
    description: "Vegetales frescos",
    images: "",
    productionArea: mockProductionArea,
    unitCost: 2.5,
    quantity: 25,
    options: mockOptions,
  },
  te: {
    id: "prod-te-helado",
    name: "Te helado",
    price: 4,
    description: "Bebida fria",
    images: "",
    productionArea: mockProductionArea,
    unitCost: 1.5,
    quantity: 35,
    options: mockOptions,
  },
};

const mockUser: User = {
  id: "user-1",
  username: "camila.p",
  person: {
    id: "person-1",
    firstName: "Camila",
    lastName: "Perez",
    email: "camila.perez@example.com",
  },
  online: true,
  restaurantRoles: [],
  isActive: true,
  role: "ADMIN" as never,
};

const tables: Table[] = [
  {
    id: "table-1",
    name: "Mesa 4",
    description: "Salon principal",
    chairs: 4,
    isAvailable: true,
    order: 4,
    isActive: true,
  },
  {
    id: "table-2",
    name: "Mesa 1",
    description: "Ventana",
    chairs: 2,
    isAvailable: true,
    order: 1,
    isActive: true,
  },
  {
    id: "table-3",
    name: "Mesa 7",
    description: "Terraza",
    chairs: 6,
    isAvailable: false,
    order: 7,
    isActive: true,
  },
];

const buildDetail = (
  detailId: string,
  product: Product,
  quantity: number,
  status: OrderDetailStatus,
  note?: string,
  readyQuantity = 0,
): OrderDetail => {
  const amount = product.price * quantity;
  return {
    id: detailId,
    quantity,
    qtyDelivered: 0,
    readyQuantity,
    qtyPaid: 0,
    amount,
    description: note ?? "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    product,
    status,
    isActive: true,
    price: product.price,
    typeOrderDetail: OrderType.IN_PLACE,
  };
};

const nextDetailStatus = (status: OrderDetailStatus) => {
  switch (status) {
    case OrderDetailStatus.PENDING:
      return OrderDetailStatus.IN_PROGRESS;
    case OrderDetailStatus.IN_PROGRESS:
      return OrderDetailStatus.READY;
    default:
      return status;
  }
};

const nextReadyQuantity = (
  detail: OrderDetail,
  nextStatus: OrderDetailStatus,
) => {
  if (nextStatus === OrderDetailStatus.IN_PROGRESS) {
    return Math.min(detail.quantity, Math.max(detail.readyQuantity, 1));
  }
  if (nextStatus === OrderDetailStatus.READY) {
    return detail.quantity;
  }
  return detail.readyQuantity;
};

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
  // const [orders, setOrders] = React.useState<Order[]>(initialOrders);
  const orders = useOrdersStore((state) => state.orders);
  const [selectedAreaId, setSelectedAreaId] = React.useState(
    productionAreas[0]?.id.toString() ?? "",
  );
  const [viewMode, setViewMode] = React.useState<"board" | "product">("board");

  const handleAdvanceDetail = (orderId: string, detailId: string) => {
    // setOrders((current) =>
    //   current.map((order) => {
    //     if (order.id !== orderId) {
    //       return order;
    //     }
    //     return {
    //       ...order,
    //       details: order.details.map((detail) =>
    //         detail.id === detailId
    //           ? {
    //               ...detail,
    //               status: nextDetailStatus(detail.status),
    //               readyQuantity: nextReadyQuantity(
    //                 detail,
    //                 nextDetailStatus(detail.status),
    //               ),
    //               updatedAt: new Date().toISOString(),
    //             }
    //           : detail,
    //       ),
    //     };
    //   }),
    // );
  };

  const handleAdvanceOrderDetails = (
    orderId: string,
    status: OrderDetailStatus,
  ) => {
    // const productionAreaId = Number.parseInt(selectedAreaId, 10);
    // setOrders((current) =>
    //   current.map((order) => {
    //     if (order.id !== orderId) {
    //       return order;
    //     }
    //     return {
    //       ...order,
    //       details: order.details.map((detail) => {
    //         if (
    //           detail.status !== status ||
    //           detail.product.productionArea.id !== productionAreaId
    //         ) {
    //           return detail;
    //         }
    //         const nextStatus = nextDetailStatus(detail.status);
    //         return {
    //           ...detail,
    //           status: nextStatus,
    //           readyQuantity: nextReadyQuantity(detail, nextStatus),
    //           updatedAt: new Date().toISOString(),
    //         };
    //       }),
    //     };
    //   }),
    // );
  };

  const handleIncrementReady = (orderId: string, detailId: string) => {
    // setOrders((current) =>
    //   current.map((order) => {
    //     if (order.id !== orderId) {
    //       return order;
    //     }
    //     return {
    //       ...order,
    //       details: order.details.map((detail) =>
    //         detail.id === detailId
    //           ? {
    //               ...detail,
    //               readyQuantity: Math.min(
    //                 detail.quantity,
    //                 detail.readyQuantity + 1,
    //               ),
    //               updatedAt: new Date().toISOString(),
    //             }
    //           : detail,
    //       ),
    //     };
    //   }),
    // );
  };

  const handleDecrementReady = (orderId: string, detailId: string) => {
    // setOrders((current) =>
    //   current.map((order) => {
    //     if (order.id !== orderId) {
    //       return order;
    //     }
    //     return {
    //       ...order,
    //       details: order.details.map((detail) =>
    //         detail.id === detailId
    //           ? {
    //               ...detail,
    //               readyQuantity: Math.max(0, detail.readyQuantity - 1),
    //               updatedAt: new Date().toISOString(),
    //             }
    //           : detail,
    //       ),
    //     };
    //   }),
    // );
  };

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
        <ProductionOrdersBoardView
          grouped={grouped}
          onAdvanceOrderDetails={handleAdvanceOrderDetails}
          onAdvanceDetail={handleAdvanceDetail}
          onIncrementReady={handleIncrementReady}
          onDecrementReady={handleDecrementReady}
        />
      ) : (
        <ProductionProductsBoardView
          productGroups={productGroups}
          onAdvanceDetail={handleAdvanceDetail}
          onIncrementReady={handleIncrementReady}
          onDecrementReady={handleDecrementReady}
        />
      )}
    </div>
  );
};
