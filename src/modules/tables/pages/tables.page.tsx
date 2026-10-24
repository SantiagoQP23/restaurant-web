import * as React from "react";
import type { Table } from "@/shared/models/table.model";
import { useTables } from "../hooks/useTables";
import { TableOrdersPanel } from "../components/table-orders-panel.component";
import { TableCard } from "../components/table-card.component";

export const TablesPage = () => {
  const [tables, setTables] = React.useState<Table[]>([]);
  const getAllTablesQuery = useTables().getAllTablesQuery;
  const [selectedTable, setSelectedTable] = React.useState<Table | null>(null);

  React.useEffect(() => {
    if (getAllTablesQuery.isSuccess && getAllTablesQuery.data) {
      setTables(getAllTablesQuery.data);
    }
  }, [getAllTablesQuery.data, getAllTablesQuery.isSuccess]);

  return (
    <div className="flex min-h-svh flex-col gap-6 p-6 md:p-10">
      <div>
        <h1 className="text-2xl font-semibold">Mesas</h1>
        <p className="text-sm text-muted-foreground">
          Revisa las mesas ocupadas y sus pedidos.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-12">
        <div className={selectedTable ? "lg:col-span-8" : "lg:col-span-12"}>
          <div className="grid gap-4 md:grid-cols-4 xl:grid-cols-6">
            {tables.map((table) => (
              <TableCard
                key={table.id}
                table={table}
                active={table.id === selectedTable?.id}
                onSelect={(table) =>
                  setSelectedTable(
                    table.id === selectedTable?.id ? null : table,
                  )
                }
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
    </div>
  );
};
