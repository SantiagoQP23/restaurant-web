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
import { useSignup } from "../hooks/useAuth";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useSignup();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<{
    firstName: string;
    lastName: string;
    username: string;
    numPhone: string;
    email: string;
    password: string;
    samePassword: string;
  }>({
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      numPhone: "",
      email: "",
      password: "",
      samePassword: "",
    },
  });

  const passwordValue = watch("password");

  const handleRegister = (form: {
    firstName: string;
    lastName: string;
    username: string;
    numPhone: string;
    email: string;
    password: string;
    samePassword: string;
  }) => {
    mutateAsync(form).then(() => {
      navigate({ to: "/setup/welcome" });
    });
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={handleSubmit(handleRegister)}
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
            <FieldLabel htmlFor="firstName">Nombres</FieldLabel>
            <Input
              id="firstName"
              type="text"
              placeholder="Juan Perez"
              aria-invalid={Boolean(errors.firstName)}
              {...register("firstName", {
                required: "Los nombres son obligatorios.",
                minLength: { value: 2, message: "Minimo 2 caracteres" },
              })}
            />
            {errors.firstName?.message && (
              <FieldDescription>{errors.firstName.message}</FieldDescription>
            )}
          </Field>
          <Field>
            <FieldLabel htmlFor="lastName">Apellidos</FieldLabel>
            <Input
              id="lastName"
              type="text"
              placeholder="Perez Gomez"
              aria-invalid={Boolean(errors.lastName)}
              {...register("lastName", {
                required: "Los apellidos son obligatorios.",
                minLength: { value: 2, message: "Minimo 2 caracteres" },
              })}
            />
            {errors.lastName?.message && (
              <FieldDescription>{errors.lastName.message}</FieldDescription>
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
                minLength: { value: 2, message: "Minimo 2 caracteres" },
              })}
            />
            {errors.username?.message && (
              <FieldDescription>{errors.username.message}</FieldDescription>
            )}
          </Field>
          <Field>
            <FieldLabel htmlFor="numPhone">Celular</FieldLabel>
            <Input
              id="numPhone"
              type="tel"
              placeholder="+593 99 123 4567"
              aria-invalid={Boolean(errors.numPhone)}
              {...register("numPhone", {
                minLength: { value: 10, message: "Minimo 10 caracteres" },
                maxLength: { value: 10, message: "Maximo 10 caracteres" },
              })}
            />
            {errors.numPhone?.message && (
              <FieldDescription>{errors.numPhone.message}</FieldDescription>
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
              minLength: { value: 2, message: "Minimo 2 caracteres" },
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
                pattern: {
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/,
                  message:
                    "La contraseña debe tener al menos 8 caracteres e incluir mayuscula, minuscula, numero y caracter especial",
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
            <FieldLabel htmlFor="samePassword">Confirmar contraseña</FieldLabel>
            <Input
              id="samePassword"
              type="password"
              aria-invalid={Boolean(errors.samePassword)}
              {...register("samePassword", {
                required: "Confirma tu contraseña.",
                minLength: { value: 2, message: "Minimo 2 caracteres" },
                validate: (value) =>
                  value === passwordValue || "Las contraseñas no coinciden.",
              })}
            />
            <FieldDescription>Confirma tu contraseña.</FieldDescription>
            {errors.samePassword?.message && (
              <FieldDescription>{errors.samePassword.message}</FieldDescription>
            )}
          </Field>
        </div>
        <Field>
          <Button type="submit" disabled={isPending}>
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
              Inicia sesión
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
