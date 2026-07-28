import restaurantApi from "@/app/api/restaurant-api";

export class ResetPasswordService {
  static async requestResetPassword(email: string): Promise<void> {
    await restaurantApi.patch("/auth/request-reset-password", { email });
  }

  static async resetPassword(token: string, password: string): Promise<void> {
    await restaurantApi.patch("/auth/reset-password", {
      resetPasswordToken: token,
      password,
    });
  }
}
