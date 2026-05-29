import { useQuery } from "@tanstack/react-query";
import { ProductionAreasService } from "../services/production-areas.service";
import { useEffect, useState } from "react";
import type { ProductionArea } from "@/shared/models/production-area.model";

export const useProductionAreas = () => {
  const [productionAreas, setProductionAreas] = useState<ProductionArea[]>([]);
  const getAllQuery = useQuery({
    queryKey: ["production-areas"],
    queryFn: () => ProductionAreasService.getAll(),
  });

  useEffect(() => {
    if (getAllQuery.isSuccess && getAllQuery.data) {
      setProductionAreas(getAllQuery.data);
    }
  }, [getAllQuery.data, getAllQuery.isSuccess, setProductionAreas]);

  return {
    getAllQuery,
    productionAreas,
  };
};
