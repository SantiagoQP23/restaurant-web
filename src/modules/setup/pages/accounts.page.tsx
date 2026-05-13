import { SetupStepper } from "../components/setup-stepper.component";

export const AccountsPage = () => {
  return (
    <div className="flex min-h-svh flex-col p-6 md:p-10">
      <div>
        <h1 className="text-2xl font-bold">Cuentas</h1>
        <p className="text-sm text-muted-foreground">
          Configura las cuentas base para tus metodos de pago.
        </p>
      </div>
      <SetupStepper className="mt-auto pt-6" />
    </div>
  );
};
