import { Link } from "@tanstack/react-router";
import { Button } from "@/shared/components/ui/button";
import { SetupStepper } from "@/modules/setup/components/setup-stepper.component";
import { useAuthStore } from "@/modules/auth/store/auth.store";

export const WelcomePage = () => {
  const { logout } = useAuthStore();

  return (
    <div className="relative flex min-h-svh flex-col p-6 md:p-10">
      <div className="flex justify-end">
        <Button variant="ghost" onClick={logout}>
          Cerrar sesión
        </Button>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="flex w-full max-w-xl flex-col items-center gap-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold">Bienvenido</h1>
            <p className="text-sm text-muted-foreground">
              Empecemos configurando tu cuenta. Elige si vas a crear un nuevo
              restaurante o unirte a uno existente.
            </p>
          </div>
          <div className="flex flex-col gap-3 ">
            <Button asChild size="lg">
              <Link to="/setup/restaurant">Crear un restaurante</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/setup/join-restaurant">Unirme a un restaurante</Link>
            </Button>
          </div>
        </div>
      </div>
      <SetupStepper className="pt-6" />
    </div>
  );
};
