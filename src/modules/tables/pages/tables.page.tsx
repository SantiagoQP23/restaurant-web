import * as React from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import type { Table } from "@/shared/models/table.model";

type TableOrder = {
  id: string;
  num: number;
  total: number;
  createdAt: Date;
  status: "PENDIENTE" | "EN_PROGRESO" | "LISTO";
};

const tables: Table[] = [
  {
    id: "table-1",
    name: "Mesa 1",
    description: "Ventana",
    chairs: 2,
    isAvailable: true,
    order: 1,
    isActive: true,
  },
  {
    id: "table-2",
    name: "Mesa 2",
    description: "Salon principal",
    chairs: 4,
    isAvailable: false,
    order: 2,
    isActive: true,
  },
  {
    id: "table-3",
    name: "Mesa 3",
    description: "Terraza",
    chairs: 6,
    isAvailable: false,
    order: 3,
    isActive: true,
  },
  {
    id: "table-4",
    name: "Mesa 4",
    description: "Bar",
    chairs: 4,
    isAvailable: true,
    order: 4,
    isActive: true,
  },
];

const ordersByTable: Record<string, TableOrder[]> = {
  "table-2": [
    {
      id: "ord-201",
      num: 201,
      total: 18.5,
      createdAt: new Date(),
      status: "EN_PROGRESO",
    },
  ],
  "table-3": [
    {
      id: "ord-202",
      num: 202,
      total: 26,
      createdAt: new Date(),
      status: "PENDIENTE",
    },
    {
      id: "ord-203",
      num: 203,
      total: 12.75,
      createdAt: new Date(),
      status: "LISTO",
    },
  ],
};

const statusBadgeClass = (status: TableOrder["status"]) => {
  switch (status) {
    case "EN_PROGRESO":
      return "rounded-full bg-sky-100 px-2 py-1 text-xs font-medium text-sky-700";
    case "LISTO":
      return "rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700";
    default:
      return "rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700";
  }
};

const availabilityBadgeClass = (isAvailable: boolean) =>
  isAvailable
    ? "rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700"
    : "rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700";

export const TablesPage = () => {
  const [selectedTableId, setSelectedTableId] = React.useState<string | null>(
    null,
  );
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [tableForOrder, setTableForOrder] = React.useState<Table | null>(null);
  const [customerName, setCustomerName] = React.useState("");
  const [people, setPeople] = React.useState("2");
  const [notes, setNotes] = React.useState("");

  const selectedTable = tables.find((table) => table.id === selectedTableId);
  const selectedOrders = selectedTable
    ? ordersByTable[selectedTable.id] ?? []
    : [];

  const handleOpenDialog = (table: Table) => {
    setTableForOrder(table);
    setCustomerName("");
    setPeople("2");
    setNotes("");
    setDialogOpen(true);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDialogOpen(false);
  };

  return (
    <div className="flex min-h-svh flex-col gap-6 p-6 md:p-10">
      <div>
        <h1 className="text-2xl font-bold">Mesas</h1>
        <p className="text-sm text-muted-foreground">
          Gestiona las mesas activas y crea pedidos rapidamente.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-12">
        <div
          className={
            selectedTable && !selectedTable.isAvailable
              ? "lg:col-span-8"
              : "lg:col-span-12"
          }
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {tables.map((table) => (
              <Card
                key={table.id}
                size="sm"
                className={
                  selectedTableId === table.id
                    ? "ring-2 ring-primary/40"
                    : undefined
                }
                onClick={() =>
                  !table.isAvailable
                    ? setSelectedTableId(table.id)
                    : setSelectedTableId(null)
                }
              >
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle>{table.name}</CardTitle>
                    <span className={availabilityBadgeClass(table.isAvailable)}>
                      {table.isAvailable ? "Disponible" : "Ocupada"}
                    </span>
                  </div>
                  <CardDescription>
                    {table.description} · {table.chairs} sillas
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-end">
                  {table.isAvailable ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleOpenDialog(table);
                      }}
                    >
                      Crear pedido
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={(event) => {
                        event.stopPropagation();
                        setSelectedTableId(table.id);
                      }}
                    >
                      Ver pedidos
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        {selectedTable && !selectedTable.isAvailable && (
          <div className="lg:col-span-4">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Pedidos de {selectedTable.name}</CardTitle>
                <CardDescription>
                  {selectedOrders.length} pedidos activos
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {selectedOrders.length === 0 ? (
                  <div className="rounded-2xl border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
                    No hay pedidos activos.
                  </div>
                ) : (
                  selectedOrders.map((order) => (
                    <div
                      key={order.id}
                      className="rounded-2xl border border-border/60 px-4 py-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium">#{order.num}</span>
                        <span className={statusBadgeClass(order.status)}>
                          {order.status === "EN_PROGRESO"
                            ? "En progreso"
                            : order.status === "LISTO"
                              ? "Listo"
                              : "Pendiente"}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {order.createdAt.toLocaleTimeString("es-EC", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <span className="font-medium">${order.total}</span>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuevo pedido</DialogTitle>
            <DialogDescription>
              {tableForOrder
                ? `Crear pedido para ${tableForOrder.name}.`
                : "Crea un pedido nuevo."}
            </DialogDescription>
          </DialogHeader>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="order-customer">Cliente</FieldLabel>
                <Input
                  id="order-customer"
                  type="text"
                  placeholder="Cliente"
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="order-people">Personas</FieldLabel>
                <Input
                  id="order-people"
                  type="number"
                  min={1}
                  inputMode="numeric"
                  value={people}
                  onChange={(event) => setPeople(event.target.value)}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="order-notes">Notas</FieldLabel>
                <Input
                  id="order-notes"
                  type="text"
                  placeholder="Sin cebolla"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                />
              </Field>
            </FieldGroup>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit">Crear pedido</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
