import { useQuery } from "@tanstack/react-query";
import { useGenericEditHook } from "../hooks/useGenericEditHook";
import api from "../AppServices/initApi";
import { ENTITIES } from "../models/entities";

interface ApiResponse<T> {
  data: T[];
  meta: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

// Get all orders
export function useAllOrders() {
  return useQuery({
    queryKey: [ENTITIES.ORDERS],
    queryFn: async () => {
      const response = await api.getOrders();
      return response;
    }
  });
}

// Create order
export function useCreateOrder() {
  const query = useGenericEditHook(
    api.createOrder.bind(api),
    ENTITIES.ADD_ORDER
  );
  return query;
}

// Update order
export function useUpdateOrder() {
  const query = useGenericEditHook(
    api.updateOrder.bind(api),
    ENTITIES.UPDATE_ORDER
  );
  return query;
}

// Delete order
export function useDeleteOrder() {
  return useGenericEditHook<{ orderId: string }>(
    async (payload) => api.deleteOrder(payload.orderId),
    ENTITIES.DELETE_ORDER,
    {
      successMessage: 'Order deleted successfully',
      errorMessage: 'Failed to delete order'
    }
  );
}