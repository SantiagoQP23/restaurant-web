import * as React from "react";
import { Button } from "@/shared/components/ui/button";
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
import { useTables } from "../hooks/useTables";
import { TableOrdersPanel } from "../components/table-orders-panel.component";
import { TableCard } from "../components/table-card.component";

export const TablesPage = () => {
  const [tables, setTables] = React.useState<Table[]>([]);
  const getAllTablesQuery = useTables().getAllTablesQuery;
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [tableForOrder, setTableForOrder] = React.useState<Table | null>(null);
  const [customerName, setCustomerName] = React.useState("");
  const [people, setPeople] = React.useState("2");
  const [notes, setNotes] = React.useState("");

  const [selectedTable, setSelectedTable] = React.useState<Table>();

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

  React.useEffect(() => {
    if (getAllTablesQuery.isSuccess && getAllTablesQuery.data) {
      setTables(getAllTablesQuery.data);
    }
  }, [getAllTablesQuery.data, getAllTablesQuery.isSuccess]);

  return (
    <div className="flex min-h-svh flex-col gap-6 p-6 md:p-10">
      <div>
        <h1 className="text-2xl font-bold">Mesas</h1>
        <p className="text-sm text-muted-foreground">
          Gestiona las mesas activas y crea pedidos rapidamente.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-12">
        <div className={selectedTable ? "lg:col-span-8" : "lg:col-span-12"}>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {tables.map((table) => (
              <TableCard
                key={table.id}
                table={table}
                active={table.id === selectedTable?.id}
                onSelect={(table) => setSelectedTable(table)}
                onOpenDialog={handleOpenDialog}
              />
            ))}
          </div>
        </div>
        {selectedTable && (
          <div className="lg:col-span-4">
            <TableOrdersPanel table={selectedTable} />
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
