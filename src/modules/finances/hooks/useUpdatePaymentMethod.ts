import { queryClient, queryKeys } from "@/app/api/query-client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { PaymentMethodsService } from "../services/payment-methods.service";
import type { UpdatePaymentMethodDto } from "../interfaces/dto/update-payment-method.dto";
import type { PaymentMethod } from "@/shared/models/payment-method.model";

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
      toast.error("No se pudo actualizar el metodo de pago");
    },
  });

  return {
    updatePaymentMethod,
  };
};
