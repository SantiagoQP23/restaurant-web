// import { CreateOrderDto } from "@/core/orders/dto/create-order.dto";

import { useOrdersStore } from "../store/orders.store";
import type { Order } from "@/shared/models/order.model";
import { toast } from "sonner";
import { useWebsocketEventEmitter } from "@/shared/hooks/useWebsocketEventEmmitter";
import type { SocketEvent } from "@/shared/interfaces/dto/socket.dto";

import type {
  UpdateOrderDetailDto,
  UpdateOrderDto,
  UpdateMultipleOrderDetailsStatusDto,
  DeleteOrderDetailDto,
  AddOrderDetailToOrderDto,
} from "../interfaces/dto/update-order.dto";
import { OrderSocketEvent } from "../enums/order-socket-event.enum";
import { useWebsocketEventListener } from "@/shared/hooks/useWebsocketEventListener";
import { useNotificationSound } from "@/shared/hooks/useNotificationSound";

export const useOrders = () => {
  // console.log("[useOrders] Hook called");
  const setActiveOrder = useOrdersStore((state) => state.setActiveOrder);
  // const createOrderEmitter = useWebsocketEventEmitter<Order, CreateOrderDto>(
  //   OrderSocketEvent.createOrder,
  //   {
  //     onSuccess: (resp) => {
  //     },
  //     onError: (resp) => {
  //       toast.error(resp.msg);
  //     },
  //   },
  // );

  const updateOrderEmitter = useWebsocketEventEmitter<Order, UpdateOrderDto>(
    OrderSocketEvent.updateOrder,
    {
      onSuccess: (resp) => {
        if (resp.data) setActiveOrder(resp.data!);
      },
    },
  );

  const updateOrderDetailEmitter = useWebsocketEventEmitter<
    Order,
    UpdateOrderDetailDto
  >(OrderSocketEvent.updateOrderDetail, {
    onSuccess: (resp) => {
      if (resp.data) setActiveOrder(resp.data!);
      // Alert.alert("Success", "Order detail updated successfully");
    },
    onError: (resp) => {
      toast.error(resp.msg);
    },
  });

  const updateMultipleOrderDetailsStatusEmitter = useWebsocketEventEmitter<
    Order,
    UpdateMultipleOrderDetailsStatusDto
  >(OrderSocketEvent.updateOrderDetailsStatus, {
    onSuccess: (resp) => {
      if (resp.data) setActiveOrder(resp.data!);
    },
    onError: (resp) => {
      toast.error(resp.msg);
    },
  });

  const useOrderDetailToOrderEmitter = useWebsocketEventEmitter<
    Order,
    AddOrderDetailToOrderDto
  >(OrderSocketEvent.addOrderDetail, {
    onSuccess: (resp) => {
      if (resp.data) setActiveOrder(resp.data!);
    },
    onError: (resp) => {
      toast.error(resp.msg);
    },
  });

  const deleteOrderEmitter = useWebsocketEventEmitter<Order, string>(
    OrderSocketEvent.deleteOrder,
    {
      onError: (resp) => {
        toast.error(resp.msg);
      },
    },
  );

  const removeOrderDetailEmitter = useWebsocketEventEmitter<
    Order,
    DeleteOrderDetailDto
  >(OrderSocketEvent.deleteOrderDetail, {
    onError: (resp) => {
      toast.error(resp.msg);
    },
  });

  return {
    // createOrder: createOrderEmitter,
    updateOrderDetail: updateOrderDetailEmitter,
    addOrderDetailToOrder: useOrderDetailToOrderEmitter,
    updateOrder: updateOrderEmitter,
    updateMultipleOrderDetailsStatus: updateMultipleOrderDetailsStatusEmitter,
    removeOrderDetail: removeOrderDetailEmitter,
    deleteOrder: deleteOrderEmitter,
  };
};

export const useOrderCreatedListener = () => {
  const addOrder = useOrdersStore((state) => state.addOrder);
  const sortOrdersByDeliveryTime = useOrdersStore(
    (state) => state.sortOrdersByDeliveryTime,
  );
  const { play: playNotificationSound } = useNotificationSound(0.5);
  useWebsocketEventListener(
    OrderSocketEvent.newOrder,
    ({ data, msg }: SocketEvent<Order>) => {
      toast.info(msg);
      addOrder(data);
      sortOrdersByDeliveryTime();
      playNotificationSound();
    },
  );
};

export const useOrderUpdatedListener = () => {
  const updateOrder = useOrdersStore((state) => state.updateOrder);
  const deleteOrder = useOrdersStore((state) => state.deleteOrder);
  const setActiveOrder = useOrdersStore((state) => state.setActiveOrder);
  const sortOrdersByDeliveryTime = useOrdersStore(
    (state) => state.sortOrdersByDeliveryTime,
  );

  useWebsocketEventListener<Order>(
    OrderSocketEvent.updateOrder,
    ({ data: order }: SocketEvent<Order>) => {
      if (order!.isClosed) deleteOrder(order!.id);
      else updateOrder(order!);

      sortOrdersByDeliveryTime();

      // Get current active order state at the time of the event
      const currentActiveOrder = useOrdersStore.getState().activeOrder;

      if (currentActiveOrder?.id === order?.id) {
        setActiveOrder(order!);
      }
    },
  );
};

export const useOrderDeletedListener = () => {
  const deleteOrder = useOrdersStore((state) => state.deleteOrder);
  const sortOrdersByDeliveryTime = useOrdersStore(
    (state) => state.sortOrdersByDeliveryTime,
  );
  useWebsocketEventListener(
    OrderSocketEvent.deleteOrder,
    ({ data }: SocketEvent<Order>) => {
      if (data) {
        deleteOrder(data.id);
        sortOrdersByDeliveryTime();
      }
    },
  );
};
