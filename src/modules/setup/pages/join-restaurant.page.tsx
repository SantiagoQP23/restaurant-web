import { Button } from "@/shared/components/ui/button";
import { RotateCcw } from "lucide-react";
export const JoinRestaurantPage = () => {
  return (
    <div className="flex min-h-svh items-center justify-center p-6 md:p-10">
      <div className="flex w-full max-w-xl flex-col gap-6 justify-center items-center">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold">
            Estamos esperando a que te agreguen
          </h1>
          <p className="text-sm text-muted-foreground">
            Pide al administrador del restaurante que te agregue usando tu
            correo electrónico o nombre de usuario.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button className="flex-1">
            <RotateCcw />
            Verificar accesso
          </Button>
          <Button variant="outline" className="flex-1">
            Cerrar sesion
          </Button>
        </div>
      </div>
    </div>
  );
};
