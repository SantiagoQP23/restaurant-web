import { RestaurantForm } from "@/modules/setup/components/restaurant-form.component";

export const RestaurantSettingsPage = () => {
  return (
    <div className="flex w-full justify-center">
      <div className="w-full max-w-2xl">
        <RestaurantForm
          description="Actualiza la informacion principal del restaurante."
          submitLabel="Guardar cambios"
        />
      </div>
    </div>
  );
};
