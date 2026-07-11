import { queryKeys } from "@/app/api/query-client";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { Section } from "@/shared/models/section.model";
import { SectionsService } from "../services/sections.service";
import { useMenuMutations } from "./useMenuMutations";

export const useMenu = () => {
  const { restaurant } = useAuthStore();

  const [sections, setSections] = useState<Section[]>([]);

  const sectionsQuery = useQuery<Section[]>({
    queryKey: [queryKeys.menu.detail(restaurant!.id), "sections"],
    queryFn: () =>
      SectionsService.getAll(restaurant!.id).then((sections) => sections),
  });

  const {
    createSection,
    updateSection,
    createCategory,
    updateCategory,
    deleteCategory,
    updateProduct,
  } = useMenuMutations();

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
