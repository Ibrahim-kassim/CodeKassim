// src/hooks/useCategories.ts
import { useState } from "react";

export type Category = {
  id: number;
  name: string;
  description: string;
};

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: "Electronics", description: "Devices and gadgets" },
    { id: 2, name: "Fashion", description: "Clothing and accessories" },
    { id: 3, name: "Books", description: "Books and magazines" },
  ]);

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
