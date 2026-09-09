import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { DeleteAccountService } from "../services/delete-account.service";

export function DeleteAccountRequestForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const deleteAccountSchema = useMemo(
    () =>
      z.object({
        email: z.string().email(t("deleteAccount.errors.invalidEmail")),
      }),
    [t],
  );

  type DeleteAccountFormData = z.infer<typeof deleteAccountSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DeleteAccountFormData>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: DeleteAccountFormData) => {
    setIsSubmitting(true);
    try {
      await DeleteAccountService.requestAccountDeletion(data.email);
    } catch {
      // Intentionally swallow errors to avoid revealing whether the email exists.
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className={className}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Trash2 className="size-5" />
            </div>
            <h1 className="text-2xl font-bold">{t("deleteAccount.title")}</h1>
            <p className="text-sm text-muted-foreground">
              {t("deleteAccount.genericMessage")}
            </p>
          </div>

          <Field>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: "/auth/login" })}
            >
              {t("deleteAccount.backToLogin")}
            </Button>
          </Field>
        </FieldGroup>
      </div>
    );
  }

  return (
    <form
      className={className}
      {...props}
      onSubmit={handleSubmit(onSubmit)}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Trash2 className="size-5" />
          </div>
          <h1 className="text-2xl font-bold">{t("deleteAccount.title")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("deleteAccount.description")}
          </p>
        </div>

        <Field>
          <FieldLabel htmlFor="email">
            {t("deleteAccount.emailLabel")}
          </FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder={t("deleteAccount.emailPlaceholder")}
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
          />
          {errors.email?.message && (
            <FieldDescription>{errors.email.message}</FieldDescription>
          )}
        </Field>

        <Field>
          <Button type="submit" disabled={isSubmitting}>
            {t("deleteAccount.continue")}
          </Button>
        </Field>

        <Field>
          <FieldDescription className="text-center">
            {t("deleteAccount.helpText")}
          </FieldDescription>
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
              {t("deleteAccount.backToLogin")}
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
