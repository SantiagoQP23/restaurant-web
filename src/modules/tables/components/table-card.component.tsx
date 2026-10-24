import { cn } from "@/shared/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/shared/components/ui/card";
import type { Table } from "@/shared/models/table.model";
import { useTableOrders } from "../hooks/useTableOrders";
import { Badge } from "@/shared/components/ui/badge";

type TableCardProps = {
  table: Table;
  active: boolean;
  onSelect: (table: Table) => void;
  onOpenDialog: (table: Table) => void;
};

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
      className={cn("cursor-pointer", active && "border-primary")}
      onClick={() => (hasOrders ? onSelect(table) : onOpenDialog(table))}
    >
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle>Mesa {table.name}</CardTitle>
        </div>
        <CardDescription>{table.chairs} sillas</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-end">
        <Badge variant={hasOrders ? "warning" : "success"}>
          {!hasOrders ? "Disponible" : "Ocupada"}
        </Badge>
      </CardContent>
    </Card>
  );
};
