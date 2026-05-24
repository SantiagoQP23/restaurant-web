import type { Table } from "@/shared/models/table.model";
import { useEffect, useState } from "react";
import { EditableTableCard } from "../components/editable-table-card.component";
import { useTables } from "@/modules/tables/hooks/useTables";
import { Button } from "@/shared/components/ui/button";
import NiceModal from "@ebay/nice-modal-react";
import { TableFormDialog } from "../components/table-form-dialog.component";
import { Plus } from "lucide-react";

export const TablesSettings = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const { getAllTablesQuery, createTable, updateTable } = useTables();

  useEffect(() => {
    if (getAllTablesQuery.isSuccess && getAllTablesQuery.data) {
      setTables(getAllTablesQuery.data);
    }
  }, [getAllTablesQuery.data, getAllTablesQuery.isSuccess]);

  const handleCreateTable = (payload: {
    name: string;
    description: string;
    chairs: number;
  }) => {
    return createTable.mutateAsync(payload).then(
      () => true,
      () => false,
    );
  };

  const handleUpdateTable = (
    tableId: string,
    payload: { name: string; description: string; chairs: number },
  ) => {
    return updateTable.mutateAsync({ id: tableId, ...payload }).then(
      () => true,
      () => false,
    );
  };

  const handleDeleteTable = (tableId: string) => {
    console.log("Delete table", tableId);
  };

  return (
    <div className="flex flex-col gap-6 p-6 md:p-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Mesas</h1>
          <p className="text-sm text-muted-foreground">
            Gestiona las mesas activas y crea pedidos rapidamente.
          </p>
        </div>
        <Button
          type="button"
          onClick={() =>
            NiceModal.show(TableFormDialog, {
              title: "Crear mesa",
              submitLabel: "Crear mesa",
              description: "Agrega una mesa nueva al restaurante.",
              isEdit: false,
              initialValues: {
                name: "",
                description: "",
                chairs: "4",
              },
              onSubmit: handleCreateTable,
            })
          }
        >
          <Plus />
          Nueva mesa
        </Button>
      </div>
      {/* <div className={selectedTable ? "lg:col-span-8" : "lg:col-span-12"}> */}
      <div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {tables.map((table) => (
            <EditableTableCard
              key={table.id}
              table={table}
              onUpdate={handleUpdateTable}
              onDelete={handleDeleteTable}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
