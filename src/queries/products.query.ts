import { ENTITIES } from "../models/entities";
import Api from "../AppServices/api.service";
import QueryUtil from "../utils/query.util";
import { useQuery } from "@tanstack/react-query";
import { useGenericEditHook } from "../hooks/useGenericEditHook";

const api = new Api({
  config: {
    baseURL: process.env.REACT_BACK_END_URL || ''
  }
});

// Get all products
export function useAllProducts() {
  const query = useQuery({
    queryKey: [ENTITIES.PRODUCTS],
    queryFn: () => api.getProducts()
  });
  return QueryUtil.processGetQuery(query);
}

// Create product
export function useAddProduct() {
  return useGenericEditHook(
    api.createProduct,
    ENTITIES.PRODUCTS
  );
}

// Delete product
export function useDeleteProduct() {
  return useGenericEditHook(
    api.deleteProduct,
    ENTITIES.PRODUCTS
  );
}

// Update product
export function useUpdateProduct() {
  return useGenericEditHook(
    api.updateProduct,
    ENTITIES.PRODUCTS
  );
}
