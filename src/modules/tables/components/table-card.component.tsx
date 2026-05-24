import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/shared/components/ui/card";
import type { Table } from "@/shared/models/table.model";
import { useTableOrders } from "../hooks/useTableOrders";

type TableCardProps = {
  table: Table;
  active: boolean;
  onSelect: (table: Table) => void;
  onOpenDialog: (table: Table) => void;
};

const availabilityBadgeClass = (isAvailable: boolean) =>
  isAvailable
    ? "rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700"
    : "rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700";

export const TableCard = ({
  table,
  active,
  onSelect,
  onOpenDialog,
}: TableCardProps) => {
  const { hasOrders } = useTableOrders(table.id);

  return (
    <Card
      size="sm"
      className={active ? "ring-2 ring-primary/40" : undefined}
      onClick={() => hasOrders && onSelect(table)}
    >
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle>Mesa {table.name}</CardTitle>
          <span className={availabilityBadgeClass(!hasOrders)}>
            {!hasOrders ? "Disponible" : "Ocupada"}
          </span>
        </div>
        <CardDescription>{table.chairs} sillas</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-end">
        {!hasOrders ? (
          <Button
            type="button"
            variant="outline"
            onClick={(event) => {
              event.stopPropagation();
              onOpenDialog(table);
            }}
          >
            Crear pedido
          </Button>
        ) : (
          <Button
            type="button"
            variant="ghost"
            onClick={(event) => {
              event.stopPropagation();
              onSelect(table);
            }}
          >
            Ver pedidos
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
