import * as React from "react";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { Grid3X3, Pencil, Trash2 } from "lucide-react";
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
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import type { Table } from "@/shared/models/table.model";
import { SetupStepper } from "../components/setup-stepper.component";

const createTables = (quantity: number): Table[] =>
  Array.from({ length: quantity }, (_, index) => {
    const order = index + 1;
    return {
      id: `table-${order}`,
      name: `Mesa ${order}`,
      description: `Mesa ${order}`,
      chairs: 4,
      isAvailable: true,
      order,
      isActive: true,
    };
  });

const CreateTablesModal = NiceModal.create(
  ({
    initialQuantity,
    onCreate,
  }: {
    initialQuantity: string;
    onCreate: (quantity: number) => void;
  }) => {
    const modal = useModal();
    const [value, setValue] = React.useState(initialQuantity);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const parsedQuantity = Number.parseInt(value, 10);
      if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
        return;
      }
      onCreate(parsedQuantity);
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
            <DialogTitle>Cantidad de mesas</DialogTitle>
            <DialogDescription>
              Actualiza la cantidad total de mesas del restaurante.
            </DialogDescription>
          </DialogHeader>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="tables-quantity-dialog">
                  Cuantas mesas tiene tu restaurante
                </FieldLabel>
                <Input
                  id="tables-quantity-dialog"
                  type="number"
                  min={1}
                  inputMode="numeric"
                  value={value}
                  onChange={(event) => setValue(event.target.value)}
                  required
                />
                <FieldDescription>
                  Puedes ajustar esta cantidad mas adelante.
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
  },
);

const AddTableModal = NiceModal.create(
  ({ onCreate }: { onCreate: (table: Table) => void }) => {
    const modal = useModal();
    const [name, setName] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [chairs, setChairs] = React.useState("4");

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const parsedChairs = Number.parseInt(chairs, 10);
      if (!Number.isFinite(parsedChairs) || parsedChairs <= 0) {
        return;
      }
      onCreate({
        id: `table-${crypto.randomUUID()}`,
        name,
        description,
        chairs: parsedChairs,
        isAvailable: true,
        order: 0,
        isActive: true,
      });
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
            <DialogTitle>Nueva mesa</DialogTitle>
            <DialogDescription>
              Agrega una mesa personalizada a tu restaurante.
            </DialogDescription>
          </DialogHeader>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="table-name">Nombre</FieldLabel>
                <Input
                  id="table-name"
                  type="text"
                  placeholder="Mesa terraza"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="table-description">Descripcion</FieldLabel>
                <Input
                  id="table-description"
                  type="text"
                  placeholder="Cerca de la ventana"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  required
                />
                <FieldDescription>
                  Puedes anadir una ubicacion o nota especial.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="table-chairs">Sillas</FieldLabel>
                <Input
                  id="table-chairs"
                  type="number"
                  min={1}
                  inputMode="numeric"
                  value={chairs}
                  onChange={(event) => setChairs(event.target.value)}
                  required
                />
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
  },
);

const EditTableModal = NiceModal.create(
  ({ table, onUpdate }: { table: Table; onUpdate: (table: Table) => void }) => {
    const modal = useModal();
    const [name, setName] = React.useState(table.name);
    const [description, setDescription] = React.useState(table.description);
    const [chairs, setChairs] = React.useState(table.chairs.toString());

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const parsedChairs = Number.parseInt(chairs, 10);
      if (!Number.isFinite(parsedChairs) || parsedChairs <= 0) {
        return;
      }
      onUpdate({
        ...table,
        name,
        description,
        chairs: parsedChairs,
      });
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
            <DialogTitle>Editar mesa</DialogTitle>
            <DialogDescription>
              Actualiza la informacion de "{table.name}".
            </DialogDescription>
          </DialogHeader>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor={`edit-table-name-${table.id}`}>
                  Nombre
                </FieldLabel>
                <Input
                  id={`edit-table-name-${table.id}`}
                  type="text"
                  placeholder="Mesa terraza"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor={`edit-table-description-${table.id}`}>
                  Descripcion
                </FieldLabel>
                <Input
                  id={`edit-table-description-${table.id}`}
                  type="text"
                  placeholder="Cerca de la ventana"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  required
                />
                <FieldDescription>
                  Puedes anadir una ubicacion o nota especial.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor={`edit-table-chairs-${table.id}`}>
                  Sillas
                </FieldLabel>
                <Input
                  id={`edit-table-chairs-${table.id}`}
                  type="number"
                  min={1}
                  inputMode="numeric"
                  value={chairs}
                  onChange={(event) => setChairs(event.target.value)}
                  required
                />
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
  },
);

export const TablesPage = () => {
  const [quantity, setQuantity] = React.useState("10");
  const [tables, setTables] = React.useState<Table[]>([]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsedQuantity = Number.parseInt(quantity, 10);
    if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
      setTables([]);
      return;
    }
    setTables(createTables(parsedQuantity));
  };

  const handleCreateTables = (nextQuantity: number) => {
    if (!Number.isFinite(nextQuantity) || nextQuantity <= 0) {
      setTables([]);
      return;
    }
    setQuantity(nextQuantity.toString());
    setTables(createTables(nextQuantity));
  };

  const handleCreateTable = (table: Table) => {
    setTables((current) => {
      const order = current.length + 1;
      return [
        ...current,
        {
          ...table,
          order,
          name: table.name || `Mesa ${order}`,
          description: table.description || `Mesa ${order}`,
        },
      ];
    });
  };

  const handleRemoveTable = (tableId: string) => {
    setTables((current) => current.filter((table) => table.id !== tableId));
  };

  const handleUpdateTable = (updatedTable: Table) => {
    setTables((current) =>
      current.map((table) =>
        table.id === updatedTable.id ? updatedTable : table,
      ),
    );
  };

  return (
    <div className="flex min-h-svh flex-col p-6 md:p-10">
      <div className="flex flex-col gap-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Mesas</h1>
            <p className="text-sm text-muted-foreground">
              Define la cantidad de mesas para empezar.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {tables.length > 0 && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Editar cantidad de mesas"
                onClick={() =>
                  NiceModal.show(CreateTablesModal, {
                    initialQuantity: quantity,
                    onCreate: handleCreateTables,
                  })
                }
              >
                <Grid3X3 />
              </Button>
            )}
            <Button
              type="button"
              onClick={() =>
                NiceModal.show(AddTableModal, { onCreate: handleCreateTable })
              }
            >
              Agregar mesa
            </Button>
          </div>
        </div>
        {tables.length === 0 && (
          <form className="max-w-lg" onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="tables-quantity">
                  Cuantas mesas tiene tu restaurante
                </FieldLabel>
                <Input
                  id="tables-quantity"
                  type="number"
                  min={1}
                  inputMode="numeric"
                  value={quantity}
                  onChange={(event) => setQuantity(event.target.value)}
                  required
                />
                <FieldDescription>
                  Puedes ajustar esta cantidad mas adelante.
                </FieldDescription>
              </Field>
              <Field>
                <Button type="submit">Crear mesas</Button>
              </Field>
            </FieldGroup>
          </form>
        )}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {tables.length === 0 ? (
            <Card size="sm">
              <CardHeader>
                <CardTitle>Sin mesas creadas</CardTitle>
                <CardDescription>
                  Ingresa una cantidad y presiona "Crear mesas".
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            tables.map((table) => (
              <Card key={table.id} size="sm">
                <CardHeader>
                  <CardTitle>{table.name}</CardTitle>
                  <CardDescription>
                    {table.chairs} sillas · {table.description}
                  </CardDescription>
                  <CardAction>
                    <div className="flex items-center gap-2">
                      {/* <span */}
                      {/*   className={ */}
                      {/*     table.isAvailable */}
                      {/*       ? "rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700" */}
                      {/*       : "rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground" */}
                      {/*   } */}
                      {/* > */}
                      {/*   {table.isAvailable ? "Disponible" : "Ocupada"} */}
                      {/* </span> */}
                      {/* <span */}
                      {/*   className={ */}
                      {/*     table.isActive */}
                      {/*       ? "rounded-full bg-sky-100 px-2 py-1 text-xs font-medium text-sky-700" */}
                      {/*       : "rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground" */}
                      {/*   } */}
                      {/* > */}
                      {/*   {table.isActive ? "Activa" : "Inactiva"} */}
                      {/* </span> */}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`Editar ${table.name}`}
                        onClick={() =>
                          NiceModal.show(EditTableModal, {
                            table,
                            onUpdate: handleUpdateTable,
                          })
                        }
                      >
                        <Pencil />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label={`Eliminar ${table.name}`}
                          >
                            <Trash2 />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Eliminar mesa</AlertDialogTitle>
                            <AlertDialogDescription>
                              Estas a punto de eliminar "{table.name}". Esta
                              accion no se puede deshacer.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              variant="destructive"
                              onClick={() => handleRemoveTable(table.id)}
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
            ))
          )}
        </div>
        <SetupStepper className="mt-auto pt-6" />
      </div>
    </div>
  );
};
