import { queryClient, queryKeys } from "@/app/api/query-client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { PaymentMethodsService } from "../services/payment-methods.service";
import type { CreatePaymentMethodDto } from "../interfaces/dto/create-payment-method.dto";
import type { PaymentMethod } from "@/shared/models/payment-method.model";

export const useCreatePaymentMethod = () => {
  const createPaymentMethod = useMutation<
    PaymentMethod,
    unknown,
    CreatePaymentMethodDto
  >({
    mutationFn: (data: CreatePaymentMethodDto) =>
      PaymentMethodsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentMethods.all });
      toast.success("Metodo de pago creado correctamente");
    },
    onError: (error: unknown) => {
      console.error(error);
      toast.error("No se pudo crear el metodo de pago");
    },
  });

  return {
    createPaymentMethod,
  };
};
