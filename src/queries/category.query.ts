import { useQuery, useQueryClient } from "@tanstack/react-query";
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
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });
}

// Create category
export function useCreateCategory() {
  const queryClient = useQueryClient();
  const query = useGenericEditHook(
    api.createCategory.bind(api),
    ENTITIES.ADD_CATEGORY,
    {
      successMessage: 'Category created successfully',
      errorMessage: 'Failed to create category'
    }
  );

  // Invalidate queries after successful creation
  query.mutate = async (...args) => {
    const result = await query.mutateAsync(...args);
    queryClient.invalidateQueries({ queryKey: [ENTITIES.ALL_CATEGORIES] });
    return result;
  };

  return query;
}

// Update category
export function useUpdateCategory() {
  const queryClient = useQueryClient();
  const query = useGenericEditHook(
    api.updateCategory.bind(api),
    ENTITIES.UPDATE_CATEGORY,
    {
      successMessage: 'Category updated successfully',
      errorMessage: 'Failed to update category'
    }
  );

  // Invalidate queries after successful update
  query.mutate = async (...args) => {
    const result = await query.mutateAsync(...args);
    queryClient.invalidateQueries({ queryKey: [ENTITIES.ALL_CATEGORIES] });
    return result;
  };

  return query;
}

// Delete category
export function useDeleteCategory() {
  const queryClient = useQueryClient();
  const query = useGenericEditHook<{ categoryId: string }, { message: string }>(
    async (payload) => api.deleteCategory(payload),
    ENTITIES.DELETE_CATEGORY,
    {
      successMessage: 'Category deleted successfully',
      errorMessage: 'Failed to delete category'
    }
  );

  // Invalidate queries after successful deletion
  query.mutate = async (...args) => {
    const result = await query.mutateAsync(...args);
    queryClient.invalidateQueries({ queryKey: [ENTITIES.ALL_CATEGORIES] });
    return result;
  };

  return query;
}