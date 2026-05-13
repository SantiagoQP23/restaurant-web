import { useNavigate } from "@tanstack/react-router";
import { RestaurantForm } from "../components/restaurant-form.component";
import { SetupStepper } from "../components/setup-stepper.component";

export const RestaurantPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-svh flex-col p-6 md:p-10">
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-lg">
          <RestaurantForm
            submitLabel="Guardar y continuar"
            onSubmit={(event) => {
              event.preventDefault();
              navigate({ to: "/setup/production-areas" });
            }}
          />
        </div>
      </div>
      <SetupStepper className="pt-6" />
    </div>
  );
};
