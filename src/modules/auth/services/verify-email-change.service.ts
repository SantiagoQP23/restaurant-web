import restaurantApi from "@/app/api/restaurant-api";

export class VerifyEmailChangeService {
  static async verifyEmailChange(token: string): Promise<void> {
    await restaurantApi.post("/auth/verify-email-change", {
      token: token.trim(),
    });
  }
}
