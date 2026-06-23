import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "@/shared/lib/utils";

const setupSteps = [
  { path: "/setup/welcome", label: "Bienvenida" },
  { path: "/setup/restaurant", label: "Restaurante" },
  { path: "/setup/production-areas", label: "Areas de produccion" },
  { path: "/setup/menu", label: "Menu" },
  // { path: "/setup/products", label: "Productos" },
  { path: "/setup/tables", label: "Mesas" },
  // { path: "/setup/accounts", label: "Cuentas" },
  { path: "/setup/payment-methods", label: "Metodos de pago" },
  { path: "/setup/staff", label: "Equipo" },
  { path: "/setup/complete", label: "Completar" },
];

type SetupStepperProps = {
  className?: string;
};

export const SetupStepper = ({ className }: SetupStepperProps) => {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  if (!pathname.startsWith("/setup")) {
    return null;
  }
  const activeIndex = setupSteps.findIndex((step) => step.path === pathname);
  const currentIndex = activeIndex === -1 ? 0 : activeIndex;

  return (
    <nav
      className={cn("flex justify-center", className)}
      aria-label="Progreso de configuracion"
    >
      <div className="flex items-center gap-2">
        {setupSteps.map((step, index) => {
          const isActive = index === currentIndex;
          const isComplete = index < currentIndex;
          return (
            <Link
              key={step.path}
              to={step.path}
              aria-current={isActive ? "step" : undefined}
              aria-label={`Paso ${index + 1}: ${step.label}`}
              className="flex items-center justify-center rounded-full p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            >
              <span
                className={cn(
                  "h-2.5 w-2.5 rounded-full transition-colors",
                  isActive && "bg-primary ring-2 ring-primary/20",
                  isComplete && !isActive && "bg-primary/50",
                  !isActive && !isComplete && "bg-muted",
                )}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
