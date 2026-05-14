import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CreateProductionAreaDto } from "@/modules/production-areas/interfaces/dto/create-production-area.dto";
import type { CreateRestaurantDto } from "@/modules/restaurant/interface/dto/create-restaurant.dto";

type SetupState = {
  restaurant: CreateRestaurantDto | null;
  productionAreas: CreateProductionAreaDto[];
  setRestaurant: (values: CreateRestaurantDto) => void;
  updateRestaurant: (values: Partial<CreateRestaurantDto>) => void;
  addProductionArea: (values: CreateProductionAreaDto) => void;
  updateProductionArea: (index: number, values: CreateProductionAreaDto) => void;
  removeProductionArea: (index: number) => void;
  resetSetup: () => void;
};

const initialProductionAreas: CreateProductionAreaDto[] = [
  {
    name: "Cocina",
    description: "Preparacion principal de platos calientes.",
  },
  {
    name: "Bar",
    description: "Cocteles, bebidas frias y cafe.",
  },
  {
    name: "Postres",
    description: "Pasteleria y emplatado de dulces.",
  },
];

const initialState = {
  restaurant: null,
  productionAreas: initialProductionAreas,
};

export const useSetupStore = create<SetupState>()(
  persist(
    (set, get) => ({
      ...initialState,
      setRestaurant: (values) => set({ restaurant: values }),
      updateRestaurant: (values) =>
        set({
          restaurant: get().restaurant
            ? { ...get().restaurant, ...values }
            : null,
        }),
      addProductionArea: (values) =>
        set((state) => ({
          productionAreas: [...state.productionAreas, values],
        })),
      updateProductionArea: (index, values) =>
        set((state) => ({
          productionAreas: state.productionAreas.map((area, areaIndex) =>
            areaIndex === index ? values : area,
          ),
        })),
      removeProductionArea: (index) =>
        set((state) => ({
          productionAreas: state.productionAreas.filter(
            (_, areaIndex) => areaIndex !== index,
          ),
        })),
      resetSetup: () => set({ ...initialState }),
    }),
    {
      name: "setup-store",
    },
  ),
);
