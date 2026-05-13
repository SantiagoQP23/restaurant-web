import { SetupStepper } from "../components/setup-stepper.component";

export const CompletePage = () => {
  return (
    <div className="flex min-h-svh flex-col p-6 md:p-10">
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Configuracion completa</h1>
          <p className="text-sm text-muted-foreground">
            Todo esta listo para empezar a operar tu restaurante.
          </p>
        </div>
      </div>
      <SetupStepper className="pt-6" />
    </div>
  );
};
