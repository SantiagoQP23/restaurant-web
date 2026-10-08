import { useQuery, useMutation } from "@tanstack/react-query";
import { ProductionAreasService } from "../services/production-areas.service";
import type { ProductionArea } from "@/shared/models/production-area.model";
import { queryClient } from "@/app/api/query-client";
import { toast } from "sonner";
import type { CreateProductionAreaDto } from "../interfaces/dto/create-production-area.dto";
import type { UpdateProductionAreaDto } from "../interfaces/dto/update-production-area.dto";
import i18n from "@/app/i18n/i18n.config";
import { getErrorMessage } from "@/shared/lib/errors/get-error-message";

export const useProductionAreas = () => {
  const getAllQuery = useQuery({
    queryKey: ["production-areas"],
    queryFn: () => ProductionAreasService.getAll(),
  });

  const productionAreas = getAllQuery.data ?? [];

  const createProductionArea = useMutation<ProductionArea, unknown, CreateProductionAreaDto>({
    mutationFn: (data: CreateProductionAreaDto) => ProductionAreasService.create(data),
    onSuccess: () => {
      toast.success("Área de producción creada correctamente");
      queryClient.invalidateQueries({ queryKey: ["production-areas"] });
    },
    onError: (error) => {
      console.log("Error creating production area", error);
      toast.error(
        getErrorMessage(error, { fallback: i18n.t("actionErrors.productionAreas.create") }),
      );
    },
  });

  const updateProductionArea = useMutation<ProductionArea, unknown, UpdateProductionAreaDto>({
    mutationFn: (data: UpdateProductionAreaDto) => ProductionAreasService.update(data),
    onSuccess: () => {
      toast.success("Área de producción actualizada correctamente");
      queryClient.invalidateQueries({ queryKey: ["production-areas"] });
    },
    onError: (error) => {
      console.log("Error updating production area", error);
      toast.error(
        getErrorMessage(error, { fallback: i18n.t("actionErrors.productionAreas.update") }),
      );
    },
  });

  const deleteProductionArea = useMutation<void, unknown, number>({
    mutationFn: (id: number) => ProductionAreasService.delete(id),
    onSuccess: () => {
      toast.success("Área de producción eliminada correctamente");
      queryClient.invalidateQueries({ queryKey: ["production-areas"] });
    },
    onError: (error) => {
      console.log("Error deleting production area", error);
      toast.error(
        getErrorMessage(error, { fallback: i18n.t("actionErrors.productionAreas.delete") }),
      );
    },
  });

  return {
    getAllQuery,
    productionAreas,
    createProductionArea,
    updateProductionArea,
    deleteProductionArea,
  };
};
