import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import type { Table } from "@/shared/models/table.model";
import { Button } from "@/shared/components/ui/button";
import NiceModal from "@ebay/nice-modal-react";
import { Plus } from "lucide-react";
import { useTables } from "@/modules/tables/hooks/useTables";
import { EditableTableCard } from "@/modules/settings/components/editable-table-card.component";
import { TableFormDialog } from "@/modules/settings/components/table-form-dialog.component";
import { SetupStepper } from "../components/setup-stepper.component";
import { WhatsappFAB } from "../components/whatsapp-fab.component";

export const TablesSetupPage = () => {
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
    <div className="flex min-h-svh flex-col p-6 md:p-10">
      <div className="flex flex-1 flex-col gap-6 w-full max-w-7xl mx-auto">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Mesas</h1>
            <p className="text-sm text-muted-foreground">
              Gestiona las mesas activas y crea pedidos rapidamente.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            className="rounded-full"
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
            <Plus className="h-4 w-4 mr-2" />
            Nueva mesa
          </Button>
        </div>

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

        <div className="flex justify-end">
          <Button asChild className="rounded-full px-6">
            <Link to="/setup/payment-methods">Continuar</Link>
          </Button>
        </div>
      </div>
      <SetupStepper className="mt-auto pt-6" />
      <WhatsappFAB />
    </div>
  );
};
