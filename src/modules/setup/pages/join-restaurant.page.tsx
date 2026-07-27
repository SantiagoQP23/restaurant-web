import { Button } from "@/shared/components/ui/button";
import { RotateCcw, Home } from "lucide-react";
import { WhatsappFAB } from "../components/whatsapp-fab.component";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const JoinRestaurantPage = () => {
  const navigate = useNavigate();
  const { checkStatus, logout, user } = useAuthStore();

  useEffect(() => {
    if (user?.role) {
      navigate({ to: "/app/orders", replace: true });
    }
  }, [user, navigate]);

  const handleCheckAccess = async () => {
    await checkStatus();
    const currentUser = useAuthStore.getState().user;
    if (currentUser?.role) {
      navigate({ to: "/app/orders", replace: true });
    }
  };

  return (
    <div className="relative flex min-h-svh items-center justify-center p-6 md:p-10">
      <div className="absolute top-6 right-6 md:top-10 md:right-10">
        <Button variant="ghost" onClick={logout}>
          Cerrar sesión
        </Button>
      </div>
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
          <Button onClick={handleCheckAccess}>
            <RotateCcw />
            Verificar acceso
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate({ to: "/setup/welcome" })}
          >
            <Home />
            Ir al inicio
          </Button>
        </div>
      </div>
      <WhatsappFAB />
    </div>
  );
};
