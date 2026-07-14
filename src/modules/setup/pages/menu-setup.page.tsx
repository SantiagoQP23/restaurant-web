import * as React from "react";
import { Link } from "@tanstack/react-router";
import NiceModal from "@ebay/nice-modal-react";
import { useQuery } from "@tanstack/react-query";
import type { Section } from "@/shared/models/section.model";
import type { Category } from "@/shared/models/category.model";
import type { Product } from "@/shared/models/product.model";
import { Button } from "@/shared/components/ui/button";
import { Plus } from "lucide-react";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { ProductsService } from "@/modules/menu/services/products.service";
import { queryKeys } from "@/app/api/query-client";
import { useMenu } from "@/modules/menu/hooks/useMenu";
import { MenuSectionDialog } from "@/modules/menu/components/menu-section-dialog.component";
import { SetupStepper } from "../components/setup-stepper.component";
import { MenuSetupSearch } from "@/modules/menu/components/menu-setup/menu-setup-search.component";
import { SectionAccordion } from "@/modules/menu/components/menu-setup/section-accordion.component";
import type { MenuProduct } from "@/modules/menu/components/menu-setup/menu-setup.types";

type MenuCategory = Category & { products: Product[] };
type MenuSection = Section & { categories: MenuCategory[] };

export const MenuSetupPage = () => {
  const { sections: fetchedSections, createSection } = useMenu();
  const { restaurant } = useAuthStore();
  const [sections, setSections] = React.useState<MenuSection[]>([]);
  const [expandedSections, setExpandedSections] = React.useState<Set<string>>(
    new Set(),
  );
  const [expandedCategories, setExpandedCategories] = React.useState<
    Set<string>
  >(new Set());
  const [searchQuery, setSearchQuery] = React.useState("");

  const productsQuery = useQuery<MenuProduct[]>({
    queryKey: [queryKeys.menu.detail(restaurant!.id), "products"],
    queryFn: () => ProductsService.getAll(restaurant!.id),
    enabled: Boolean(restaurant?.id),
  });

  const productsByCategory = React.useMemo(() => {
    const byId = new Map<string, MenuProduct[]>();
    const byName = new Map<string, MenuProduct[]>();
    (productsQuery.data ?? []).forEach((product) => {
      if (product.categoryId) {
        const current = byId.get(product.categoryId) ?? [];
        byId.set(product.categoryId, [...current, product]);
      }
      const categoryName = product.category?.name?.trim();
      if (categoryName) {
        const key = categoryName.toLowerCase();
        const current = byName.get(key) ?? [];
        byName.set(key, [...current, product]);
      }
    });
    return { byId, byName };
  }, [productsQuery.data]);

  const categoryData = React.useMemo(() => {
    const productsMap = new Map<string, MenuProduct[]>();
    const countsMap = new Map<string, number>();

    sections.forEach((section) => {
      section.categories.forEach((category) => {
        const categoryId = (category as { id?: string }).id;
        const all = categoryId
          ? (productsByCategory.byId.get(categoryId) ?? [])
          : (productsByCategory.byName.get(category.name.toLowerCase()) ??
              []);

        countsMap.set(category.id, all.length);

        if (!searchQuery.trim()) {
          productsMap.set(category.id, all);
        } else {
          const q = searchQuery.toLowerCase();
          productsMap.set(
            category.id,
            all.filter((p) => p.name.toLowerCase().includes(q)),
          );
        }
      });
    });

    return { productsMap, countsMap };
  }, [sections, productsByCategory, searchQuery]);

  React.useEffect(() => {
    if (fetchedSections) {
      const mapped = fetchedSections.map((section) => ({
        ...section,
        categories: section.categories ?? [],
      })) as MenuSection[];
      setSections(mapped);
      setExpandedSections(new Set(mapped.map((s) => s.id)));
      setExpandedCategories(
        new Set(mapped.flatMap((s) => s.categories.map((c) => c.id))),
      );
    }
  }, [fetchedSections]);

  const toggleSection = (sectionId: string, open: boolean) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (open) next.add(sectionId);
      else next.delete(sectionId);
      return next;
    });
  };

  const toggleCategory = (categoryId: string, open: boolean) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (open) next.add(categoryId);
      else next.delete(categoryId);
      return next;
    });
  };

  const filteredSections = React.useMemo(() => {
    if (!searchQuery.trim()) return sections;
    return sections
      .map((section) => ({
        ...section,
        categories: section.categories.filter((category) => {
          const products = categoryData.productsMap.get(category.id) ?? [];
          return products.length > 0;
        }),
      }))
      .filter((section) => section.categories.length > 0);
  }, [sections, categoryData, searchQuery]);

  return (
    <div className="flex min-h-svh flex-col p-6 md:p-10">
      <div className="flex flex-1 flex-col gap-6 w-full max-w-4xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold">Menú</h1>
          <p className="text-sm text-muted-foreground">
            Organiza tus secciones, categorías y productos del menú.
          </p>
        </div>

        {/* Search */}
        <MenuSetupSearch value={searchQuery} onChange={setSearchQuery} />

        {/* Sections */}
        <div className="flex flex-col gap-4">
        {filteredSections.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/60 px-4 py-8 text-sm text-muted-foreground text-center">
            {searchQuery.trim()
              ? "No se encontraron productos."
              : "No hay secciones creadas aún."}
          </div>
        ) : (
          filteredSections.map((section, sectionIndex) => (
            <SectionAccordion
              key={section.id}
              section={section}
              sectionIndex={sectionIndex}
              isOpen={expandedSections.has(section.id)}
              onToggle={(open) => toggleSection(section.id, open)}
              expandedCategories={expandedCategories}
              onToggleCategory={toggleCategory}
              categoryProducts={categoryData.productsMap}
              categoryProductCounts={categoryData.countsMap}
              searchQuery={searchQuery}
              isLoadingProducts={productsQuery.isLoading}
              sections={sections}
            />
          ))
        )}

          {/* Add Section Button */}
          <Button
            type="button"
            variant="ghost"
            className="w-full justify-start text-sm rounded-xl"
            onClick={() =>
              NiceModal.show(MenuSectionDialog, {
                title: "Nueva sección",
                submitLabel: "Guardar",
                onSubmit: (name) => createSection.mutate({ name }),
              })
            }
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar sección
          </Button>
        </div>

        {/* Footer */}
        <div className="flex justify-end">
          <Button asChild className="rounded-full px-6">
            <Link to="/setup/products">Guardar y continuar</Link>
          </Button>
        </div>
      </div>
      <SetupStepper className="mt-auto pt-6" />
    </div>
  );
};
