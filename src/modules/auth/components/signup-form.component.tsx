import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { useForm } from "react-hook-form";
import { useNavigate } from "@tanstack/react-router";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<{
    name: string;
    lastname: string;
    username: string;
    phone: string;
    email: string;
    password: string;
    confirmPassword: string;
  }>({
    defaultValues: {
      name: "",
      lastname: "",
      username: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = watch("password");

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={handleSubmit(() => {
        navigate({ to: "/auth/login" });
      })}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Crea tu cuenta</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Completa el formulario para crear tu cuenta
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="name">Nombres</FieldLabel>
            <Input
              id="name"
              type="text"
              placeholder="Juan Perez"
              aria-invalid={Boolean(errors.name)}
              {...register("name", {
                required: "Los nombres son obligatorios.",
              })}
            />
            {errors.name?.message && (
              <FieldDescription>{errors.name.message}</FieldDescription>
            )}
          </Field>
          <Field>
            <FieldLabel htmlFor="lastname">Apellidos</FieldLabel>
            <Input
              id="lastname"
              type="text"
              placeholder="Perez Gomez"
              aria-invalid={Boolean(errors.lastname)}
              {...register("lastname", {
                required: "Los apellidos son obligatorios.",
              })}
            />
            {errors.lastname?.message && (
              <FieldDescription>{errors.lastname.message}</FieldDescription>
            )}
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="username">Nombre de usuario</FieldLabel>
            <Input
              id="username"
              type="text"
              placeholder="juan.perez"
              aria-invalid={Boolean(errors.username)}
              {...register("username", {
                required: "El nombre de usuario es obligatorio.",
              })}
            />
            {errors.username?.message && (
              <FieldDescription>{errors.username.message}</FieldDescription>
            )}
          </Field>
          <Field>
            <FieldLabel htmlFor="phone">Celular</FieldLabel>
            <Input
              id="phone"
              type="tel"
              placeholder="+593 99 123 4567"
              aria-invalid={Boolean(errors.phone)}
              {...register("phone", {
                required: "El celular es obligatorio.",
              })}
            />
            {errors.phone?.message && (
              <FieldDescription>{errors.phone.message}</FieldDescription>
            )}
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            aria-invalid={Boolean(errors.email)}
            {...register("email", {
              required: "El email es obligatorio.",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Ingresa un email valido.",
              },
            })}
          />
          <FieldDescription>
            Usaremos este correo para contactarte. No compartiremos tu email con
            nadie mas.
          </FieldDescription>
          {errors.email?.message && (
            <FieldDescription>{errors.email.message}</FieldDescription>
          )}
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="password">Contraseña</FieldLabel>
            <Input
              id="password"
              type="password"
              aria-invalid={Boolean(errors.password)}
              {...register("password", {
                required: "La contraseña es obligatoria.",
                minLength: {
                  value: 8,
                  message: "Debe tener al menos 8 caracteres.",
                },
              })}
            />
            <FieldDescription>
              Debe tener al menos 8 caracteres.
            </FieldDescription>
            {errors.password?.message && (
              <FieldDescription>{errors.password.message}</FieldDescription>
            )}
          </Field>
          <Field>
            <FieldLabel htmlFor="confirm-password">
              Confirmar contraseña
            </FieldLabel>
            <Input
              id="confirm-password"
              type="password"
              aria-invalid={Boolean(errors.confirmPassword)}
              {...register("confirmPassword", {
                required: "Confirma tu contraseña.",
                validate: (value) =>
                  value === passwordValue || "Las contraseñas no coinciden.",
              })}
            />
            <FieldDescription>Confirma tu contraseña.</FieldDescription>
            {errors.confirmPassword?.message && (
              <FieldDescription>
                {errors.confirmPassword.message}
              </FieldDescription>
            )}
          </Field>
        </div>
        <Field>
          <Button type="submit" disabled={isSubmitting}>
            Crear cuenta
          </Button>
        </Field>
        <Field>
          <FieldDescription className="px-6 text-center">
            Ya tienes una cuenta?{" "}
            <a
              href="#"
              className="underline underline-offset-4"
              onClick={(event) => {
                event.preventDefault();
                navigate({ to: "/auth/login" });
              }}
            >
              Inicia sesion
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
