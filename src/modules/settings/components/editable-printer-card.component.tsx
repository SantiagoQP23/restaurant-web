import { useState } from "react";
import NiceModal from "@ebay/nice-modal-react";
import type { Printer } from "@/shared/models/printer.model";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { MoreVertical, Pencil, Trash2, PrinterIcon } from "lucide-react";
import { PrinterFormDialog } from "./printer-form-dialog.component";

type Props = {
  printer: Printer;
  onDelete: (printerId: string) => void;
  isTesting?: boolean;
};

export const EditablePrinterCard = ({ printer, onDelete }: Props) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <Card size="sm">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="gap-4 flex flex-col">
            <PrinterIcon size={18} />
            <div>
              <CardTitle>{printer.name}</CardTitle>
              <CardDescription className="text-xs">
                {printer.connectionType === "TCP" && printer.ipAddress
                  ? `${printer.ipAddress}:${printer.port}`
                  : `Puerto ${printer.port}`}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* <Button */}
            {/*   variant="outline" */}
            {/*   size="sm" */}
            {/*   onClick={handleTestPrinter} */}
            {/*   disabled={testPrinter.isPending} */}
            {/* > */}
            {/*   {isTesting ? "Probando..." : "Test"} */}
            {/* </Button> */}
            {/* <Switch */}
            {/*   checked={printer.isActive} */}
            {/*   onCheckedChange={(checked) => { */}
            {/*     onToggleActive?.(printer.id, checked); */}
            {/*   }} */}
            {/*   aria-label={`Activar impresora ${printer.name}`} */}
            {/* /> */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Opciones"
                >
                  <MoreVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() =>
                    NiceModal.show(PrinterFormDialog, {
                      title: "Editar impresora",
                      submitLabel: "Guardar cambios",
                      description:
                        "Actualiza la configuración de la impresora.",
                      printerId: printer.id,
                      initialValues: {
                        name: printer.name,
                        connectionType: printer.connectionType,
                        ipAddress: printer.ipAddress ?? "",
                        port: printer.port.toString(),
                        isActive: printer.isActive,
                      },
                    })
                  }
                >
                  <Pencil /> Editar
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => setIsDeleteOpen(true)}
                >
                  <Trash2 /> Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar impresora</AlertDialogTitle>
            <AlertDialogDescription>
              Estas a punto de eliminar la impresora &quot;{printer.name}&quot;.
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                onDelete(printer.id);
                setIsDeleteOpen(false);
              }}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};
