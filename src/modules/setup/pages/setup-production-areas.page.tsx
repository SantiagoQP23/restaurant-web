import { Button } from "@/shared/components/ui/button";
import { Plus } from "lucide-react";
import NiceModal from "@ebay/nice-modal-react";
import { useNavigate } from "@tanstack/react-router";
import { useProductionAreas } from "@/modules/production-areas/hooks/useProductionAreas";
import { EditableProductionAreaCard } from "@/modules/settings/components/editable-production-area-card.component";
import { ProductionAreaFormDialog } from "@/modules/settings/components/production-area-form-dialog.component";
import { SetupStepper } from "../components/setup-stepper.component";

export const SetupProductionAreasPage = () => {
  const navigate = useNavigate();
  const { productionAreas, deleteProductionArea } = useProductionAreas();

  const handleDeleteArea = (areaId: number) => {
    deleteProductionArea.mutate(areaId);
  };

  return (
    <div className="flex min-h-svh flex-col p-6 md:p-10">
      <div className="w-full max-w-3xl mx-auto flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-600">Áreas de producción</h1>
            <p className="text-sm text-muted-foreground">
              Administra las áreas donde se preparan los productos.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              NiceModal.show(ProductionAreaFormDialog, {
                title: "Nueva área de producción",
                submitLabel: "Guardar",
                description:
                  "Agrega un área para organizar la preparación de productos.",
                initialValues: {
                  name: "",
                  description: "",
                },
                printerIds: [],
              })
            }
          >
            <Plus />
            Agregar área
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {productionAreas.map((area) => (
            <EditableProductionAreaCard
              key={area.id}
              area={area}
              onDelete={handleDeleteArea}
            />
          ))}
        </div>
        <div className="mt-6 flex justify-center">
          <Button onClick={() => navigate({ to: "/setup/menu" })}>
            Continuar
          </Button>
        </div>
      </div>
      <SetupStepper className="mt-auto pt-6" />
    </div>
  );
};
