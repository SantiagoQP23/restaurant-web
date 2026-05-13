import * as React from "react";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { ArrowRight, Minus, Plus, Sliders } from "lucide-react";
import {
  OrderDetailStatus,
  OrderStatus,
  OrderStatusSpanish,
  OrderType,
  type Order,
} from "@/shared/models/order.model";
import type { OrderDetail } from "@/shared/models/order-detail.model";
import type { Product } from "@/shared/models/product.model";
import type { ProductOption } from "@/shared/models/product-option.model";
import type { ProductionArea } from "@/shared/models/production-area.model";
import type { Table } from "@/shared/models/table.model";
import type { User } from "@/shared/models/user.model";
import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
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
  id: 1,
  name: "Cocina",
  description: "Preparacion principal",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const productionAreas: ProductionArea[] = [
  mockProductionArea,
  {
    id: 2,
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

const formatTime = (date: Date) =>
  date.toLocaleTimeString("es-EC", {
    hour: "2-digit",
    minute: "2-digit",
  });

const formatDetailTime = (value: string) =>
  new Date(value).toLocaleTimeString("es-EC", {
    hour: "2-digit",
    minute: "2-digit",
  });

const orderTableLabel = (order: Order) => order.table?.name ?? "Para llevar";

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

const detailStatusDotClass = (status: OrderDetailStatus) => {
  switch (status) {
    case OrderDetailStatus.PENDING:
      return "bg-amber-400";
    case OrderDetailStatus.IN_PROGRESS:
      return "bg-sky-400";
    default:
      return "bg-emerald-400";
  }
};

const progressValue = (detail: OrderDetail) => {
  if (detail.quantity <= 0) {
    return 0;
  }
  const percent = (detail.readyQuantity / detail.quantity) * 100;
  return Math.max(0, Math.min(100, percent));
};

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
  const [orders, setOrders] = React.useState<Order[]>(initialOrders);
  const [selectedAreaId, setSelectedAreaId] = React.useState(
    productionAreas[0]?.id.toString() ?? "",
  );

  const handleAdvanceDetail = (orderId: string, detailId: string) => {
    setOrders((current) =>
      current.map((order) => {
        if (order.id !== orderId) {
          return order;
        }
        return {
          ...order,
          details: order.details.map((detail) =>
            detail.id === detailId
              ? {
                  ...detail,
                  status: nextDetailStatus(detail.status),
                  readyQuantity: nextReadyQuantity(
                    detail,
                    nextDetailStatus(detail.status),
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : detail,
          ),
        };
      }),
    );
  };

  const handleAdvanceOrderDetails = (
    orderId: string,
    status: OrderDetailStatus
  ) => {
    const productionAreaId = Number.parseInt(selectedAreaId, 10);
    setOrders((current) =>
      current.map((order) => {
        if (order.id !== orderId) {
          return order;
        }
        return {
          ...order,
          details: order.details.map((detail) => {
            if (
              detail.status !== status ||
              detail.product.productionArea.id !== productionAreaId
            ) {
              return detail;
            }
            const nextStatus = nextDetailStatus(detail.status);
            return {
              ...detail,
              status: nextStatus,
              readyQuantity: nextReadyQuantity(detail, nextStatus),
              updatedAt: new Date().toISOString(),
            };
          }),
        };
      })
    );
  };

  const handleIncrementReady = (orderId: string, detailId: string) => {
    setOrders((current) =>
      current.map((order) => {
        if (order.id !== orderId) {
          return order;
        }
        return {
          ...order,
          details: order.details.map((detail) =>
            detail.id === detailId
              ? {
                  ...detail,
                  readyQuantity: Math.min(
                    detail.quantity,
                    detail.readyQuantity + 1,
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : detail,
          ),
        };
      }),
    );
  };

  const handleDecrementReady = (orderId: string, detailId: string) => {
    setOrders((current) =>
      current.map((order) => {
        if (order.id !== orderId) {
          return order;
        }
        return {
          ...order,
          details: order.details.map((detail) =>
            detail.id === detailId
              ? {
                  ...detail,
                  readyQuantity: Math.max(0, detail.readyQuantity - 1),
                  updatedAt: new Date().toISOString(),
                }
              : detail,
          ),
        };
      }),
    );
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
    [selectedAreaId],
  );

  return (
    <div className="flex min-h-svh flex-col gap-6 p-6 md:p-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Produccion</h1>
          <p className="text-sm text-muted-foreground">
            Organiza los pedidos por estado de preparacion.
          </p>
        </div>
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
      <div className="grid gap-4 lg:grid-cols-3">
        {grouped.map((column) => (
          <section
            key={column.key}
            className="flex flex-col gap-4 rounded-4xl border border-border/60 bg-muted/30 p-4"
          >
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">{column.label}</div>
              <span
                className={`rounded-full px-2 py-1 text-xs font-medium ${column.accent}`}
              >
                {column.entries.reduce(
                  (total, entry) => total + entry.details.length,
                  0,
                )}
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {column.entries.map(({ order, details }) => (
                <Card key={`${order.id}-${column.key}`} size="sm">
                  <CardHeader>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <CardTitle>#{order.num}</CardTitle>
                        <Badge variant="outline">
                          {statusLabel(order.status)}
                        </Badge>
                      </div>
                      {column.key !== OrderDetailStatus.READY && (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleAdvanceOrderDetails(order.id, column.key)
                          }
                        >
                          {column.key === OrderDetailStatus.PENDING
                            ? "Iniciar"
                            : "Listo"}
                        </Button>
                      )}
                    </div>
                    <CardDescription>
                      {orderTableLabel(order)} · {formatTime(order.createdAt)} ·
                      {" "}
                      {order.user.person.firstName} {order.user.person.lastName}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3">
                    {details.map((detail) => (
                      <div key={detail.id} className="flex flex-col gap-1">
                        <div className="group flex items-start justify-between gap-3 text-sm">
                          <div className="flex items-center gap-2">
                            <span
                              className={`mt-1 size-2.5 shrink-0 rounded-full ${detailStatusDotClass(
                                detail.status,
                              )}`}
                            />
                            <div>
                              <div className="font-medium">
                                {detail.quantity}x {detail.product.name}
                              </div>
                            </div>
                          </div>
                          {detail.status !== OrderDetailStatus.READY && (
                            <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-xs"
                                aria-label="Sumar listo"
                                onClick={() =>
                                  handleIncrementReady(order.id, detail.id)
                                }
                              >
                                <Plus />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-xs"
                                aria-label="Ajustar listo"
                                onClick={() =>
                                  NiceModal.show(EditReadyQuantityModal, {
                                    detail,
                                    onIncrement: () =>
                                      handleIncrementReady(order.id, detail.id),
                                    onDecrement: () =>
                                      handleDecrementReady(order.id, detail.id),
                                  })
                                }
                              >
                                <Sliders />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-xs"
                                aria-label={
                                  detail.status === OrderDetailStatus.PENDING
                                    ? "Marcar como preparando"
                                    : "Marcar como listo"
                                }
                                onClick={() =>
                                  handleAdvanceDetail(order.id, detail.id)
                                }
                              >
                                <ArrowRight />
                              </Button>
                            </div>
                          )}
                        </div>
                        {detail.quantity > 1 && detail.readyQuantity > 0 && (
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                              <span>Listo</span>
                              <span>
                                {detail.readyQuantity}/{detail.quantity}
                              </span>
                            </div>
                            <Progress
                              value={progressValue(detail)}
                              className="h-1"
                            />
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground">
                          Creado: {formatDetailTime(detail.createdAt)} ·{" "}
                          Actualizado: {formatDetailTime(detail.updatedAt)}
                        </div>
                        {detail.description && (
                          <span className="text-xs text-muted-foreground">
                            Nota: {detail.description}
                          </span>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};
