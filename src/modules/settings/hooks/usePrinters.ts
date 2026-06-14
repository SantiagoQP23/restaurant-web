import { useMutation, useQuery } from "@tanstack/react-query";
import { PrintersService } from "../services/printers.service";
import type { Printer } from "@/shared/models/printer.model";
import { queryClient } from "@/app/api/query-client";
import { toast } from "sonner";
import type { CreatePrinterDto } from "../interfaces/dto/create-printer.dto";
import type { UpdatePrinterDto } from "../interfaces/dto/update-printer.dto";
import type { ApiErrorRespDto } from "@/shared/interfaces/dto/api-error-resp.dto";

export const usePrinters = () => {
  const getAllQuery = useQuery({
    queryKey: ["printers"],
    queryFn: () => PrintersService.getAll(),
  });

  const createPrinter = useMutation<Printer, ApiErrorRespDto, CreatePrinterDto>(
    {
      mutationFn: (data: CreatePrinterDto) => PrintersService.create(data),
      onSuccess: () => {
        toast.success("Impresora creada correctamente");
        queryClient.invalidateQueries({ queryKey: ["printers"] });
      },
      onError: (error) => {
        console.log("Error creating printer", error);
        toast.error(error.data.message);
      },
    },
  );

  const updatePrinter = useMutation<Printer, ApiErrorRespDto, UpdatePrinterDto>(
    {
      mutationFn: (data: UpdatePrinterDto) => PrintersService.update(data),
      onSuccess: () => {
        toast.success("Impresora actualizada correctamente");

        queryClient.invalidateQueries({ queryKey: ["printers"] });
      },
      onError: (error) => {
        console.log("Error updating printer", error);
        toast.error(error.data.message);
      },
    },
  );

  const deletePrinter = useMutation<void, ApiErrorRespDto, string>({
    mutationFn: (id: string) => PrintersService.delete(id),
    onSuccess: () => {
      toast.success("Impresora eliminada correctamente");

      queryClient.invalidateQueries({ queryKey: ["printers"] });
    },
    onError: (error) => {
      console.log("Error deleting printer", error);
      toast.error(error.data.message);
    },
  });

  return {
    getAllQuery,
    createPrinter,
    updatePrinter,
    deletePrinter,
  };
};
