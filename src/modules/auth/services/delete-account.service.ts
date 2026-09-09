import restaurantApi from "@/app/api/restaurant-api";

export class DeleteAccountService {
  static async requestAccountDeletion(email: string): Promise<void> {
    await restaurantApi.post("/account-deletion/request", { email });
  }
}
