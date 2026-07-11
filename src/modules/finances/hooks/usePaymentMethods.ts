import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/app/api/query-client";
import { PaymentMethodsService } from "../services/payment-methods.service";

export const usePaymentMethods = () => {
  const paymentMethodsQuery = useQuery({
    queryKey: queryKeys.paymentMethods.all,
    queryFn: () => PaymentMethodsService.getAll(),
  });

  return {
    paymentMethodsQuery,
  };
};
