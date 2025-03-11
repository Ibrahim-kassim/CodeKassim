import { useQuery } from "@tanstack/react-query";
import { useGenericEditHook } from "../hooks/useGenericEditHook";
import api from "../AppServices/initApi";
import { ENTITIES } from "../models/entities";
import { Category } from "../models/category.model";

interface ApiResponse<T> {
  data: T[];
  meta: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

// Get all categories
export function useAllCategories() {
  return useQuery({
    queryKey: [ENTITIES.ALL_CATEGORIES],
    queryFn: async () => {
      const response = await api.getCategories();
      return response;
    }
  });
}

// Create category
export function useCreateCategory() {
  const query = useGenericEditHook(
    api.createCategory.bind(api),
    ENTITIES.ADD_CATEGORY
  );
  return query;
}

// Update category
export function useUpdateCategory() {
  const query = useGenericEditHook(
    api.updateCategory.bind(api),
    ENTITIES.UPDATE_CATEGORY
  );
  return query;
}

// Delete category
export function useDeleteCategory() {
  const query = useGenericEditHook(
    api.deleteCategory.bind(api),
    ENTITIES.DELETE_CATEGORY
  );
  return query;
}