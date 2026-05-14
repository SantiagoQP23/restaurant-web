import { useNavigate } from "@tanstack/react-router";
import { RestaurantForm } from "../../restaurant/components/restaurant-form.component";
import { SetupStepper } from "../components/setup-stepper.component";
import { useSetupStore } from "@/shared/store/setup.store";

export const RestaurantPage = () => {
  const navigate = useNavigate();
  const restaurant = useSetupStore((state) => state.restaurant);
  const setRestaurant = useSetupStore((state) => state.setRestaurant);

  return (
    <div className="flex min-h-svh flex-col p-6 md:p-10">
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-lg">
          <RestaurantForm
            submitLabel="Guardar y continuar"
            defaultValues={restaurant ?? undefined}
            onSubmit={(values) => {
              setRestaurant(values);
              navigate({ to: "/setup/production-areas" });
            }}
          />
        </div>
      </div>
      <SetupStepper className="pt-6" />
    </div>
  );
};
