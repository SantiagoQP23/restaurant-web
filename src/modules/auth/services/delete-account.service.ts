import restaurantApi from "@/app/api/restaurant-api";
import { getApiError } from "@/app/api/api-response";

export const AccountDeletionErrorCodes = {
  TOKEN_INVALID: "ACCOUNT_DELETION_TOKEN_INVALID",
  TOKEN_USED: "ACCOUNT_DELETION_TOKEN_USED",
} as const;

export type TokenValidationReason = "invalid" | "expired" | "used";

export interface TokenValidationResult {
  valid: boolean;
  reason?: TokenValidationReason;
  message?: string;
}

export class DeleteAccountService {
  static async requestAccountDeletion(email: string): Promise<void> {
    await restaurantApi.post("/account-deletion/request", { email });
  }

  static async validateToken(token: string): Promise<TokenValidationResult> {
    if (!token || !token.trim()) {
      return { valid: false, reason: "invalid" };
    }

    try {
      const response = await restaurantApi.get<{
        valid?: boolean;
        message?: string;
      }>("/account-deletion/validate", {
        params: { token: token.trim() },
      });

      return {
        valid: response.data?.valid ?? true,
      };
    } catch (error: unknown) {
      const { code, status, message } = getApiError(error);

      if (code === AccountDeletionErrorCodes.TOKEN_USED) {
        return { valid: false, reason: "used", message };
      }

      if (
        code === AccountDeletionErrorCodes.TOKEN_INVALID ||
        status === 401 ||
        status === 400
      ) {
        return { valid: false, reason: "invalid", message };
      }

      // If backend has not yet implemented GET /account-deletion/validate (404),
      // allow structurally plausible tokens to reach confirmation screen,
      // where POST /account-deletion/confirm will perform the final validation.
      if (status === 404) {
        if (token.trim().length < 8) {
          return { valid: false, reason: "invalid" };
        }
        return { valid: true };
      }

      throw error;
    }
  }

  static async confirmAccountDeletion(token: string): Promise<void> {
    await restaurantApi.post("/account-deletion/confirm", {
      token: token.trim(),
    });
  }
}
