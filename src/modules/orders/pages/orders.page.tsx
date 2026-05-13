import * as React from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { formatCurrency } from "@/shared/lib/utils";
import {
  OrderStatus,
  OrderStatusSpanish,
  type Order,
} from "@/shared/models/order.model";
import type { OrderDetail } from "@/shared/models/order-detail.model";
import type { Product } from "@/shared/models/product.model";
import type { ProductOption } from "@/shared/models/product-option.model";
import type { ProductionArea } from "@/shared/models/production-area.model";
import type { Table } from "@/shared/models/table.model";
import type { User } from "@/shared/models/user.model";
import { Badge } from "@/shared/components/ui/badge";

const statusFilters = [
  "Todos",
  OrderStatusSpanish.PENDING,
  OrderStatusSpanish.IN_PROGRESS,
  OrderStatusSpanish.READY,
  OrderStatusSpanish.DELIVERED,
] as const;

const mockProductionArea: ProductionArea = {
  id: 1,
  name: "Cocina",
  description: "Preparacion principal",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

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
  lasagna: {
    id: "prod-lasagna",
    name: "Lasaña de la casa",
    price: 12.5,
    description: "Pasta horneada",
    images: "",
    productionArea: mockProductionArea,
    unitCost: 6,
    quantity: 10,
    options: mockOptions,
  },
  bowl: {
    id: "prod-bowl",
    name: "Bowl vegetariano",
    price: 9.25,
    description: "Mix vegetal",
    images: "",
    productionArea: mockProductionArea,
    unitCost: 4.2,
    quantity: 12,
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
  {
    id: "table-4",
    name: "Mesa 2",
    description: "Bar",
    chairs: 4,
    isAvailable: true,
    order: 2,
    isActive: true,
  },
  {
    id: "table-5",
    name: "Mesa 9",
    description: "Salon",
    chairs: 4,
    isAvailable: true,
    order: 9,
    isActive: true,
  },
];

const buildDetail = (
  detailId: string,
  product: Product,
  quantity: number,
  note?: string,
): OrderDetail => {
  const amount = product.price * quantity;
  return {
    id: detailId,
    quantity,
    qtyDelivered: 0,
    readyQuantity: 0,
    qtyPaid: 0,
    amount,
    description: note ?? "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    product,
    status: OrderStatus.PENDING,
    isActive: true,
    price: product.price,
    typeOrderDetail: OrderStatus.PENDING as never,
  };
};

const orders: Order[] = [
  {
    id: "ord-101",
    num: 101,
    notes: "Sin hielo en la bebida",
    deliveryTime: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    details: [
      buildDetail("det-1", mockProducts.ceviche, 1),
      buildDetail("det-2", mockProducts.sopa, 1),
      buildDetail("det-3", mockProducts.limonada, 1, "Sin hielo"),
    ],
    isPaid: false,
    people: 2,
    status: OrderStatus.PENDING,
    table: tables[0],
    total: 24.5,
    type: "IN_PLACE" as never,
    user: mockUser,
    isClosed: false,
  },
  {
    id: "ord-102",
    num: 102,
    notes: "",
    deliveryTime: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    details: [
      buildDetail("det-4", mockProducts.lomo, 1),
      buildDetail("det-5", mockProducts.limonada, 2),
    ],
    isPaid: false,
    people: 3,
    status: OrderStatus.IN_PROGRESS,
    table: tables[1],
    total: 18,
    type: "IN_PLACE" as never,
    user: mockUser,
    isClosed: false,
  },
  {
    id: "ord-103",
    num: 103,
    notes: "",
    deliveryTime: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    details: [buildDetail("det-6", mockProducts.sopa, 1)],
    isPaid: true,
    people: 1,
    status: OrderStatus.READY,
    total: 6.5,
    type: "TAKE_AWAY" as never,
    user: mockUser,
    isClosed: false,
  },
  {
    id: "ord-104",
    num: 104,
    notes: "",
    deliveryTime: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    details: [
      buildDetail("det-7", mockProducts.lomo, 2),
      buildDetail("det-8", mockProducts.ensalada, 1),
      buildDetail("det-9", mockProducts.te, 2),
    ],
    isPaid: false,
    people: 4,
    status: OrderStatus.IN_PROGRESS,
    table: tables[2],
    total: 42,
    type: "IN_PLACE" as never,
    user: mockUser,
    isClosed: false,
  },
  {
    id: "ord-105",
    num: 105,
    notes: "",
    deliveryTime: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    details: [
      buildDetail("det-10", mockProducts.lasagna, 1),
      buildDetail("det-11", mockProducts.bowl, 1),
      buildDetail("det-12", mockProducts.limonada, 2),
      buildDetail("det-13", mockProducts.te, 1),
    ],
    isPaid: true,
    people: 5,
    status: OrderStatus.DELIVERED,
    table: tables[3],
    total: 58.25,
    type: "IN_PLACE" as never,
    user: mockUser,
    isClosed: true,
  },
  {
    id: "ord-106",
    num: 106,
    notes: "",
    deliveryTime: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    details: [buildDetail("det-14", mockProducts.limonada, 1)],
    isPaid: false,
    people: 2,
    status: OrderStatus.PENDING,
    table: tables[4],
    total: 19.75,
    type: "IN_PLACE" as never,
    user: mockUser,
    isClosed: false,
  },
];

const statusBadgeClass = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PENDING:
      return "rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700";
    case OrderStatus.IN_PROGRESS:
      return "rounded-full bg-sky-100 px-2 py-1 text-xs font-medium text-sky-700";
    case OrderStatus.READY:
      return "rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700";
    default:
      return "rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground";
  }
};

const statusLabel = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PENDING:
      return OrderStatusSpanish.PENDING;
    case OrderStatus.IN_PROGRESS:
      return OrderStatusSpanish.IN_PROGRESS;
    case OrderStatus.READY:
      return OrderStatusSpanish.READY;
    case OrderStatus.DELIVERED:
      return OrderStatusSpanish.DELIVERED;
    default:
      return OrderStatusSpanish.CANCELLED;
  }
};

const formatTime = (date: Date) =>
  date.toLocaleTimeString("es-EC", {
    hour: "2-digit",
    minute: "2-digit",
  });

const orderTableLabel = (order: Order) => order.table?.name ?? "Para llevar";

export const OrdersPage = () => {
  const [selectedFilter, setSelectedFilter] = React.useState<
    (typeof statusFilters)[number]
  >(statusFilters[0]);
  const [selectedOrderId, setSelectedOrderId] = React.useState<string | null>(
    null,
  );

  const visibleOrders = React.useMemo(() => {
    if (selectedFilter === "Todos") {
      return orders;
    }
    return orders.filter(
      (order) => statusLabel(order.status) === selectedFilter,
    );
  }, [selectedFilter]);

  React.useEffect(() => {
    if (!selectedOrderId) {
      return;
    }
    const stillVisible = visibleOrders.some(
      (order) => order.id === selectedOrderId,
    );
    if (!stillVisible) {
      setSelectedOrderId(null);
    }
  }, [selectedOrderId, visibleOrders]);

  const selectedOrder = visibleOrders.find(
    (order) => order.id === selectedOrderId,
  );

  return (
    <div className="flex min-h-svh flex-col gap-6 p-6 md:p-10">
      <div>
        <h1 className="text-2xl font-bold">Pedidos</h1>
        <p className="text-sm text-muted-foreground">
          Revisa y gestiona los pedidos en tiempo real.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {statusFilters.map((status) => (
          <Badge
            key={status}
            variant={selectedFilter === status ? "default" : "outline"}
            onClick={() => setSelectedFilter(status)}
          >
            {status}
          </Badge>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-12">
        <div className={selectedOrder ? "lg:col-span-8" : "lg:col-span-12"}>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visibleOrders.map((order) => (
              <Card
                key={order.id}
                size="sm"
                className={
                  order.id === selectedOrderId
                    ? "ring-2 ring-primary/40"
                    : undefined
                }
                onClick={() =>
                  order.id !== selectedOrderId
                    ? setSelectedOrderId(order.id)
                    : setSelectedOrderId(null)
                }
              >
                <button type="button" className="text-left">
                  <CardHeader>
                    <div className="flex items-center justify-between gap-2">
                      <CardTitle>#{order.num}</CardTitle>
                      <span className={statusBadgeClass(order.status)}>
                        {statusLabel(order.status)}
                      </span>
                    </div>
                    <CardDescription>{orderTableLabel(order)}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {order.details.reduce(
                          (total, detail) => total + detail.quantity,
                          0,
                        )}{" "}
                        items
                      </span>
                      <span className="font-medium">
                        {formatCurrency(order.total)}
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      {formatTime(order.createdAt)}
                    </div>
                  </CardContent>
                </button>
              </Card>
            ))}
          </div>
        </div>
        {selectedOrder && (
          <div className="lg:col-span-4">
            <Card className="sticky top-6">
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle>#{selectedOrder.num}</CardTitle>
                  <span className={statusBadgeClass(selectedOrder.status)}>
                    {statusLabel(selectedOrder.status)}
                  </span>
                </div>
                <CardDescription>
                  {orderTableLabel(selectedOrder)} ·{" "}
                  {formatTime(selectedOrder.createdAt)}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex flex-col gap-3">
                  {selectedOrder.details.map((detail) => (
                    <div key={detail.id} className="flex flex-col gap-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">
                          {detail.quantity}x {detail.product.name}
                        </span>
                        <span className="text-muted-foreground">
                          {formatCurrency(detail.amount)}
                        </span>
                      </div>
                      {detail.description && (
                        <span className="text-xs text-muted-foreground">
                          Nota: {detail.description}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total</span>
                    <span className="font-semibold">
                      {formatCurrency(selectedOrder.total)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
