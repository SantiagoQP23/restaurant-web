import i18n from "@/app/i18n/i18n.config";
import {
  GenericErrorCodes,
  getApiError,
  type AppApiError,
} from "@/app/api/api-response";

const STATUS_CODES: Record<number, string> = {
  400: "BAD_REQUEST",
  401: "UNAUTHORIZED",
  403: "FORBIDDEN",
  404: "NOT_FOUND",
  409: "CONFLICT",
  422: "UNPROCESSABLE_ENTITY",
  500: "INTERNAL_SERVER_ERROR",
};

interface GetErrorMessageOptions {
  /**
   * Usa el mensaje del servidor cuando el código no tiene traducción
   * específica.
   */
  fallbackToServerMessage?: boolean;
  /**
   * Texto propio de la pantalla (p. ej. "No se pudo crear la cuenta")
   * cuando el código no tiene traducción específica.
   */
  fallback?: string;
}

const translateCode = (code: string | undefined) =>
  code && i18n.exists(`errors.${code}`) ? i18n.t(`errors.${code}`) : undefined;

/**
 * Mensaje para mostrar al usuario en su idioma a partir de cualquier error.
 * Orden: traducción del código específico del backend (o NETWORK_ERROR) >
 * (opcional) `fallback` de la pantalla > (opcional) mensaje del servidor >
 * traducción genérica por status > "Ha ocurrido un error inesperado".
 */
export const getErrorMessage = (
  error: unknown,
  { fallbackToServerMessage = false, fallback }: GetErrorMessageOptions = {},
): string => {
  const apiError: AppApiError = getApiError(error);
  const isGenericCode = apiError.status
    ? STATUS_CODES[apiError.status] === apiError.code
    : false;

  if (
    (apiError.fromServer && !isGenericCode) ||
    apiError.code === GenericErrorCodes.NETWORK_ERROR
  ) {
    const specific = translateCode(apiError.code);
    if (specific) return specific;
  }

  if (fallback) return fallback;

  if (fallbackToServerMessage && apiError.status && apiError.message) {
    return apiError.message;
  }

  return (
    translateCode(apiError.status ? STATUS_CODES[apiError.status] : undefined) ??
    i18n.t("errors.UNKNOWN_ERROR")
  );
};

export { getApiError };
