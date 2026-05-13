import * as React from "react";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";
import {
  Card,
  CardAction,
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
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import type { ProductionArea } from "@/shared/models/production-area.model";
import { useNavigate } from "@tanstack/react-router";
import { SetupStepper } from "../components/setup-stepper.component";

const productionAreas: ProductionArea[] = [
  {
    id: 1,
    name: "Cocina",
    description: "Preparacion principal de platos calientes.",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    name: "Bar",
    description: "Cocteles, bebidas frias y cafe.",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    name: "Postres",
    description: "Pasteleria y emplatado de dulces.",
    isActive: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const AddProductionAreaModal = NiceModal.create(() => {
  const modal = useModal();
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    modal.hide();
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
          <DialogTitle>Nueva area de produccion</DialogTitle>
          <DialogDescription>
            Agrega un area para organizar la preparacion de productos.
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="production-area-name">Nombre</FieldLabel>
              <Input
                id="production-area-name"
                type="text"
                placeholder="Cocina"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="production-area-description">
                Descripcion
              </FieldLabel>
              <Input
                id="production-area-description"
                type="text"
                placeholder="Platos calientes y preparaciones principales."
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                required
              />
              <FieldDescription>
                Describe brevemente las tareas de esta area.
              </FieldDescription>
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit">Guardar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
});

export const ProductionAreasPage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-svh flex-col p-6 md:p-10">
      <div className="w-full max-w-3xl mx-auto flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Areas de produccion</h1>
            <p className="text-sm text-muted-foreground">
              Administra las areas donde se preparan los productos.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => NiceModal.show(AddProductionAreaModal)}
          >
            Agregar area
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 ">
          {productionAreas.map((area) => (
            <Card key={area.id} size="sm">
              <CardHeader>
                <CardTitle>{area.name}</CardTitle>
                <CardDescription>{area.description}</CardDescription>
                <CardAction>
                  <div className="flex items-center gap-2">
                    {/* <span */}
                    {/*   className={ */}
                    {/*     area.isActive */}
                    {/*       ? "rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700" */}
                    {/*       : "rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground" */}
                    {/*   } */}
                    {/* > */}
                    {/*   {area.isActive ? "Activo" : "Inactivo"} */}
                    {/* </span> */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label={`Eliminar ${area.name}`}
                        >
                          <Trash2 />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Eliminar area de produccion
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Estas a punto de eliminar "{area.name}". Esta accion
                            no se puede deshacer.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction variant="destructive">
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardAction>
              </CardHeader>
            </Card>
          ))}
        </div>
        <Button onClick={() => navigate({ to: "/setup/menu" })}>
          Guardar y continuar
        </Button>
      </div>
      <SetupStepper className="mt-auto pt-6" />
    </div>
  );
};
