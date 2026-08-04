export interface ParsedApiError {
  code: string;
  message: string;
  details: Record<string, unknown>;
  statusCode: number;
}

/**
 * Parses a backend error response into a normalized shape.
 * Expects Axios error shape where err.response.data contains:
 * { statusCode, error: { code, message, details? }, timestamp, path }
 */
export function parseApiError(error: unknown): ParsedApiError {
  // Default fallback
  const fallback: ParsedApiError = {
    code: "UNKNOWN_ERROR",
    message: "An unexpected error occurred.",
    details: {},
    statusCode: 500,
  };

  if (error === null || error === undefined) {
    return fallback;
  }

  // Handle Axios-like response errors (what restaurantApi interceptor rejects)
  const axiosLike = error as any;
  if (axiosLike.data && axiosLike.data.error) {
    const { statusCode, error: errBody } = axiosLike.data;
    return {
      code: errBody?.code || fallback.code,
      message: errBody?.message || fallback.message,
      details: errBody?.details || {},
      statusCode: statusCode || fallback.statusCode,
    };
  }

  // Handle plain objects that already look like our parsed shape
  if (typeof axiosLike === "object" && axiosLike.error) {
    const errBody = axiosLike.error;
    return {
      code: errBody.code || fallback.code,
      message: errBody.message || fallback.message,
      details: errBody.details || {},
      statusCode: axiosLike.statusCode || fallback.statusCode,
    };
  }

  // Network / connection errors
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    if (
      msg.includes("network") ||
      msg.includes("fetch") ||
      msg.includes("econnrefused") ||
      msg.includes("timeout")
    ) {
      return {
        code: "NETWORK_ERROR",
        message: "Network connection failed. Please check your internet.",
        details: {},
        statusCode: 0,
      };
    }
  }

  return fallback;
}
