import * as React from "react";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { Pencil, PlusIcon, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
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
import { useNavigate } from "@tanstack/react-router";
import { SetupStepper } from "../components/setup-stepper.component";
import type { CreateProductionAreaDto } from "@/modules/production-areas/interfaces/dto/create-production-area.dto";
import { useSetupStore } from "@/shared/store/setup.store";

type ProductionAreaModalProps = {
  title: string;
  submitLabel: string;
  initialValues?: CreateProductionAreaDto;
  onSubmit: (values: CreateProductionAreaDto) => void;
};

const ProductionAreaModal = NiceModal.create(
  ({
    title,
    submitLabel,
    initialValues,
    onSubmit,
  }: ProductionAreaModalProps) => {
    const modal = useModal();
    const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm<CreateProductionAreaDto>({
      defaultValues: {
        name: "",
        description: "",
      },
    });

    React.useEffect(() => {
      if (!modal.visible) {
        return;
      }
      reset({
        name: initialValues?.name ?? "",
        description: initialValues?.description ?? "",
      });
    }, [initialValues?.description, initialValues?.name, modal.visible, reset]);

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
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              Agrega un area para organizar la preparacion de productos.
            </DialogDescription>
          </DialogHeader>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit((values) => {
              onSubmit({
                name: values.name.trim(),
                description: values.description?.trim() || undefined,
              });
              modal.hide();
            })}
          >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="production-area-name">Nombre</FieldLabel>
                <Input
                  id="production-area-name"
                  type="text"
                  placeholder="Cocina"
                  aria-invalid={Boolean(errors.name)}
                  {...register("name", {
                    required: "El nombre es obligatorio.",
                  })}
                />
                {errors.name?.message && (
                  <FieldDescription>{errors.name.message}</FieldDescription>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="production-area-description">
                  Descripcion
                </FieldLabel>
                <Input
                  id="production-area-description"
                  type="text"
                  placeholder="Platos calientes y preparaciones principales."
                  aria-invalid={Boolean(errors.description)}
                  {...register("description")}
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
              <Button type="submit">{submitLabel}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  },
);

export const SetupProductionAreasPage = () => {
  const navigate = useNavigate();
  const productionAreas = useSetupStore((state) => state.productionAreas);
  const addProductionArea = useSetupStore((state) => state.addProductionArea);
  const updateProductionArea = useSetupStore(
    (state) => state.updateProductionArea,
  );
  const removeProductionArea = useSetupStore(
    (state) => state.removeProductionArea,
  );

  return (
    <div className="flex min-h-svh flex-col p-6 md:p-10">
      <div className="w-full max-w-3xl mx-auto flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Areas de producción</h1>
            <p className="text-sm text-muted-foreground">
              Administra las areas donde se preparan los productos.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              NiceModal.show(ProductionAreaModal, {
                title: "Nueva area de produccion",
                submitLabel: "Guardar",
                onSubmit: addProductionArea,
              })
            }
          >
            <PlusIcon />
            Agregar area
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 ">
          {productionAreas.map((area, index) => (
            <Card key={`${area.name}-${index}`} size="sm">
              <CardHeader>
                <CardTitle>{area.name}</CardTitle>
                <CardDescription>{area.description}</CardDescription>
                <CardAction>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Editar ${area.name}`}
                      onClick={() =>
                        NiceModal.show(ProductionAreaModal, {
                          title: "Editar area de produccion",
                          submitLabel: "Guardar cambios",
                          initialValues: {
                            name: area.name,
                            description: area.description,
                          },
                          onSubmit: (values) =>
                            updateProductionArea(index, values),
                        })
                      }
                    >
                      <Pencil />
                    </Button>
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
                          <AlertDialogAction
                            variant="destructive"
                            onClick={() => removeProductionArea(index)}
                          >
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
        <div className="mt-6 flex justify-center">
          <Button onClick={() => navigate({ to: "/setup/menu" })}>
            Guardar y continuar
          </Button>
        </div>
      </div>
      <SetupStepper className="mt-auto pt-6" />
    </div>
  );
};
