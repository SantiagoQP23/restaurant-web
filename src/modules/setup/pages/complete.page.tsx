import { Button } from "@/shared/components/ui/button";
import { getEnvVariables } from "@/shared/lib/helpers";
import { Link } from "@tanstack/react-router";
import { Smartphone, HelpCircle } from "lucide-react";

export const environments = getEnvVariables();

export const CompletePage = () => {
  const supportEmail = environments.VITE_SUPPORT_EMAIL;
  const apkUrl = environments.VITE_APK_URL;
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="flex flex-col items-center gap-8 text-center max-w-lg w-full">
        {/* Header */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-4xl">🎉</div>
          <h1 className="text-2xl font-bold">Configuración completa</h1>
          <p className="text-sm text-muted-foreground">
            Todo está listo para empezar a operar tu restaurante
          </p>
        </div>

        <div className="w-full h-px bg-border/60" />

        {/* App Section */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Smartphone className="h-4 w-4" />
            Lleva tu restaurante contigo
          </div>

          <div className="w-40 h-64 rounded-2xl border-2 border-dashed border-border/60 bg-muted/30 flex items-center justify-center">
            <span className="text-xs text-muted-foreground">Mockup app</span>
          </div>

          <p className="text-sm text-muted-foreground">
            Administra tu negocio desde cualquier lugar
          </p>

          <ul className="flex flex-col gap-1 text-sm text-muted-foreground">
            <li>• Ver pedidos en tiempo real</li>
            <li>• Controlar mesas</li>
            <li>• Revisar ventas</li>
          </ul>

          <Button variant="outline" className="rounded-full px-6" asChild>
            <a href={apkUrl} target="_blank">
              Descargar app
            </a>
          </Button>

          <span className="text-xs text-muted-foreground">
            Disponible muy pronto en Google Play
          </span>
        </div>

        <div className="w-full h-px bg-border/60" />

        {/* Support Section */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <HelpCircle className="h-4 w-4" />
            ¿Necesitas ayuda?
          </div>

          <div className="flex flex-col gap-1 text-sm text-muted-foreground">
            <span>{supportEmail}</span>
            <span>WhatsApp: +593 98 232 6842</span>
          </div>
        </div>

        <div className="w-full h-px bg-border/60" />

        {/* CTA */}
        <Button asChild size="lg">
          <Link to="/app/orders">Ir al sistema</Link>
        </Button>
      </div>
    </div>
  );
};
