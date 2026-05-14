import { RestaurantForm } from "@/modules/restaurant/components/restaurant-form.component";
import { useSetupStore } from "@/shared/store/setup.store";

export const RestaurantSettingsPage = () => {
  const restaurant = useSetupStore((state) => state.restaurant);
  const setRestaurant = useSetupStore((state) => state.setRestaurant);

  return (
    <div className="flex w-full justify-center">
      <div className="w-full max-w-2xl">
        <RestaurantForm
          mode="settings"
          defaultValues={restaurant ?? undefined}
          onSubmit={(values) => setRestaurant(values)}
        />
      </div>
    </div>
  );
};
