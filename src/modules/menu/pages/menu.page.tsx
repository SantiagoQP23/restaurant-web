import * as React from "react";
import NiceModal from "@ebay/nice-modal-react";
import type { Section } from "@/shared/models/section.model";
import type { Category } from "@/shared/models/category.model";
import type { Product } from "@/shared/models/product.model";
import type { ProductOption } from "@/shared/models/product-option.model";
import type { ProductionArea } from "@/shared/models/production-area.model";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { cn, formatCurrency } from "@/shared/lib/utils";
import { MoreVertical, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";
import { MenuSectionDialog } from "@/modules/menu/components/menu-section-dialog.component";
import { MenuCategoryDialog } from "@/modules/menu/components/menu-category-dialog.component";
import {
  MenuProductDialog,
  type MenuCategoryWithIndex,
} from "@/modules/menu/components/menu-product-dialog.component";
import { MenuProductOptionsDialog } from "@/modules/menu/components/menu-product-options-dialog.component";
import { MenuProductOptionDialog } from "@/modules/menu/components/menu-product-option-dialog.component";
import { useMenu } from "../hooks/useMenu";

type MenuCategory = Category & { products: Product[] };
type MenuSection = Section & { categories: MenuCategory[] };

const productionArea = (name: string): ProductionArea => ({
  id: Math.floor(Math.random() * 1000),
  name,
  description: "",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
});

const productionAreas: ProductionArea[] = [
  productionArea("Cocina"),
  productionArea("Bar"),
  productionArea("Postres"),
];

const buildProduct = (
  id: string,
  name: string,
  area: string,
  options: ProductOption[] = [],
): Product => ({
  id,
  name,
  price: 0,
  description: "",
  images: "",
  productionArea: productionArea(area),
  unitCost: 0,
  quantity: 0,
  options,
});

export const MenuPage = () => {
  const { sections: fetchedSections, createSection, updateSection } = useMenu();
  const [sections, setSections] = React.useState<MenuSection[]>([]);
  const [selectedSectionId, setSelectedSectionId] = React.useState<
    string | null
  >(null);

  const selectedSectionIndex = React.useMemo(
    () => sections.findIndex((section) => section.id === selectedSectionId),
    [sections, selectedSectionId],
  );
  const selectedSection =
    selectedSectionIndex >= 0 ? sections[selectedSectionIndex] : undefined;

  React.useEffect(() => {
    if (fetchedSections) {
      setSections(
        fetchedSections.map((section) => ({
          ...section,
          categories: section.categories ?? [],
        })) as MenuSection[],
      );
    }
  }, [fetchedSections]);

  React.useEffect(() => {
    if (!selectedSectionId && sections.length > 0) {
      setSelectedSectionId(sections[0]?.id ?? null);
    }
  }, [sections, selectedSectionId]);

  const handleAddOption = (productId: string, option: ProductOption) => {
    setSections((current) =>
      current.map((section) => ({
        ...section,
        categories: section.categories.map((category) => ({
          ...category,
          products: category.products.map((product) =>
            product.id === productId
              ? { ...product, options: [...product.options, option] }
              : product,
          ),
        })),
      })),
    );
  };

  const handleUpdateSection = (sectionId: string, name: string) => {
    updateSection.mutate({ id: sectionId, name });
  };

  const handleDeleteSection = (sectionId: string) => {
    setSections((current) =>
      current.filter((section) => section.id !== sectionId),
    );
    setSelectedSectionId((current) => (current === sectionId ? null : current));
  };

  const handleUpdateCategory = (
    sectionId: string,
    categoryId: string,
    name: string,
  ) => {
    setSections((current) =>
      current.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              categories: section.categories.map((category) =>
                category.id === categoryId ? { ...category, name } : category,
              ),
            }
          : section,
      ),
    );
  };

  const handleDeleteCategory = (sectionId: string, categoryId: string) => {
    setSections((current) =>
      current.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              categories: section.categories.filter(
                (category) => category.id !== categoryId,
              ),
            }
          : section,
      ),
    );
  };

  const handleDeleteProduct = (
    sectionId: string,
    categoryId: string,
    productId: string,
  ) => {
    setSections((current) =>
      current.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              categories: section.categories.map((category) =>
                category.id === categoryId
                  ? {
                      ...category,
                      products: category.products.filter(
                        (product) => product.id !== productId,
                      ),
                    }
                  : category,
              ),
            }
          : section,
      ),
    );
  };

  const handleUpdateOption = (
    sectionId: string,
    categoryId: string,
    productId: string,
    optionId: number,
    payload: { name: string; price: number },
  ) => {
    setSections((current) =>
      current.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              categories: section.categories.map((category) =>
                category.id === categoryId
                  ? {
                      ...category,
                      products: category.products.map((product) =>
                        product.id === productId
                          ? {
                              ...product,
                              options: product.options.map((option) =>
                                option.id === optionId
                                  ? {
                                      ...option,
                                      name: payload.name,
                                      price: payload.price,
                                    }
                                  : option,
                              ),
                            }
                          : product,
                      ),
                    }
                  : category,
              ),
            }
          : section,
      ),
    );
  };

  const handleDeleteOption = (
    sectionId: string,
    categoryId: string,
    productId: string,
    optionId: number,
  ) => {
    setSections((current) =>
      current.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              categories: section.categories.map((category) =>
                category.id === categoryId
                  ? {
                      ...category,
                      products: category.products.map((product) =>
                        product.id === productId
                          ? {
                              ...product,
                              options: product.options.filter(
                                (option) => option.id !== optionId,
                              ),
                            }
                          : product,
                      ),
                    }
                  : category,
              ),
            }
          : section,
      ),
    );
  };

  return (
    <div className="flex min-h-svh flex-col gap-6 p-6 md:p-10">
      <div>
        <h1 className="text-2xl font-bold">Menu</h1>
        <p className="text-sm text-muted-foreground">
          Organiza tus secciones, categorias y productos del menu.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-3xl border border-border/60 bg-card/60 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold uppercase text-muted-foreground">
              Secciones
            </div>

            <Button
              type="button"
              onClick={() =>
                NiceModal.show(MenuSectionDialog, {
                  title: "Nueva seccion",
                  submitLabel: "Guardar",
                  onSubmit: (name) => createSection.mutate({ name }),
                })
              }
              variant="ghost"
            >
              <Plus />
            </Button>
          </div>
          <div className="mt-3 flex flex-col gap-1">
            {sections.map((section) => {
              const isActive = section.id === selectedSectionId;
              return (
                <div
                  key={section.id}
                  onClick={() => setSelectedSectionId(section.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelectedSectionId(section.id);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  className={cn(
                    "flex items-center justify-between gap-2 rounded-2xl px-3 py-2 text-left text-sm transition",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                  )}
                >
                  <span className="font-medium">{section.name}</span>
                  <div className="flex items-center gap-2">
                    {/* <span className="text-xs text-muted-foreground"> */}
                    {/*   {section.categories.length} categorias */}
                    {/* </span> */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          aria-label={`Opciones para ${section.name}`}
                          onClick={(event) => event.stopPropagation()}
                          onKeyDown={(event) => event.stopPropagation()}
                        >
                          <MoreVertical />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(event) => {
                            event.stopPropagation();
                            NiceModal.show(MenuSectionDialog, {
                              title: "Actualizar seccion",
                              submitLabel: "Guardar cambios",
                              initialValues: { name: section.name },
                              onSubmit: (name) =>
                                handleUpdateSection(section.id, name),
                            });
                          }}
                        >
                          Actualizar
                        </DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={(event) => event.stopPropagation()}
                            >
                              Eliminar
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Eliminar seccion
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Estas a punto de eliminar la seccion "
                                {section.name}" y sus categorias. Esta accion no
                                se puede deshacer.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                variant="destructive"
                                onClick={() => handleDeleteSection(section.id)}
                              >
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>
        {/* <section className="flex flex-col gap-8"> */}
        {/*   {selectedSection ? ( */}
        {/*     selectedSection.categories.map((category, categoryIndex) => ( */}
        {/*       <div key={category.id} className="flex flex-col gap-4"> */}
        {/*         <div className="flex items-start justify-between gap-4"> */}
        {/*           <div> */}
        {/*             <h2 className="text-lg font-semibold">{category.name}</h2> */}
        {/*             <p className="text-sm text-muted-foreground"> */}
        {/*               {category.products.length} productos */}
        {/*             </p> */}
        {/*           </div> */}
        {/*           <DropdownMenu> */}
        {/*             <DropdownMenuTrigger asChild> */}
        {/*               <Button */}
        {/*                 type="button" */}
        {/*                 variant="ghost" */}
        {/*                 size="icon" */}
        {/*                 aria-label={`Opciones para ${category.name}`} */}
        {/*               > */}
        {/*                 <MoreVertical /> */}
        {/*               </Button> */}
        {/*             </DropdownMenuTrigger> */}
        {/*             <DropdownMenuContent align="end"> */}
        {/*               <DropdownMenuItem */}
        {/*                 onClick={() => */}
        {/*                   NiceModal.show(MenuCategoryDialog, { */}
        {/*                     title: "Actualizar categoria", */}
        {/*                     submitLabel: "Guardar cambios", */}
        {/*                     sectionName: selectedSection.name, */}
        {/*                     initialValues: { name: category.name }, */}
        {/*                     onSubmit: (name) => */}
        {/*                       handleUpdateCategory( */}
        {/*                         selectedSection.id, */}
        {/*                         category.id, */}
        {/*                         name, */}
        {/*                       ), */}
        {/*                   }) */}
        {/*                 } */}
        {/*               > */}
        {/*                 Actualizar */}
        {/*               </DropdownMenuItem> */}
        {/*               <AlertDialog> */}
        {/*                 <AlertDialogTrigger asChild> */}
        {/*                   <DropdownMenuItem variant="destructive"> */}
        {/*                     Eliminar */}
        {/*                   </DropdownMenuItem> */}
        {/*                 </AlertDialogTrigger> */}
        {/*                 <AlertDialogContent> */}
        {/*                   <AlertDialogHeader> */}
        {/*                     <AlertDialogTitle> */}
        {/*                       Eliminar categoria */}
        {/*                     </AlertDialogTitle> */}
        {/*                     <AlertDialogDescription> */}
        {/*                       Estas a punto de eliminar la categoria " */}
        {/*                       {category.name}". Esta accion no se puede */}
        {/*                       deshacer. */}
        {/*                     </AlertDialogDescription> */}
        {/*                   </AlertDialogHeader> */}
        {/*                   <AlertDialogFooter> */}
        {/*                     <AlertDialogCancel>Cancelar</AlertDialogCancel> */}
        {/*                     <AlertDialogAction */}
        {/*                       variant="destructive" */}
        {/*                       onClick={() => */}
        {/*                         handleDeleteCategory( */}
        {/*                           selectedSection.id, */}
        {/*                           category.id, */}
        {/*                         ) */}
        {/*                       } */}
        {/*                     > */}
        {/*                       Eliminar */}
        {/*                     </AlertDialogAction> */}
        {/*                   </AlertDialogFooter> */}
        {/*                 </AlertDialogContent> */}
        {/*               </AlertDialog> */}
        {/*             </DropdownMenuContent> */}
        {/*           </DropdownMenu> */}
        {/*         </div> */}
        {/*         <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"> */}
        {/*           {category.products.map((product) => ( */}
        {/*             <Card */}
        {/*               key={product.id} */}
        {/*               size="sm" */}
        {/*               className="border border-border/60" */}
        {/*             > */}
        {/*               <CardHeader> */}
        {/*                 <div className="flex items-start justify-between gap-2"> */}
        {/*                   <div> */}
        {/*                     <CardTitle className="text-base"> */}
        {/*                       {product.name} */}
        {/*                     </CardTitle> */}
        {/*                   </div> */}
        {/*                   <div className="flex items-center gap-2"> */}
        {/*                     <Badge variant="outline"> */}
        {/*                       {product.productionArea?.name ?? "Sin area"} */}
        {/*                     </Badge> */}
        {/*                     <DropdownMenu> */}
        {/*                       <DropdownMenuTrigger asChild> */}
        {/*                         <Button */}
        {/*                           type="button" */}
        {/*                           variant="ghost" */}
        {/*                           size="icon" */}
        {/*                           aria-label={`Opciones para ${product.name}`} */}
        {/*                         > */}
        {/*                           <MoreVertical /> */}
        {/*                         </Button> */}
        {/*                       </DropdownMenuTrigger> */}
        {/*                       <DropdownMenuContent align="end"> */}
        {/*                         <DropdownMenuItem */}
        {/*                           onClick={() => */}
        {/*                             NiceModal.show(MenuProductDialog, { */}
        {/*                               title: "Actualizar producto", */}
        {/*                               submitLabel: "Guardar cambios", */}
        {/*                               category: { */}
        {/*                                 name: category.name, */}
        {/*                                 sectionIndex: selectedSectionIndex, */}
        {/*                                 categoryIndex, */}
        {/*                               } as MenuCategoryWithIndex, */}
        {/*                               categories: sections.flatMap( */}
        {/*                                 (section, sectionIndex) => */}
        {/*                                   section.categories.map( */}
        {/*                                     (item, categoryIndex) => ({ */}
        {/*                                       ...item, */}
        {/*                                       sectionIndex, */}
        {/*                                       categoryIndex, */}
        {/*                                     }), */}
        {/*                                   ), */}
        {/*                               ), */}
        {/*                               productionAreas, */}
        {/*                               initialValues: { */}
        {/*                                 name: product.name, */}
        {/*                                 description: product.description, */}
        {/*                                 categoryId: `${selectedSectionIndex}-${categoryIndex}`, */}
        {/*                                 productionAreaId: */}
        {/*                                   product.productionArea?.id.toString() ?? */}
        {/*                                   productionAreas[0]?.id.toString() ?? */}
        {/*                                   "", */}
        {/*                               }, */}
        {/*                               onSubmit: (values) => { */}
        {/*                                 const [sectionIndex, categoryIndex] = */}
        {/*                                   values.categoryId */}
        {/*                                     .split("-") */}
        {/*                                     .map((value) => */}
        {/*                                       Number.parseInt(value, 10), */}
        {/*                                     ); */}
        {/*                                 const targetSection = */}
        {/*                                   sections[sectionIndex]; */}
        {/*                                 const targetCategory = */}
        {/*                                   targetSection?.categories[ */}
        {/*                                     categoryIndex */}
        {/*                                   ]; */}
        {/*                                 const areaName = */}
        {/*                                   productionAreas.find( */}
        {/*                                     (area) => */}
        {/*                                       area.id.toString() === */}
        {/*                                       values.productionAreaId, */}
        {/*                                   )?.name ?? */}
        {/*                                   product.productionArea?.name ?? */}
        {/*                                   "Sin area"; */}
        {/*                                 setSections((current) => { */}
        {/*                                   const updatedProduct = { */}
        {/*                                     ...product, */}
        {/*                                     name: values.name, */}
        {/*                                     description: */}
        {/*                                       values.description ?? "", */}
        {/*                                     productionArea: */}
        {/*                                       productionArea(areaName), */}
        {/*                                   }; */}
        {/*                                   const removed = current.map( */}
        {/*                                     (section) => ({ */}
        {/*                                       ...section, */}
        {/*                                       categories: */}
        {/*                                         section.categories.map( */}
        {/*                                           (cat) => ({ */}
        {/*                                             ...cat, */}
        {/*                                             products: */}
        {/*                                               cat.products.filter( */}
        {/*                                                 (item) => */}
        {/*                                                   item.id !== */}
        {/*                                                   product.id, */}
        {/*                                               ), */}
        {/*                                           }), */}
        {/*                                         ), */}
        {/*                                     }), */}
        {/*                                   ); */}
        {/*                                   return removed.map((section) => */}
        {/*                                     section.id === */}
        {/*                                     (targetSection?.id ?? */}
        {/*                                       selectedSection.id) */}
        {/*                                       ? { */}
        {/*                                           ...section, */}
        {/*                                           categories: */}
        {/*                                             section.categories.map( */}
        {/*                                               (cat) => */}
        {/*                                                 cat.id === */}
        {/*                                                 (targetCategory?.id ?? */}
        {/*                                                   category.id) */}
        {/*                                                   ? { */}
        {/*                                                       ...cat, */}
        {/*                                                       products: [ */}
        {/*                                                         ...cat.products, */}
        {/*                                                         updatedProduct, */}
        {/*                                                       ], */}
        {/*                                                     } */}
        {/*                                                   : cat, */}
        {/*                                             ), */}
        {/*                                         } */}
        {/*                                       : section, */}
        {/*                                   ); */}
        {/*                                 }); */}
        {/*                               }, */}
        {/*                             }) */}
        {/*                           } */}
        {/*                         > */}
        {/*                           Actualizar */}
        {/*                         </DropdownMenuItem> */}
        {/*                         <AlertDialog> */}
        {/*                           <AlertDialogTrigger asChild> */}
        {/*                             <DropdownMenuItem variant="destructive"> */}
        {/*                               Eliminar */}
        {/*                             </DropdownMenuItem> */}
        {/*                           </AlertDialogTrigger> */}
        {/*                           <AlertDialogContent> */}
        {/*                             <AlertDialogHeader> */}
        {/*                               <AlertDialogTitle> */}
        {/*                                 Eliminar producto */}
        {/*                               </AlertDialogTitle> */}
        {/*                               <AlertDialogDescription> */}
        {/*                                 Estas a punto de eliminar " */}
        {/*                                 {product.name}". Esta accion no se puede */}
        {/*                                 deshacer. */}
        {/*                               </AlertDialogDescription> */}
        {/*                             </AlertDialogHeader> */}
        {/*                             <AlertDialogFooter> */}
        {/*                               <AlertDialogCancel> */}
        {/*                                 Cancelar */}
        {/*                               </AlertDialogCancel> */}
        {/*                               <AlertDialogAction */}
        {/*                                 variant="destructive" */}
        {/*                                 onClick={() => */}
        {/*                                   handleDeleteProduct( */}
        {/*                                     selectedSection.id, */}
        {/*                                     category.id, */}
        {/*                                     product.id, */}
        {/*                                   ) */}
        {/*                                 } */}
        {/*                               > */}
        {/*                                 Eliminar */}
        {/*                               </AlertDialogAction> */}
        {/*                             </AlertDialogFooter> */}
        {/*                           </AlertDialogContent> */}
        {/*                         </AlertDialog> */}
        {/*                       </DropdownMenuContent> */}
        {/*                     </DropdownMenu> */}
        {/*                   </div> */}
        {/*                 </div> */}
        {/*               </CardHeader> */}
        {/*               <CardContent className="flex flex-col gap-3"> */}
        {/*                 <div className="flex flex-wrap gap-2"> */}
        {/*                   {product.options.length === 0 ? ( */}
        {/*                     <span className="text-xs text-muted-foreground"> */}
        {/*                       Sin opciones agregadas. */}
        {/*                     </span> */}
        {/*                   ) : ( */}
        {/*                     product.options.map((option) => ( */}
        {/*                       <div */}
        {/*                         key={option.id} */}
        {/*                         className="flex items-center gap-1 rounded-full border border-border/60 px-2 py-1 text-xs" */}
        {/*                       > */}
        {/*                         <span> */}
        {/*                           {option.name} */}
        {/*                           {option.price > 0 && */}
        {/*                             ` · ${formatCurrency(option.price)}`} */}
        {/*                         </span> */}
        {/*                         <DropdownMenu> */}
        {/*                           <DropdownMenuTrigger asChild> */}
        {/*                             <Button */}
        {/*                               type="button" */}
        {/*                               variant="ghost" */}
        {/*                               size="icon" */}
        {/*                               className="h-6 w-6" */}
        {/*                               aria-label={`Opciones para ${option.name}`} */}
        {/*                             > */}
        {/*                               <MoreVertical /> */}
        {/*                             </Button> */}
        {/*                           </DropdownMenuTrigger> */}
        {/*                           <DropdownMenuContent align="end"> */}
        {/*                             <DropdownMenuItem */}
        {/*                               onClick={() => */}
        {/*                                 NiceModal.show( */}
        {/*                                   MenuProductOptionDialog, */}
        {/*                                   { */}
        {/*                                     productName: product.name, */}
        {/*                                     initialValues: { */}
        {/*                                       name: option.name, */}
        {/*                                       price: option.price.toString(), */}
        {/*                                     }, */}
        {/*                                     onSubmit: (values) => */}
        {/*                                       handleUpdateOption( */}
        {/*                                         selectedSection.id, */}
        {/*                                         category.id, */}
        {/*                                         product.id, */}
        {/*                                         option.id, */}
        {/*                                         values, */}
        {/*                                       ), */}
        {/*                                   }, */}
        {/*                                 ) */}
        {/*                               } */}
        {/*                             > */}
        {/*                               Actualizar */}
        {/*                             </DropdownMenuItem> */}
        {/*                             <AlertDialog> */}
        {/*                               <AlertDialogTrigger asChild> */}
        {/*                                 <DropdownMenuItem variant="destructive"> */}
        {/*                                   Eliminar */}
        {/*                                 </DropdownMenuItem> */}
        {/*                               </AlertDialogTrigger> */}
        {/*                               <AlertDialogContent> */}
        {/*                                 <AlertDialogHeader> */}
        {/*                                   <AlertDialogTitle> */}
        {/*                                     Eliminar opcion */}
        {/*                                   </AlertDialogTitle> */}
        {/*                                   <AlertDialogDescription> */}
        {/*                                     Estas a punto de eliminar " */}
        {/*                                     {option.name}". Esta accion no se */}
        {/*                                     puede deshacer. */}
        {/*                                   </AlertDialogDescription> */}
        {/*                                 </AlertDialogHeader> */}
        {/*                                 <AlertDialogFooter> */}
        {/*                                   <AlertDialogCancel> */}
        {/*                                     Cancelar */}
        {/*                                   </AlertDialogCancel> */}
        {/*                                   <AlertDialogAction */}
        {/*                                     variant="destructive" */}
        {/*                                     onClick={() => */}
        {/*                                       handleDeleteOption( */}
        {/*                                         selectedSection.id, */}
        {/*                                         category.id, */}
        {/*                                         product.id, */}
        {/*                                         option.id, */}
        {/*                                       ) */}
        {/*                                     } */}
        {/*                                   > */}
        {/*                                     Eliminar */}
        {/*                                   </AlertDialogAction> */}
        {/*                                 </AlertDialogFooter> */}
        {/*                               </AlertDialogContent> */}
        {/*                             </AlertDialog> */}
        {/*                           </DropdownMenuContent> */}
        {/*                         </DropdownMenu> */}
        {/*                       </div> */}
        {/*                     )) */}
        {/*                   )} */}
        {/*                 </div> */}
        {/*                 <Button */}
        {/*                   type="button" */}
        {/*                   variant="outline" */}
        {/*                   size="sm" */}
        {/*                   onClick={() => */}
        {/*                     NiceModal.show(MenuProductOptionsDialog, { */}
        {/*                       productName: product.name, */}
        {/*                       onSubmit: (values) => { */}
        {/*                         values.options.forEach((option, index) => { */}
        {/*                           const parsedPrice = Number.parseFloat( */}
        {/*                             option.price, */}
        {/*                           ); */}
        {/*                           handleAddOption(product.id, { */}
        {/*                             id: Date.now() + index, */}
        {/*                             name: option.name.trim(), */}
        {/*                             price: Number.isFinite(parsedPrice) */}
        {/*                               ? parsedPrice */}
        {/*                               : 0, */}
        {/*                             quantity: 0, */}
        {/*                             isActive: true, */}
        {/*                             isAvailable: true, */}
        {/*                             isDefault: false, */}
        {/*                           }); */}
        {/*                         }); */}
        {/*                       }, */}
        {/*                     }) */}
        {/*                   } */}
        {/*                 > */}
        {/*                   <Plus /> */}
        {/*                   Agregar opcion */}
        {/*                 </Button> */}
        {/*               </CardContent> */}
        {/*             </Card> */}
        {/*           ))} */}
        {/*         </div> */}
        {/*         <div> */}
        {/*           <Button */}
        {/*             type="button" */}
        {/*             variant="outline" */}
        {/*             size="sm" */}
        {/*             onClick={() => */}
        {/*               NiceModal.show(MenuProductDialog, { */}
        {/*                 title: "Nuevo producto", */}
        {/*                 submitLabel: "Guardar", */}
        {/*                 category: { */}
        {/*                   name: category.name, */}
        {/*                   sectionIndex: selectedSectionIndex, */}
        {/*                   categoryIndex, */}
        {/*                 } as MenuCategoryWithIndex, */}
        {/*                 categories: sections.flatMap((section, sectionIndex) => */}
        {/*                   section.categories.map((item, categoryIndex) => ({ */}
        {/*                     ...item, */}
        {/*                     sectionIndex, */}
        {/*                     categoryIndex, */}
        {/*                   })), */}
        {/*                 ), */}
        {/*                 productionAreas, */}
        {/*                 onSubmit: (values) => { */}
        {/*                   const [sectionIndex, nextCategoryIndex] = */}
        {/*                     values.categoryId */}
        {/*                       .split("-") */}
        {/*                       .map((value) => Number.parseInt(value, 10)); */}
        {/*                   const targetSection = sections[sectionIndex]; */}
        {/*                   const targetCategory = */}
        {/*                     targetSection?.categories[nextCategoryIndex]; */}
        {/*                   const areaName = */}
        {/*                     productionAreas.find( */}
        {/*                       (area) => */}
        {/*                         area.id.toString() === values.productionAreaId, */}
        {/*                     )?.name ?? "Sin area"; */}
        {/*                   const newProduct = buildProduct( */}
        {/*                     `product-${Date.now()}`, */}
        {/*                     values.name, */}
        {/*                     areaName, */}
        {/*                   ); */}
        {/*                   setSections((current) => */}
        {/*                     current.map((section) => */}
        {/*                       section.id === */}
        {/*                       (targetSection?.id ?? selectedSection.id) */}
        {/*                         ? { */}
        {/*                             ...section, */}
        {/*                             categories: section.categories.map((cat) => */}
        {/*                               cat.id === */}
        {/*                               (targetCategory?.id ?? category.id) */}
        {/*                                 ? { */}
        {/*                                     ...cat, */}
        {/*                                     products: [ */}
        {/*                                       ...cat.products, */}
        {/*                                       newProduct, */}
        {/*                                     ], */}
        {/*                                   } */}
        {/*                                 : cat, */}
        {/*                             ), */}
        {/*                           } */}
        {/*                         : section, */}
        {/*                     ), */}
        {/*                   ); */}
        {/*                   NiceModal.show(MenuProductOptionsDialog, { */}
        {/*                     productName: values.name, */}
        {/*                     onSubmit: (optionValues) => { */}
        {/*                       optionValues.options.forEach((option, index) => { */}
        {/*                         const parsedPrice = Number.parseFloat( */}
        {/*                           option.price, */}
        {/*                         ); */}
        {/*                         handleAddOption(newProduct.id, { */}
        {/*                           id: Date.now() + index, */}
        {/*                           name: option.name.trim(), */}
        {/*                           price: Number.isFinite(parsedPrice) */}
        {/*                             ? parsedPrice */}
        {/*                             : 0, */}
        {/*                           quantity: 0, */}
        {/*                           isActive: true, */}
        {/*                           isAvailable: true, */}
        {/*                           isDefault: false, */}
        {/*                         }); */}
        {/*                       }); */}
        {/*                     }, */}
        {/*                   }); */}
        {/*                 }, */}
        {/*               }) */}
        {/*             } */}
        {/*           > */}
        {/*             <Plus /> */}
        {/*             Agregar producto */}
        {/*           </Button> */}
        {/*         </div> */}
        {/*       </div> */}
        {/*     )) */}
        {/*   ) : ( */}
        {/*     <div className="rounded-3xl border border-dashed border-border/60 p-6 text-sm text-muted-foreground"> */}
        {/*       Selecciona una seccion para ver sus categorias. */}
        {/*     </div> */}
        {/*   )} */}
        {/* </section> */}
      </div>
    </div>
  );
};
