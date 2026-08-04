import { useTranslation } from "react-i18next";
import { parseApiError, ParsedApiError } from "./parse-api-error";

export function useErrorResolver() {
  const { t } = useTranslation();

  const resolveMessage = (error: unknown): string => {
    const parsed = parseApiError(error);
    return getTranslatedMessage(parsed, t);
  };

  const resolveFull = (
    error: unknown,
  ): { message: string; code: string; details: Record<string, unknown> } => {
    const parsed = parseApiError(error);
    return {
      message: getTranslatedMessage(parsed, t),
      code: parsed.code,
      details: parsed.details,
    };
  };

  return { resolveMessage, resolveFull };
}

function getTranslatedMessage(
  parsed: ParsedApiError,
  t: (key: string, options?: Record<string, unknown>) => string,
): string {
  const i18nKey = `errors.${parsed.code}`;

  // Check if translation exists
  const translated = t(i18nKey, {
    defaultValue: "__MISSING__",
    ...parsed.details,
  });

  if (translated !== "__MISSING__") {
    return translated;
  }

  // Try domain-level fallback (e.g., errors.RESTAURANT_GENERIC)
  const domain = parsed.code.split("_")[0];
  if (domain) {
    const genericKey = `errors.${domain}_GENERIC`;
    const genericTranslated = t(genericKey, {
      defaultValue: "__MISSING__",
      ...parsed.details,
    });
    if (genericTranslated !== "__MISSING__") {
      return genericTranslated;
    }
  }

  // Ultimate fallback
  return t("errors.UNKNOWN_ERROR", { defaultValue: "An unexpected error occurred." });
}
