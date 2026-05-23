import { useQuery } from "@tanstack/react-query";
import { ProductionAreasService } from "../services/production-areas.service";

export const useProductionAreas = () => {
  const getAllQuery = useQuery({
    queryKey: ["production-areas"],
    queryFn: () => ProductionAreasService.getAll(),
  });

  return {
    getAllQuery,
  };
};
