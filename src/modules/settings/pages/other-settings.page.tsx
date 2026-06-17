import { useSettings } from "../hooks/useSettings";
import { usePrinters } from "../hooks/usePrinters";
import { Switch } from "@/shared/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { FieldLabel } from "@/shared/components/ui/field";
import { Loader2 } from "lucide-react";

const PREP_TIME_OPTIONS = [5, 10, 15, 20, 30, 45, 60];

export const OtherSettingsPage = () => {
  const { settings, isLoading, isSaving, handleUpdateSettings } = useSettings();
  const { getAllQuery } = usePrinters();
  const printers = getAllQuery.data ?? [];

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 px-6">
        <div>
          <h1 className="text-2xl font-bold">Preferencias</h1>
          <p className="text-sm text-muted-foreground">
            Gestiona las preferencias de tu restaurante
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Cargando preferencias...
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="flex flex-col gap-6 px-6 ">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-600">Preferencias</h1>
          </div>
          {isSaving && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Guardando...
            </div>
          )}
        </div>

        <div className="grid gap-6 md:min-w-xl">
          {/* Order Prep Time */}
          <div className="flex items-center justify-between gap-4">
            <FieldLabel htmlFor="order-prep-time" className="flex-1">
              Tiempo de preparación
            </FieldLabel>
            <div className="w-32">
              <Select
                value={String(settings.ORDER_PREP_TIME)}
                onValueChange={(value) =>
                  handleUpdateSettings({ ORDER_PREP_TIME: Number(value) })
                }
                disabled={isSaving}
              >
                <SelectTrigger id="order-prep-time" className="w-full">
                  <SelectValue placeholder="Selecciona tiempo" />
                </SelectTrigger>
                <SelectContent>
                  {PREP_TIME_OPTIONS.map((minutes) => (
                    <SelectItem key={minutes} value={String(minutes)}>
                      {minutes} minutos
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Sound Enabled */}
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <FieldLabel htmlFor="sound-enabled">Sonido activado</FieldLabel>
              <p className="text-sm text-muted-foreground">
                Reproducir sonido cuando llegan nuevos pedidos
              </p>
            </div>
            <Switch
              id="sound-enabled"
              checked={settings.SOUND_ENABLED}
              onCheckedChange={(checked) =>
                handleUpdateSettings({ SOUND_ENABLED: checked === true })
              }
              disabled={isSaving}
            />
          </div>

          {/* Default Printer */}
          <div className="flex items-center justify-between gap-4">
            <FieldLabel htmlFor="default-printer">
              Impresora por defecto
            </FieldLabel>
            <div className="w-48">
              <Select
                value={settings.DEFAULT_PRINTER || "none"}
                onValueChange={(value) =>
                  handleUpdateSettings({
                    DEFAULT_PRINTER: value === "none" ? "" : value,
                  })
                }
                disabled={isSaving}
              >
                <SelectTrigger id="default-printer" className="w-full">
                  <SelectValue placeholder="Selecciona impresora" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Ninguna</SelectItem>
                  {printers.map((printer) => (
                    <SelectItem key={printer.id} value={printer.id}>
                      {printer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
