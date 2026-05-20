import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  CreateCategoryProductDto,
  CreateMenuDto,
} from "@/modules/menu/interface/dto/create-menu.dto";
import type { CreateProductionAreaDto } from "@/modules/production-areas/interfaces/dto/create-production-area.dto";
import type { CreateRestaurantDto } from "@/modules/restaurant/interface/dto/create-restaurant.dto";

type SetupState = {
  restaurant: CreateRestaurantDto | null;
  menu: CreateMenuDto;
  productionAreas: CreateProductionAreaDto[];
  setRestaurant: (values: CreateRestaurantDto) => void;
  updateRestaurant: (values: Partial<CreateRestaurantDto>) => void;
  setMenu: (menu: CreateMenuDto) => void;
  addMenuSection: (name: string) => void;
  updateMenuSection: (index: number, name: string) => void;
  removeMenuSection: (index: number) => void;
  addMenuCategory: (sectionIndex: number, name: string) => void;
  updateMenuCategory: (
    sectionIndex: number,
    categoryIndex: number,
    name: string,
  ) => void;
  removeMenuCategory: (sectionIndex: number, categoryIndex: number) => void;
  addMenuProduct: (
    sectionIndex: number,
    categoryIndex: number,
    product: CreateCategoryProductDto,
  ) => void;
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
  menu: {
    sections: [
      {
        name: "Entradas",
        categories: [
          {
            name: "Frios",
            products: [
              { name: "Ceviche de camaron", description: "Ceviche fresco" },
              { name: "Ensalada fresca", description: "Mix de vegetales" },
            ],
          },
          {
            name: "Calientes",
            products: [{ name: "Sopa del dia", description: "Sopa caliente" }],
          },
        ],
      },
      {
        name: "Platos fuertes",
        categories: [
          {
            name: "Carnes",
            products: [
              { name: "Lomo a la parrilla", description: "Carne a la parrilla" },
              { name: "Bife de chorizo", description: "Corte premium" },
            ],
          },
          {
            name: "Pastas",
            products: [
              { name: "Lasagna de la casa", description: "Pasta horneada" },
            ],
          },
          {
            name: "Vegetarianos",
            products: [
              { name: "Bowl vegetariano", description: "Mix vegetal" },
            ],
          },
        ],
      },
      {
        name: "Bebidas",
        categories: [
          {
            name: "Frias",
            products: [
              { name: "Limonada", description: "Bebida fresca" },
              { name: "Te helado", description: "Infusion fria" },
            ],
          },
          {
            name: "Calientes",
            products: [],
          },
        ],
      },
    ],
  },
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
      setMenu: (menu) => set({ menu }),
      addMenuSection: (name) =>
        set((state) => ({
          menu: {
            sections: [
              ...state.menu.sections,
              { name, categories: [] },
            ],
          },
        })),
      updateMenuSection: (index, name) =>
        set((state) => ({
          menu: {
            sections: state.menu.sections.map((section, sectionIndex) =>
              sectionIndex === index ? { ...section, name } : section,
            ),
          },
        })),
      removeMenuSection: (index) =>
        set((state) => ({
          menu: {
            sections: state.menu.sections.filter(
              (_, sectionIndex) => sectionIndex !== index,
            ),
          },
        })),
      addMenuCategory: (sectionIndex, name) =>
        set((state) => ({
          menu: {
            sections: state.menu.sections.map((section, currentIndex) =>
              currentIndex === sectionIndex
                ? {
                    ...section,
                    categories: [
                      ...section.categories,
                      { name, products: [] },
                    ],
                  }
                : section,
            ),
          },
        })),
      updateMenuCategory: (sectionIndex, categoryIndex, name) =>
        set((state) => ({
          menu: {
            sections: state.menu.sections.map((section, currentIndex) =>
              currentIndex === sectionIndex
                ? {
                    ...section,
                    categories: section.categories.map((category, index) =>
                      index === categoryIndex ? { ...category, name } : category,
                    ),
                  }
                : section,
            ),
          },
        })),
      removeMenuCategory: (sectionIndex, categoryIndex) =>
        set((state) => ({
          menu: {
            sections: state.menu.sections.map((section, currentIndex) =>
              currentIndex === sectionIndex
                ? {
                    ...section,
                    categories: section.categories.filter(
                      (_, index) => index !== categoryIndex,
                    ),
                  }
                : section,
            ),
          },
        })),
      addMenuProduct: (sectionIndex, categoryIndex, product) =>
        set((state) => ({
          menu: {
            sections: state.menu.sections.map((section, currentIndex) =>
              currentIndex === sectionIndex
                ? {
                    ...section,
                    categories: section.categories.map((category, index) =>
                      index === categoryIndex
                        ? {
                            ...category,
                            products: [...category.products, product],
                          }
                        : category,
                    ),
                  }
                : section,
            ),
          },
        })),
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
