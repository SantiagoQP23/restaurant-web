import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Field, FieldGroup } from "@/shared/components/ui/field";
import { VerifyEmailChangeService } from "../services/verify-email-change.service";

interface VerifyEmailChangeConfirmProps {
  token: string;
  className?: string;
}

type VerificationStatus = "verifying" | "success" | "error";

export function VerifyEmailChangeConfirm({
  token,
  className,
}: VerifyEmailChangeConfirmProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [status, setStatus] = useState<VerificationStatus>("verifying");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const cleanToken = token?.trim();
    if (!cleanToken) {
      setStatus("error");
      setErrorMessage(t("verifyEmailChange.invalidDescription"));
      return;
    }

    const runVerification = async () => {
      try {
        await VerifyEmailChangeService.verifyEmailChange(cleanToken);
        setStatus("success");
      } catch (error: unknown) {
        const response =
          (error as {
            status?: number;
            data?: { message?: string | string[] };
          }) ?? {};
        const rawMessage = response.data?.message;
        const message =
          typeof rawMessage === "string"
            ? rawMessage
            : Array.isArray(rawMessage)
              ? rawMessage.join(" ")
              : t("verifyEmailChange.invalidDescription");

        setStatus("error");
        setErrorMessage(message);
      }
    };

    runVerification();
  }, [token, t]);

  if (status === "verifying") {
    return (
      <div className={className}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-3 text-center py-8">
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              {t("verifyEmailChange.verifying")}
            </p>
          </div>
        </FieldGroup>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className={className}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CheckCircle2 className="size-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">
              {t("verifyEmailChange.successTitle")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("verifyEmailChange.successMessage")}
            </p>
          </div>

          <Field>
            <Button
              type="button"
              className="w-full"
              onClick={() => navigate({ to: "/auth/login" })}
            >
              {t("verifyEmailChange.backToLogin")}
            </Button>
          </Field>
        </FieldGroup>
      </div>
    );
  }

  return (
    <div className={className}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <XCircle className="size-6" />
          </div>
          <h1 className="text-2xl font-bold">
            {t("verifyEmailChange.invalidTitle")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {errorMessage ?? t("verifyEmailChange.invalidDescription")}
          </p>
        </div>

        <Field className="pt-2">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => navigate({ to: "/auth/login" })}
          >
            {t("verifyEmailChange.backToLogin")}
          </Button>
        </Field>
      </FieldGroup>
    </div>
  );
}
