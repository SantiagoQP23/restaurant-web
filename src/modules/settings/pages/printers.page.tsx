import { useEffect, useRef, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Plus } from "lucide-react";
import NiceModal from "@ebay/nice-modal-react";
import type { Printer } from "@/shared/models/printer.model";
import { usePrinters } from "../hooks/usePrinters";
import { EditablePrinterCard } from "../components/editable-printer-card.component";
import { PrinterFormDialog } from "../components/printer-form-dialog.component";

export const PrintersPage = () => {
  const { getAllQuery, updatePrinter, deletePrinter } = usePrinters();
  const [printers, setPrinters] = useState<Printer[]>([]);

  useEffect(() => {
    if (getAllQuery.isSuccess && getAllQuery.data) {
      setPrinters(getAllQuery.data);
    }
  }, [getAllQuery.data, getAllQuery.isSuccess]);

  const handleDeletePrinter = (printerId: string) => {
    deletePrinter.mutate(printerId);
  };

  const handleToggleActive = (printerId: string, isActive: boolean) => {
    const printer = printers.find((p) => p.id === printerId);
    if (!printer) return;

    updatePrinter.mutate({
      id: printerId,
      name: printer.name,
      connectionType: printer.connectionType,
      ipAddress: printer.ipAddress,
      port: printer.port,
    });
  };

  return (
    <div className="flex flex-col gap-6 px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Impresoras</h1>
          <p className="text-sm text-muted-foreground">
            Gestiona las impresoras conectadas a tu restaurante
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            NiceModal.show(PrinterFormDialog, {
              title: "Crear impresora",
              submitLabel: "Crear impresora",
              description: "Agrega una impresora nueva al restaurante.",
              printerId: "",
              initialValues: {
                name: "",
                connectionType: "TCP",
                ipAddress: "",
                port: "9100",
                isActive: true,
              },
            })
          }
        >
          <Plus />
          Nueva impresora
        </Button>
      </div>
      <div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {printers.map((printer) => (
            <EditablePrinterCard
              key={printer.id}
              printer={printer}
              onDelete={handleDeletePrinter}
              onToggleActive={handleToggleActive}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

