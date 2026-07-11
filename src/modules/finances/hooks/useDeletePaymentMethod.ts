import { queryClient, queryKeys } from "@/app/api/query-client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { PaymentMethodsService } from "../services/payment-methods.service";

export const useDeletePaymentMethod = () => {
  const deletePaymentMethod = useMutation<void, unknown, number>({
    mutationFn: (id: number) => PaymentMethodsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentMethods.all });
      toast.success("Metodo de pago eliminado correctamente");
    },
    onError: (error: unknown) => {
      console.error(error);
      toast.error("No se pudo eliminar el metodo de pago");
    },
  });

  return {
    deletePaymentMethod,
  };
};
