import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { AlertTriangle, CheckCircle2, Loader2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
} from "@/shared/components/ui/field";
import {
  DeleteAccountService,
  type TokenValidationResult,
} from "../services/delete-account.service";
import { useAuthStore } from "../store/auth.store";

interface AccountDeletionConfirmProps {
  token: string;
  className?: string;
}

export function AccountDeletionConfirm({
  token,
  className,
}: AccountDeletionConfirmProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [isValidating, setIsValidating] = useState(true);
  const [validationResult, setValidationResult] =
    useState<TokenValidationResult | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const runValidation = async () => {
      const cleanToken = token?.trim();
      if (!cleanToken) {
        setValidationResult({ valid: false, reason: "invalid" });
        setIsValidating(false);
        return;
      }

      setIsValidating(true);
      try {
        const result = await DeleteAccountService.validateToken(cleanToken);
        if (!isCancelled) {
          setValidationResult(result);
        }
      } catch {
        if (!isCancelled) {
          setValidationResult({ valid: false, reason: "invalid" });
        }
      } finally {
        if (!isCancelled) {
          setIsValidating(false);
        }
      }
    };

    runValidation();

    return () => {
      isCancelled = true;
    };
  }, [token]);

  const handleConfirmDeletion = async () => {
    const cleanToken = token?.trim();
    if (!cleanToken || isDeleting) return;

    setIsDeleting(true);
    setErrorMessage(null);

    try {
      await DeleteAccountService.confirmAccountDeletion(cleanToken);
      await useAuthStore.getState().logout();
      setIsDeleted(true);
    } catch (error: unknown) {
      const response =
        (error as {
          status?: number;
          data?: { message?: string | string[] };
        }) ?? {};
      const rawMessage = response.data?.message;
      const lower = (
        typeof rawMessage === "string"
          ? rawMessage
          : Array.isArray(rawMessage)
            ? rawMessage.join(" ")
            : ""
      ).toLowerCase();

      if (lower.includes("used") || lower.includes("usado")) {
        setValidationResult({ valid: false, reason: "used" });
      } else if (lower.includes("expire") || lower.includes("expirad")) {
        setValidationResult({ valid: false, reason: "expired" });
      } else {
        const fallbackMsg = t("deleteAccount.confirm.errorGeneric");
        const displayMsg =
          typeof rawMessage === "string" ? rawMessage : fallbackMsg;
        setErrorMessage(displayMsg);
        toast.error(displayMsg);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  if (isValidating) {
    return (
      <div className={className}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-3 text-center py-8">
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              {t("deleteAccount.confirm.validating")}
            </p>
          </div>
        </FieldGroup>
      </div>
    );
  }

  if (isDeleted) {
    return (
      <div className={className}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CheckCircle2 className="size-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">
              {t("deleteAccount.confirm.successTitle")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("deleteAccount.confirm.successMessage")}
            </p>
          </div>

          <Field>
            <Button
              type="button"
              className="w-full"
              onClick={() => navigate({ to: "/auth/login" })}
            >
              {t("deleteAccount.confirm.backToLogin")}
            </Button>
          </Field>
        </FieldGroup>
      </div>
    );
  }

  if (!validationResult?.valid) {
    const reason = validationResult?.reason;
    let description = t("deleteAccount.confirm.invalidDescription");

    if (reason === "used") {
      description = t("deleteAccount.confirm.usedDescription");
    } else if (reason === "expired") {
      description = t("deleteAccount.confirm.expiredDescription");
    }

    return (
      <div className={className}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <XCircle className="size-6" />
            </div>
            <h1 className="text-2xl font-bold">
              {t("deleteAccount.confirm.invalidTitle")}
            </h1>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>

          <Field className="flex flex-col gap-2 pt-2">
            <Button
              type="button"
              className="w-full"
              onClick={() => navigate({ to: "/auth/delete-account" })}
            >
              {t("deleteAccount.confirm.requestNewLink")}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => navigate({ to: "/auth/login" })}
            >
              {t("deleteAccount.confirm.backToLogin")}
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
            <AlertTriangle className="size-6" />
          </div>
          <h1 className="text-2xl font-bold">
            {t("deleteAccount.confirm.title")}
          </h1>
        </div>

        <div className="space-y-3 rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-muted-foreground">
          <p className="font-semibold text-destructive">
            {t("deleteAccount.confirm.warningPermanent")}
          </p>
          <p className="text-foreground/90">
            {t("deleteAccount.confirm.warningPersonalData")}
          </p>
          <p className="border-t border-destructive/10 pt-3 text-xs leading-relaxed text-muted-foreground">
            {t("deleteAccount.confirm.warningBusinessRecords")}
          </p>
        </div>

        {errorMessage && (
          <Field>
            <FieldDescription className="text-center font-medium text-destructive">
              {errorMessage}
            </FieldDescription>
          </Field>
        )}

        <Field className="flex flex-col gap-2 pt-2">
          <Button
            type="button"
            variant="destructive"
            className="w-full"
            disabled={isDeleting}
            onClick={handleConfirmDeletion}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                {t("deleteAccount.confirm.deleting")}
              </>
            ) : (
              t("deleteAccount.confirm.confirmButton")
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={isDeleting}
            onClick={() => navigate({ to: "/auth/login" })}
          >
            {t("deleteAccount.confirm.cancel")}
          </Button>
        </Field>
      </FieldGroup>
    </div>
  );
}
