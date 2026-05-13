import type { OrderDetailStatus, OrderType } from "./order.model";
import type { ProductOption } from "./product-option.model";
import type { Product } from "./product.model";
import type { User } from "./user.model";

export interface OrderDetail {
  id: string;
  quantity: number;
  qtyDelivered: number;
  readyQuantity: number;
  qtyPaid: number;
  amount: number;
  description: string;
  createdAt: string;
  updatedAt: string;
  product: Product;
  status: OrderDetailStatus;
  isActive: boolean;
  price: number;
  typeOrderDetail: OrderType;
  productOption?: ProductOption;
  // tags: Tag[];
  createdBy?: User;
  updatedBy?: User;
}
