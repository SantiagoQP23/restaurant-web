import { useState } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
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

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres.")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/,
        "Debe incluir mayúscula, minúscula, número y caracter especial.",
      ),
    confirmPassword: z.string().min(1, "Confirma tu contraseña."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const navigate = useNavigate();
  const { token } = useParams({ from: "/auth/reset-password/$token" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      toast.error("Token no válido");
      return;
    }

    setIsSubmitting(true);
    try {
      await ResetPasswordService.resetPassword(token, data.password);
      toast.success("La contraseña ha sido cambiada correctamente");
      navigate({ to: "/auth/login" });
    } catch {
      toast.error("Error al cambiar la contraseña");
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
          <h1 className="text-2xl font-bold">Cambiar contraseña</h1>
          <p className="text-sm text-muted-foreground">
            Ingresa tu nueva contraseña.
          </p>
        </div>

        <Field>
          <FieldLabel htmlFor="password">Nueva contraseña</FieldLabel>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            aria-invalid={Boolean(errors.password)}
            {...register("password")}
          />
          {errors.password?.message && (
            <FieldDescription>{errors.password.message}</FieldDescription>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="confirmPassword">
            Confirmar contraseña
          </FieldLabel>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            aria-invalid={Boolean(errors.confirmPassword)}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword?.message && (
            <FieldDescription>
              {errors.confirmPassword.message}
            </FieldDescription>
          )}
        </Field>

        <Field>
          <Button type="submit" disabled={isSubmitting}>
            Cambiar contraseña
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
