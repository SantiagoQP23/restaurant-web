import { useState } from "react";
import NiceModal from "@ebay/nice-modal-react";
import type { Table } from "@/shared/models/table.model";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
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
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { TableFormDialog } from "./table-form-dialog.component";

type Props = {
  table: Table;
  onUpdate: (
    tableId: string,
    payload: { name: string; description: string; chairs: number },
  ) => void;
  onDelete: (tableId: string) => void;
};

export const EditableTableCard = ({ table, onUpdate, onDelete }: Props) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <Card size="sm">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle>Mesa {table.name}</CardTitle>
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
                  NiceModal.show(TableFormDialog, {
                    title: "Editar mesa",
                    submitLabel: "Guardar cambios",
                    description:
                      "Actualiza el nombre, descripcion y sillas de la mesa.",
                    initialValues: {
                      name: table.name,
                      description: table.description,
                      chairs: table.chairs.toString(),
                    },
                    onSubmit: (values) => onUpdate(table.id, values),
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
        <CardDescription>{table.chairs} sillas</CardDescription>
      </CardHeader>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar mesa</AlertDialogTitle>
            <AlertDialogDescription>
              Estas a punto de eliminar "{table.name}". Esta accion no se puede
              deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => onDelete(table.id)}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};
