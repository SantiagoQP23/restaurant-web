import { queryClient, queryKeys } from "@/app/api/query-client";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import type { Menu } from "@/shared/models/menu.model";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { MenuService } from "../services/menu.service";
import type { Section } from "@/shared/models/section.model";
import type { UpdateSectionDto } from "../interface/dto/update-section.dto";
import { SectionsService } from "../services/sections.service";
import { toast } from "sonner";
import type { CreateSectionDto } from "../interface/dto/create-section.dto";
import type { Category } from "@/shared/models/category.model";
import type { CreateCategoryDto } from "../interface/dto/create-category.dto";
import type { UpdateCategoryDto } from "../interface/dto/update-category.dto";
import { CategoriesService } from "../services/categories.service";
import type { Product } from "@/shared/models/product.model";
import type { UpdateProductDto } from "../interface/dto/update-product.dto";
import { ProductsService } from "../services/products.service";

export const useMenu = () => {
  const { restaurant } = useAuthStore();

  const [sections, setSections] = useState<Section[]>([]);

  // const menuQuery = useQuery<Menu>({
  //   queryKey: [queryKeys.menu.detail(restaurant!.id)],
  //   queryFn: () => MenuService.getAllMenu(restaurant!.id),
  // });

  const sectionsQuery = useQuery<Section[]>({
    queryKey: [queryKeys.menu.detail(restaurant!.id), "sections"],
    queryFn: () =>
      SectionsService.getAll(restaurant!.id).then((sections) => sections),
  });

  const createSection = useMutation<Section, unknown, CreateSectionDto>({
    mutationFn: (data: CreateSectionDto) => SectionsService.create(data),
    onSuccess: (data: Section) => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.menu.detail(restaurant!.id), "sections"],
      });
    },
    onError: (error: unknown) => {
      toast.error("No se pudo crear");
    },
  });

  const updateSection = useMutation<Section, unknown, UpdateSectionDto>({
    mutationFn: (data: UpdateSectionDto) =>
      SectionsService.update(data.id!, data),
    onSuccess: (data: Section) => {
      // enqueueSnackbar('Se actualizó correctamente', { variant: 'success' });
      // dispatch(updateSectionStore(data));
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

  useEffect(() => {
    if (sectionsQuery.isSuccess && sectionsQuery.data) {
      setSections(sectionsQuery.data);
    }
  }, [sectionsQuery.data, sectionsQuery.isSuccess, setSections]);

  return {
    sections,
    updateSection,
    createSection,
    createCategory,
    updateCategory,
    deleteCategory,
    updateProduct,
  };
};
