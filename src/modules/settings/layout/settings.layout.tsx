import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { cn } from "@/shared/lib/utils";

const settingsOptions = [
  {
    title: "Información",
    description: "Actualiza nombre, contacto y direccion.",
    to: "/app/restaurant/information",
  },
  {
    title: "Areas de producción",
    description: "Gestiona las areas donde se preparan los productos.",
    to: "/app/restaurant/production-areas",
  },
  // {
  //   title: "Productos",
  //   description: "Configura productos y asigna areas de preparacion.",
  //   to: "/app/settings/products",
  // },
  {
    title: "Mesas",
    description: "Define la cantidad de mesas y sus detalles.",
    to: "/app/restaurant/tables",
  },
  {
    title: "Métodos de pago",
    description: "Configura comisiones y cuentas destino.",
    to: "/app/restaurant/payment-methods",
  },
  {
    title: "Impresoras",
    description: "Configura impresoras y asignalas a areas de produccion.",
    to: "/app/restaurant/printers",
  },
  {
    title: "Más",
    description: "",
    to: "/app/restaurant/other-settings",
  },
];

export const SettingsLayout = () => {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  return (
    <div className="flex min-h-svh flex-col gap-6 p-6 md:p-10">
      <div>
        <h1 className="text-2xl font-600">Restaurante</h1>
        <p className="text-sm text-muted-foreground">
          Actualiza la informacion principal del restaurante y sus opciones.
        </p>
      </div>
      <div className="flex flex-1 flex-col gap-6 lg:flex-row">
        <aside className="w-full lg:w-64">
          <nav className="rounded-3xl border border-border/60 bg-card p-2">
            <div className="flex flex-col gap-1">
              {settingsOptions.map((option) => {
                const isActive =
                  pathname === "/app/settings" || pathname === "/app/settings/"
                    ? option.to === "/app/settings/restaurant"
                    : pathname.startsWith(option.to);
                return (
                  <Link
                    key={option.title}
                    to={option.to}
                    className={cn(
                      "rounded-2xl px-3 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                    )}
                  >
                    <div className="font-medium text-foreground">
                      {option.title}
                    </div>
                    {/* <div className="text-xs text-muted-foreground"> */}
                    {/*   {option.description} */}
                    {/* </div> */}
                  </Link>
                );
              })}
            </div>
          </nav>
        </aside>
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
