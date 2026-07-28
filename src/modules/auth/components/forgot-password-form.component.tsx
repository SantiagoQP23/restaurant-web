import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { LockKeyhole } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { ResetPasswordService } from "../services/reset-password.service";

const forgotPasswordSchema = z.object({
  email: z.string().email("Ingresa un email válido."),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsSubmitting(true);
    try {
      await ResetPasswordService.requestResetPassword(data.email);
      toast.success("El correo fue enviado correctamente");
    } catch {
      toast.error("No se encontró un usuario con ese email");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className={className}
      {...props}
      onSubmit={handleSubmit(onSubmit)}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <LockKeyhole className="size-5" />
          </div>
          <h1 className="text-2xl font-bold">Olvidé mi contraseña</h1>
          <p className="text-sm text-muted-foreground">
            Ingresa tu correo y te enviaremos instrucciones para restablecer tu
            contraseña.
          </p>
        </div>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="tu@email.com"
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
          />
          {errors.email?.message && (
            <FieldDescription>{errors.email.message}</FieldDescription>
          )}
        </Field>

        <Field>
          <Button type="submit" disabled={isSubmitting}>
            Enviar instrucciones
          </Button>
        </Field>

        <Field>
          <FieldDescription className="text-center">
            <a
              href="#"
              className="underline underline-offset-4"
              onClick={(e) => {
                e.preventDefault();
                navigate({ to: "/auth/login" });
              }}
            >
              Ir a login
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
