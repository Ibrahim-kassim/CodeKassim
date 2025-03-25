import { ENTITIES } from "../models/entities";
import Api from "../AppServices/api.service";
import QueryUtil from "../utils/query.util";
import api from "../AppServices/initApi";
import { useQuery } from "@tanstack/react-query";
import { useGenericEditHook } from "../hooks/useGenericEditHook";

// Get all products
export function useAllProducts() {
  return useQuery({
    queryKey: [ENTITIES.ALL_PRODUCTS],
    queryFn: async () => {
      const response = await api.getProducts();
      return response;
    },
  });
}
// Create product
export function useCreateProduct() {
  const query = useGenericEditHook(
    api.createProduct.bind(api),
    ENTITIES.CREATE_PRODUCT
  );
  return query;
}

// Update product
export function useUpdateProduct() {
  const query = useGenericEditHook(
    api.updateProduct.bind(api),
    ENTITIES.UPDATE_PRODUCT
  );
  return query;
}

// Delete product
export function useDeleteProduct() {
  return useGenericEditHook<{ productId: string }, { message: string }>(
    async (payload) => api.deleteProduct(payload),
    ENTITIES.DELETE_PRODUCT,
    {
      successMessage: 'Product deleted successfully',
      errorMessage: 'Failed to delete product'
    }
  );
}