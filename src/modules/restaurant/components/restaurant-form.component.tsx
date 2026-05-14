import * as React from "react";
import { useForm } from "react-hook-form";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import type { CreateRestaurantDto } from "@/modules/restaurant/interface/dto/create-restaurant.dto";

type RestaurantFormProps = React.ComponentProps<"form"> & {
  showSubmit?: boolean;
  mode?: "setup" | "settings";
  submitLabel?: string;
  onSubmit?: (values: CreateRestaurantDto) => void;
  defaultValues?: Partial<CreateRestaurantDto>;
};

export function RestaurantForm({
  className,
  mode = "setup",
  showSubmit = true,
  onSubmit,
  submitLabel,
  defaultValues,
  ...props
}: RestaurantFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateRestaurantDto>({
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
    },
  });

  React.useEffect(() => {
    if (!defaultValues) {
      return;
    }
    reset({
      name: defaultValues.name ?? "",
      phone: defaultValues.phone ?? "",
      email: defaultValues.email ?? "",
      address: defaultValues.address ?? "",
    });
  }, [defaultValues, reset]);

  const modeInfo = {
    setup: {
      description:
        "Completa la informacion para continuar con la configuracion.",
      submitLabel: "Guardar y continuar",
    },
    settings: {
      description: "Actualiza la informacion principal del restaurante.",
      submitLabel: "Guardar cambios",
    },
  };

  const { description: modeDescription, submitLabel: modeSubmitLabel } =
    modeInfo[mode];

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit((values) => onSubmit?.(values))}
      {...props}
    >
      <FieldGroup>
        <div
          className={`flex flex-col  gap-1  ${mode === "settings" ? "" : "items-center"}`}
        >
          <h1 className="text-2xl font-bold">Datos del restaurante</h1>
          <p className="text-sm text-balance text-muted-foreground">
            {modeDescription}
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="name">Nombre</FieldLabel>
          <Input
            id="name"
            type="text"
            placeholder="Restaurante Central"
            aria-invalid={Boolean(errors.name)}
            {...register("name", {
              required: "El nombre es obligatorio.",
            })}
          />
          <FieldDescription>
            {errors.name?.message ??
              "Este sera el nombre visible de tu restaurante."}
          </FieldDescription>
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="phone">Telefono</FieldLabel>
            <Input
              id="phone"
              type="tel"
              placeholder="+593 99 123 4567"
              aria-invalid={Boolean(errors.phone)}
              {...register("phone", {
                required: "El telefono es obligatorio.",
              })}
            />
            {errors.phone?.message && (
              <FieldDescription>{errors.phone.message}</FieldDescription>
            )}
          </Field>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="restaurante@example.com"
              aria-invalid={Boolean(errors.email)}
              {...register("email", {
                required: "El email es obligatorio.",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Ingresa un email valido.",
                },
              })}
            />
            {errors.email?.message && (
              <FieldDescription>{errors.email.message}</FieldDescription>
            )}
          </Field>
        </div>
        <Field>
          <FieldLabel htmlFor="address">Direccion</FieldLabel>
          <Input
            id="address"
            type="text"
            placeholder="Av. Principal 123"
            aria-invalid={Boolean(errors.address)}
            {...register("address", {
              required: "La direccion es obligatoria.",
            })}
          />
          {errors.address?.message && (
            <FieldDescription>{errors.address.message}</FieldDescription>
          )}
        </Field>
        {showSubmit && (
          <Field>
            <div className="flex justify-center">
              <Button type="submit">{submitLabel ?? modeSubmitLabel}</Button>
            </div>
          </Field>
        )}
      </FieldGroup>
    </form>
  );
}
