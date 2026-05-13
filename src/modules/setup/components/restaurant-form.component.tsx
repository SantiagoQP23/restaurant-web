import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
type RestaurantFormProps = React.ComponentProps<"form"> & {
  description?: string;
  submitLabel?: string;
  showSubmit?: boolean;
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
};

export function RestaurantForm({
  className,
  description = "Completa la informacion para continuar con la configuracion.",
  submitLabel = "Guardar",
  showSubmit = true,
  onSubmit,
  ...props
}: RestaurantFormProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (onSubmit) {
      onSubmit(event);
      return;
    }
    event.preventDefault();
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Datos del restaurante</h1>
          <p className="text-sm text-balance text-muted-foreground">
            {description}
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="name">Nombre</FieldLabel>
          <Input
            id="name"
            type="text"
            placeholder="Restaurante Central"
            required
          />
          <FieldDescription>
            Este sera el nombre visible de tu restaurante.
          </FieldDescription>
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="phone">Telefono</FieldLabel>
            <Input
              id="phone"
              type="tel"
              placeholder="+593 99 123 4567"
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="restaurante@example.com"
              required
            />
          </Field>
        </div>
        <Field>
          <FieldLabel htmlFor="address">Direccion</FieldLabel>
          <Input
            id="address"
            type="text"
            placeholder="Av. Principal 123"
            required
          />
        </Field>
        {showSubmit && (
          <Field>
            <Button type="submit">{submitLabel}</Button>
          </Field>
        )}
      </FieldGroup>
    </form>
  );
}
