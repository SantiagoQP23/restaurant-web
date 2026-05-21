import type { Order } from "@/shared/models/order.model";

export const orderTableLabel = (order: Order) =>
  order.table?.name ? `Mesa ${order.table.name}` : "Para llevar";
