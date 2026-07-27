import { RestaurantForm } from "@/modules/restaurant/components/restaurant-form.component";
import { useAuthStore } from "@/modules/auth/store/auth.store";

export const RestaurantSettingsPage = () => {
  const restaurant = useAuthStore((state) => state.restaurant);
  // const setRestaurant = useAuthStore((state) => state.setRestaurant);

  return (
    <div className="flex w-full justify-center">
      <div className="w-full max-w-2xl">
        <RestaurantForm
          mode="settings"
          defaultValues={restaurant ?? undefined}
        />
      </div>
    </div>
  );
};
