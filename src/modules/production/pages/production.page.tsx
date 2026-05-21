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
import { ProductionOrdersBoardView } from "./production-orders-board.view";
import { ProductionProductsBoardView } from "./production-products-board.view";
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

const initialOrders: Order[] = [
  {
    id: "ord-201",
    num: 201,
    notes: "Sin hielo en la bebida",
    deliveryTime: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    details: [
      buildDetail(
        "det-21",
        mockProducts.ceviche,
        2,
        OrderDetailStatus.PENDING,
        "",
        1,
      ),
      buildDetail(
        "det-22",
        mockProducts.sopa,
        2,
        OrderDetailStatus.IN_PROGRESS,
        "",
        1,
      ),
      buildDetail(
        "det-23",
        mockProducts.limonada,
        1,
        OrderDetailStatus.READY,
        "Sin hielo",
      ),
    ],
    isPaid: false,
    people: 2,
    status: OrderStatus.IN_PROGRESS,
    table: tables[0],
    total: 24.5,
    type: OrderType.IN_PLACE,
    user: mockUser,
    isClosed: false,
  },
  {
    id: "ord-202",
    num: 202,
    notes: "",
    deliveryTime: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    details: [
      buildDetail(
        "det-24",
        mockProducts.lomo,
        3,
        OrderDetailStatus.IN_PROGRESS,
        "",
        2,
      ),
      buildDetail(
        "det-25",
        mockProducts.limonada,
        2,
        OrderDetailStatus.PENDING,
        "",
        1,
      ),
    ],
    isPaid: false,
    people: 3,
    status: OrderStatus.IN_PROGRESS,
    table: tables[1],
    total: 18,
    type: OrderType.IN_PLACE,
    user: mockUser,
    isClosed: false,
  },
  {
    id: "ord-203",
    num: 203,
    notes: "",
    deliveryTime: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    details: [
      buildDetail(
        "det-26",
        mockProducts.sopa,
        2,
        OrderDetailStatus.READY,
        "",
        2,
      ),
      buildDetail("det-27", mockProducts.te, 2, OrderDetailStatus.READY, "", 1),
    ],
    isPaid: true,
    people: 1,
    status: OrderStatus.READY,
    total: 10.5,
    type: OrderType.TAKE_AWAY,
    user: mockUser,
    isClosed: false,
  },
  {
    id: "ord-204",
    num: 204,
    notes: "",
    deliveryTime: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    details: [
      buildDetail(
        "det-28",
        mockProducts.ensalada,
        3,
        OrderDetailStatus.PENDING,
        "",
        1,
      ),
      buildDetail(
        "det-29",
        mockProducts.te,
        2,
        OrderDetailStatus.IN_PROGRESS,
        "",
        1,
      ),
    ],
    isPaid: false,
    people: 4,
    status: OrderStatus.PENDING,
    table: tables[2],
    total: 14,
    type: OrderType.IN_PLACE,
    user: mockUser,
    isClosed: false,
  },
];

const progressValueFrom = (readyQuantity: number, quantity: number) => {
  if (quantity <= 0) {
    return 0;
  }
  const percent = (readyQuantity / quantity) * 100;
  return Math.max(0, Math.min(100, percent));
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

const EditReadyQuantityModal = NiceModal.create(
  ({
    detail,
    onIncrement,
    onDecrement,
  }: {
    detail: OrderDetail;
    onIncrement: () => void;
    onDecrement: () => void;
  }) => {
    const modal = useModal();
    const [readyQuantity, setReadyQuantity] = React.useState(
      detail.readyQuantity,
    );

    const handleIncrement = () => {
      if (readyQuantity >= detail.quantity) {
        return;
      }
      setReadyQuantity((current) => current + 1);
      onIncrement();
    };

    const handleDecrement = () => {
      if (readyQuantity <= 0) {
        return;
      }
      setReadyQuantity((current) => current - 1);
      onDecrement();
    };

    return (
      <Dialog
        open={modal.visible}
        onOpenChange={(open) => {
          if (!open) {
            modal.hide();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{detail.product.name}</DialogTitle>
            <DialogDescription>
              Ajusta la cantidad lista para este producto.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Listo</span>
              <span>
                {readyQuantity}/{detail.quantity}
              </span>
            </div>
            <Progress
              value={progressValueFrom(readyQuantity, detail.quantity)}
            />
            <div className="flex items-center justify-between gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleDecrement}
                disabled={readyQuantity <= 0}
                aria-label="Restar listo"
              >
                <Minus />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleIncrement}
                disabled={readyQuantity >= detail.quantity}
                aria-label="Sumar listo"
              >
                <Plus />
              </Button>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="button" onClick={() => modal.hide()}>
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
);

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
          editReadyQuantityModal={EditReadyQuantityModal}
        />
      ) : (
        <ProductionProductsBoardView
          productGroups={productGroups}
          onAdvanceDetail={handleAdvanceDetail}
          onIncrementReady={handleIncrementReady}
          onDecrementReady={handleDecrementReady}
          editReadyQuantityModal={EditReadyQuantityModal}
        />
      )}
    </div>
  );
};
