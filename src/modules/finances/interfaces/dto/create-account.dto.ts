import { AccountType } from "@/shared/models/account.model";

export interface CreateAccountDto {
  name: string;
  description: string;
  num: string;
  type: AccountType;
}
