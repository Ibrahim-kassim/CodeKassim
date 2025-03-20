// src/hooks/useCategories.ts
import { useQuery } from "@tanstack/react-query";
import api from "../AppServices/initApi";
import { ENTITIES } from "../models/entities";
import { Category } from "../models/category.model";

export const useCategories = () => {
  const { data: categories, isLoading, error } = useQuery<Category[]>({
    queryKey: [ENTITIES.ALL_CATEGORIES],
    queryFn: async () => {
      const response = await api.getCategories();
      return response;
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });

  return {
    categories: categories || [],
    isLoading,
    error
  };
};
