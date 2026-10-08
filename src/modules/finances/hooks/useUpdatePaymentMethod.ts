import { queryClient, queryKeys } from "@/app/api/query-client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { PaymentMethodsService } from "../services/payment-methods.service";
import type { UpdatePaymentMethodDto } from "../interfaces/dto/update-payment-method.dto";
import type { PaymentMethod } from "@/shared/models/payment-method.model";
import i18n from "@/app/i18n/i18n.config";
import { getErrorMessage } from "@/shared/lib/errors/get-error-message";

export const useUpdatePaymentMethod = () => {
  const updatePaymentMethod = useMutation<
    PaymentMethod,
    unknown,
    { id: number; dto: UpdatePaymentMethodDto }
  >({
    mutationFn: ({ id, dto }: { id: number; dto: UpdatePaymentMethodDto }) =>
      PaymentMethodsService.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentMethods.all });
      toast.success("Metodo de pago actualizado correctamente");
    },
    onError: (error: unknown) => {
      console.error(error);
      toast.error(
        getErrorMessage(error, { fallback: i18n.t("actionErrors.paymentMethods.update") }),
      );
    },
  });

  return {
    updatePaymentMethod,
  };
};
