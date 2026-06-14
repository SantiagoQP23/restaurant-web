import { useEffect } from "react";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import type { PrinterConnectionType } from "@/shared/models/printer.model";
import { usePrinters } from "../hooks/usePrinters";
import type { CreatePrinterDto } from "../interfaces/dto/create-printer.dto";
import type { UpdatePrinterDto } from "../interfaces/dto/update-printer.dto";

type PrinterFormValues = {
  name: string;
  connectionType: PrinterConnectionType;
  ipAddress: string;
  port: string;
  isActive: boolean;
};

type Props = {
  title: string;
  submitLabel: string;
  description?: string;
  initialValues: PrinterFormValues;
  printerId: string;
};

export const PrinterFormDialog = NiceModal.create(
  ({ title, submitLabel, description, initialValues, printerId }: Props) => {
    const modal = useModal();

    const { createPrinter, updatePrinter } = usePrinters();

    const {
      register,
      handleSubmit,
      watch,
      reset,
      setValue,
      formState: { errors, isSubmitting },
    } = useForm<PrinterFormValues>({
      defaultValues: initialValues,
    });

    const watchedValues = watch();
    const normalizedInitial = {
      name: initialValues.name.trim(),
      connectionType: initialValues.connectionType,
      ipAddress: initialValues.ipAddress?.trim() ?? "",
      port: Number.parseInt(initialValues.port, 10),
      isActive: initialValues.isActive,
    };
    const normalizedCurrent = {
      name: watchedValues.name?.trim() ?? "",
      connectionType: watchedValues.connectionType,
      ipAddress: watchedValues.ipAddress?.trim() ?? "",
      port: Number.parseInt(watchedValues.port ?? "", 10),
      isActive: watchedValues.isActive,
    };
    const hasChanges =
      normalizedInitial.name !== normalizedCurrent.name ||
      normalizedInitial.connectionType !== normalizedCurrent.connectionType ||
      normalizedInitial.ipAddress !== normalizedCurrent.ipAddress ||
      normalizedInitial.port !== normalizedCurrent.port ||
      normalizedInitial.isActive !== normalizedCurrent.isActive;
    const isSubmitDisabled = isSubmitting || (!!printerId && !hasChanges);

    useEffect(() => {
      if (!modal.visible) {
        return;
      }
      reset(initialValues);
    }, [initialValues, modal.visible, reset]);

    const handleCreatePrinter = (payload: CreatePrinterDto) => {
      createPrinter.mutateAsync(payload).then(() => modal.hide());
    };

    const handleUpdatePrinter = (payload: UpdatePrinterDto) => {
      updatePrinter.mutateAsync(payload).then(() => modal.hide());
    };

    const handleSave = async (values: PrinterFormValues) => {
      const parsedPort = Number.parseInt(values.port, 10);
      if (
        !Number.isFinite(parsedPort) ||
        parsedPort <= 0 ||
        parsedPort > 65535
      ) {
        return;
      }

      // Validate IP address for TCP connections
      if (values.connectionType === "TCP" && !values.ipAddress?.trim()) {
        return;
      }

      const payload = {
        name: values.name.trim(),
        connectionType: values.connectionType,
        ipAddress:
          values.connectionType === "TCP"
            ? values.ipAddress?.trim()
            : undefined,
        port: parsedPort,
      };

      if (printerId) {
        handleUpdatePrinter({ ...payload, id: printerId });
      } else {
        handleCreatePrinter(payload);
      }
    };

    const connectionType = watchedValues.connectionType || "TCP";

    return (
      <Dialog
        open={modal.visible}
        onOpenChange={(open) => {
          if (!open) {
            modal.hide();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(handleSave)}
          >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="printer-name">Nombre</FieldLabel>
                <Input
                  id="printer-name"
                  type="text"
                  placeholder="Impresora de cocina"
                  aria-invalid={Boolean(errors.name)}
                  {...register("name", {
                    required: "El nombre es obligatorio.",
                  })}
                />
                {errors.name?.message && (
                  <FieldDescription>{errors.name.message}</FieldDescription>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="printer-connection-type">
                  Tipo de conexión
                </FieldLabel>
                <Select
                  value={connectionType}
                  onValueChange={(value) => {
                    setValue("connectionType", value as PrinterConnectionType);
                    if (value === "USB") {
                      setValue("ipAddress", "");
                    }
                  }}
                >
                  <SelectTrigger id="printer-connection-type">
                    <SelectValue placeholder="Selecciona tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TCP">TCP/IP</SelectItem>
                    {/* <SelectItem value="USB">USB</SelectItem> */}
                  </SelectContent>
                </Select>
              </Field>
              {connectionType === "TCP" && (
                <Field>
                  <FieldLabel htmlFor="printer-ip-address">
                    Dirección IP
                  </FieldLabel>
                  <Input
                    id="printer-ip-address"
                    type="text"
                    placeholder="192.168.1.100"
                    aria-invalid={Boolean(errors.ipAddress)}
                    {...register("ipAddress", {
                      required:
                        connectionType === "TCP"
                          ? "La IP es obligatoria para conexiones TCP."
                          : false,
                      pattern: {
                        value:
                          /^(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/,
                        message:
                          "Formato de IP inválido. Ejemplo: 192.168.1.100",
                      },
                    })}
                  />
                  {errors.ipAddress?.message && (
                    <FieldDescription>
                      {errors.ipAddress.message}
                    </FieldDescription>
                  )}
                </Field>
              )}
              <Field>
                <FieldLabel htmlFor="printer-port">Puerto</FieldLabel>
                <Input
                  id="printer-port"
                  type="number"
                  min={1}
                  max={65535}
                  inputMode="numeric"
                  placeholder={connectionType === "TCP" ? "9100" : "1"}
                  aria-invalid={Boolean(errors.port)}
                  {...register("port", {
                    required: "El puerto es obligatorio.",
                  })}
                />
                {errors.port?.message && (
                  <FieldDescription>{errors.port.message}</FieldDescription>
                )}
              </Field>
              {/* <Field className="flex items-center gap-2"> */}
              {/*   <Checkbox */}
              {/*     id="printer-is-active" */}
              {/*     checked={watchedValues.isActive} */}
              {/*     onCheckedChange={(checked) => setValue("isActive", checked === true)} */}
              {/*   /> */}
              {/*   <FieldLabel htmlFor="printer-is-active" className="cursor-pointer"> */}
              {/*     Activa */}
              {/*   </FieldLabel> */}
              {/* </Field> */}
            </FieldGroup>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isSubmitting}>
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitDisabled}>
                {submitLabel}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  },
);
