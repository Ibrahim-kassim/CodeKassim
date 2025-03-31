// src/hooks/useCategories.ts
import { useState } from "react";

export type Category = {
  _id: Key | null | undefined;
  id: number;
  name: string;
  description: string;
};

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  const addCategory = (category: Omit<Category, "id">) => {
    setCategories([...categories, { ...category, id: Date.now() }]);
  };

  const updateCategory = (updated: Category) => {
    setCategories(categories.map((cat) => (cat.id === updated.id ? updated : cat)));
  };

  const deleteCategory = (id: number) => {
    setCategories(categories.filter((cat) => cat.id !== id));
  };

  return { categories, addCategory, updateCategory, deleteCategory };
};
