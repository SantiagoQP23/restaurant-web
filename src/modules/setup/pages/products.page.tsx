import NiceModal from "@ebay/nice-modal-react";
import { Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { SetupStepper } from "../components/setup-stepper.component";
import { useSetupStore } from "@/shared/store/setup.store";
import { MenuProductDialog } from "@/modules/menu/components/menu-product-dialog.component";
// import { MenuProductOptionsDialog } from "@/modules/menu/components/menu-product-options-dialog.component";

export const ProductsPage = () => {
  const menu = useSetupStore((state) => state.menu);
  const allProducts = menu.sections.flatMap((section, sectionIndex) =>
    section.categories.flatMap((category, categoryIndex) =>
      category.products.map((product, productIndex) => ({
        id: `${sectionIndex}-${categoryIndex}-${productIndex}`,
        name: product.name,
        description: product.description,
        sectionName: section.name,
        categoryName: category.name,
        category: {
          ...category,
          sectionIndex,
          categoryIndex,
        },
      })),
    ),
  );

  return (
    <div className="flex min-h-svh flex-col p-6 md:p-10">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-bold">Productos</h1>
          <p className="text-sm text-muted-foreground">
            Agrega productos dentro de cada categoria.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Productos</h2>
              <span className="text-sm text-muted-foreground">
                {allProducts.length} productos
              </span>
            </div>
            {allProducts.length === 0 ? (
              <div className="rounded-3xl border border-dashed px-4 py-10 text-center text-sm text-muted-foreground">
                No hay productos registrados.
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {allProducts.map((product) => (
                  <Card key={product.id} size="sm">
                    <CardHeader>
                      <CardTitle>{product.name}</CardTitle>
                      <CardDescription>
                        {product.categoryName} · {product.sectionName}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                      <p className="text-sm text-muted-foreground">
                        {product.description || "Sin descripcion."}
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          NiceModal.show(MenuProductDialog, {
                            title: "Nuevo producto",
                            submitLabel: "Guardar",
                            category: product.category,
                            categories: menu.sections.flatMap(
                              (section, sectionIndex) =>
                                section.categories.map(
                                  (item, categoryIndex) => ({
                                    ...item,
                                    sectionIndex,
                                    categoryIndex,
                                  }),
                                ),
                            ),
                            onSubmit: () => {
                              // const [sectionIndex, categoryIndex] =
                              //   values.categoryId
                              //     .split("-")
                              //     .map((value) => Number.parseInt(value, 10));
                              // addMenuProduct(sectionIndex, categoryIndex, {
                              //   name: values.name,
                              //   description: values.description,
                              // });
                              // NiceModal.show(MenuProductOptionsDialog, {
                              //   productName: values.name,
                              //   onSubmit: () => undefined,
                              // });
                            },
                          })
                        }
                      >
                        <Plus />
                        Agregar producto
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>
          <aside className="flex flex-col gap-4">
            <div>
              <h2 className="text-lg font-semibold">Secciones</h2>
              <p className="text-sm text-muted-foreground">
                {menu.sections.length} secciones
              </p>
            </div>
            <div className="rounded-3xl border border-border/60 bg-card">
              {menu.sections.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                  No hay secciones creadas.
                </div>
              ) : (
                <div className="flex flex-col divide-y divide-border/60">
                  {menu.sections.map((section, sectionIndex) => (
                    <div
                      key={`${section.name}-${sectionIndex}`}
                      className="px-4 py-3"
                    >
                      <div className="text-sm font-medium">{section.name}</div>
                      <div className="mt-2 flex flex-col gap-2">
                        {section.categories.length === 0 ? (
                          <div className="text-xs text-muted-foreground">
                            Sin categorias
                          </div>
                        ) : (
                          section.categories.map((category, categoryIndex) => (
                            <div
                              key={`${category.name}-${categoryIndex}`}
                              className="rounded-2xl border border-border/60 px-3 py-2 text-xs"
                            >
                              <div className="font-medium">{category.name}</div>
                              <div className="text-muted-foreground">
                                {category.products.length} productos
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="mt-2 h-7 px-2"
                                onClick={() =>
                                  NiceModal.show(MenuProductDialog, {
                                    title: "Nuevo producto",
                                    submitLabel: "Guardar",
                                    category: {
                                      ...category,
                                      sectionIndex,
                                      categoryIndex,
                                    },
                                    categories: menu.sections.flatMap(
                                      (section, sectionIndex) =>
                                        section.categories.map(
                                          (item, categoryIndex) => ({
                                            ...item,
                                            sectionIndex,
                                            categoryIndex,
                                          }),
                                        ),
                                    ),
                                    onSubmit: () => {
                                      // const [
                                      //   nextSectionIndex,
                                      //   nextCategoryIndex,
                                      // ] = values.categoryId
                                      //   .split("-")
                                      //   .map((value) =>
                                      //     Number.parseInt(value, 10),
                                      //   );
                                      // addMenuProduct(
                                      //   nextSectionIndex,
                                      //   nextCategoryIndex,
                                      //   {
                                      //     name: values.name,
                                      //     description: values.description,
                                      //   },
                                      // );
                                      // NiceModal.show(MenuProductOptionsDialog, {
                                      //   productName: values.name,
                                      //   onSubmit: () => undefined,
                                      // });
                                    },
                                  })
                                }
                              >
                                <Plus />
                                Agregar producto
                              </Button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
        <SetupStepper className="mt-auto pt-6" />
      </div>
    </div>
  );
};
