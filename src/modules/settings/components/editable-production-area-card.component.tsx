import { useState } from "react";
import NiceModal from "@ebay/nice-modal-react";
import type { ProductionArea } from "@/shared/models/production-area.model";
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
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { ProductionAreaFormDialog } from "./production-area-form-dialog.component";

type Props = {
  area: ProductionArea;
  onDelete: (areaId: number) => void;
};

export const EditableProductionAreaCard = ({ area, onDelete }: Props) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <Card size="sm">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div>
            <CardTitle>{area.name}</CardTitle>
            {area.description && (
              <CardDescription className="text-xs">
                {area.description}
              </CardDescription>
            )}
          </div>
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
                  NiceModal.show(ProductionAreaFormDialog, {
                    title: "Editar área de producción",
                    submitLabel: "Guardar cambios",
                    description: "Actualiza la información del área de producción.",
                    areaId: area.id,
                    initialValues: {
                      name: area.name,
                      description: area.description,
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
      </CardHeader>
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar área de producción</AlertDialogTitle>
            <AlertDialogDescription>
              Estás a punto de eliminar el área de producción &quot;{area.name}&quot;.
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                onDelete(area.id);
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
}