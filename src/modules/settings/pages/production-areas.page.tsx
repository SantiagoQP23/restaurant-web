import { Button } from "@/shared/components/ui/button";
import { Plus } from "lucide-react";
import NiceModal from "@ebay/nice-modal-react";
import { useProductionAreas } from "@/modules/production-areas/hooks/useProductionAreas";
import { EditableProductionAreaCard } from "../components/editable-production-area-card.component";
import { ProductionAreaFormDialog } from "../components/production-area-form-dialog.component";

export const ProductionAreasPage = () => {
  const { productionAreas, deleteProductionArea } = useProductionAreas();

  const handleDeleteArea = (areaId: number) => {
    deleteProductionArea.mutate(areaId);
  };

  return (
    <div className="flex flex-col gap-6 px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Áreas de producción</h1>
          <p className="text-sm text-muted-foreground">
            Gestiona las áreas de producción de tu restaurante
          </p>
        </div>
          <Button
          type="button"
          variant="outline"
          onClick={() =>
            NiceModal.show(ProductionAreaFormDialog, {
              title: "Crear área de producción",
              submitLabel: "Crear área",
              description: "Agrega una nueva área de producción al restaurante.",
              initialValues: {
                name: "",
                description: "",
              },
              printerIds: [],
            })
          }
        >
          <Plus />
          Nueva área
        </Button>
      </div>
      <div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {productionAreas.map((area) => (
            <EditableProductionAreaCard
              key={area.id}
              area={area}
              onDelete={handleDeleteArea}
            />
          ))}
        </div>
      </div>
    </div>
  );
};