import { queryClient, queryKeys } from "@/app/api/query-client";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Section } from "@/shared/models/section.model";
import type { Category } from "@/shared/models/category.model";
import type { Product } from "@/shared/models/product.model";
import type { CreateSectionDto } from "../interface/dto/create-section.dto";
import type { UpdateSectionDto } from "../interface/dto/update-section.dto";
import { SectionsService } from "../services/sections.service";
import type { CreateCategoryDto } from "../interface/dto/create-category.dto";
import type { UpdateCategoryDto } from "../interface/dto/update-category.dto";
import { CategoriesService } from "../services/categories.service";
import type { CreateProductDto } from "../interface/dto/create-product.dto";
import type { UpdateProductDto } from "../interface/dto/update-product.dto";
import { ProductsService } from "../services/products.service";

export const useMenuMutations = () => {
  const { restaurant } = useAuthStore();

  const createSection = useMutation<Section, unknown, CreateSectionDto>({
    mutationFn: (data: CreateSectionDto) => SectionsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.menu.detail(restaurant!.id), "sections"],
      });
    },
    onError: () => {
      toast.error("No se pudo crear");
    },
  });

  const updateSection = useMutation<Section, unknown, UpdateSectionDto>({
    mutationFn: (data: UpdateSectionDto) =>
      SectionsService.update(data.id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.menu.detail(restaurant!.id), "sections"],
      });
    },
    onError: () => {
      toast.error("No se pudo actualizar");
    },
  });

  const createCategory = useMutation<Category, unknown, CreateCategoryDto>({
    mutationFn: (data: CreateCategoryDto) => CategoriesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.menu.detail(restaurant!.id), "sections"],
      });
    },
    onError: () => {
      toast.error("No se pudo crear la categoria");
    },
  });

  const updateCategory = useMutation<Category, unknown, UpdateCategoryDto>({
    mutationFn: (data: UpdateCategoryDto) =>
      CategoriesService.update(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.menu.detail(restaurant!.id), "sections"],
      });
    },
    onError: () => {
      toast.error("No se pudo actualizar la categoria");
    },
  });

  const deleteCategory = useMutation<void, unknown, string>({
    mutationFn: (id: string) => CategoriesService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.menu.detail(restaurant!.id), "sections"],
      });
    },
    onError: () => {
      toast.error("No se pudo eliminar la categoria");
    },
  });

  const createProduct = useMutation<Product, unknown, CreateProductDto>({
    mutationFn: (data: CreateProductDto) => ProductsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.menu.detail(restaurant!.id), "products"],
      });
    },
    onError: () => {
      toast.error("No se pudo crear el producto");
    },
  });

  const updateProduct = useMutation<Product, unknown, UpdateProductDto>({
    mutationFn: (data: UpdateProductDto) =>
      ProductsService.update(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.menu.detail(restaurant!.id), "products"],
      });
    },
    onError: () => {
      toast.error("No se pudo actualizar el producto");
    },
  });

  return {
    createSection,
    updateSection,
    createCategory,
    updateCategory,
    deleteCategory,
    createProduct,
    updateProduct,
  };
};
