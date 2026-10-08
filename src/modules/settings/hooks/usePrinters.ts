import { useMutation, useQuery } from "@tanstack/react-query";
import { PrintersService } from "../services/printers.service";
import type { Printer } from "@/shared/models/printer.model";
import { queryClient } from "@/app/api/query-client";
import { toast } from "sonner";
import type { CreatePrinterDto } from "../interfaces/dto/create-printer.dto";
import type { UpdatePrinterDto } from "../interfaces/dto/update-printer.dto";
import i18n from "@/app/i18n/i18n.config";
import { getErrorMessage } from "@/shared/lib/errors/get-error-message";

export const usePrinters = () => {
  const getAllQuery = useQuery({
    queryKey: ["printers"],
    queryFn: () => PrintersService.getAll(),
  });

  const createPrinter = useMutation<Printer, unknown, CreatePrinterDto>(
    {
      mutationFn: (data: CreatePrinterDto) => PrintersService.create(data),
      onSuccess: () => {
        toast.success("Impresora creada correctamente");
        queryClient.invalidateQueries({ queryKey: ["printers"] });
      },
      onError: (error) => {
        console.log("Error creating printer", error);
        toast.error(
        getErrorMessage(error, { fallback: i18n.t("actionErrors.printers.create") }),
      );
      },
    },
  );

  const updatePrinter = useMutation<Printer, unknown, UpdatePrinterDto>(
    {
      mutationFn: (data: UpdatePrinterDto) => PrintersService.update(data),
      onSuccess: () => {
        toast.success("Impresora actualizada correctamente");

        queryClient.invalidateQueries({ queryKey: ["printers"] });
      },
      onError: (error) => {
        console.log("Error updating printer", error);
        toast.error(
        getErrorMessage(error, { fallback: i18n.t("actionErrors.printers.update") }),
      );
      },
    },
  );

  const deletePrinter = useMutation<void, unknown, string>({
    mutationFn: (id: string) => PrintersService.delete(id),
    onSuccess: () => {
      toast.success("Impresora eliminada correctamente");

      queryClient.invalidateQueries({ queryKey: ["printers"] });
    },
    onError: (error) => {
      console.log("Error deleting printer", error);
      toast.error(
        getErrorMessage(error, { fallback: i18n.t("actionErrors.printers.delete") }),
      );
    },
  });

  const testPrinter = useMutation<void, unknown, string>({
    mutationFn: (id: string) => PrintersService.test(id),
    onSuccess: () => {
      toast.success("Impresora responde correctamente");
    },
    onError: (error) => {
      console.log("Error testing printer", error);
      toast.error(
        getErrorMessage(error, { fallback: i18n.t("actionErrors.printers.test") }),
      );
    },
  });

  return {
    getAllQuery,
    createPrinter,
    updatePrinter,
    deletePrinter,
    testPrinter,
  };
};
