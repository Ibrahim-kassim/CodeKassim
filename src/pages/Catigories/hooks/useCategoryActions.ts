import { useState, useEffect } from 'react';
import { Category } from '../../../models/category.model';
import { useCreateCategory, useUpdateCategory, useDeleteCategory, useAllCategories } from '../../../queries/category.query';
import type { TableRowSelection } from 'antd/es/table/interface';

export function useCategoryActions() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const { data: categories, isPending: isLoadingCategories, refetch: refetchCategories } = useAllCategories();
  const { mutateAsync: createCategory, isPending: isCreating } = useCreateCategory();
  const { mutateAsync: updateCategory, isPending: isUpdating } = useUpdateCategory();
  const { mutateAsync: deleteCategory, isPending: isDeleting } = useDeleteCategory();

  // Log categories data whenever it changes


  // Handle adding a new category
  const handleAdd = () => {
    setSelectedCategory(null);
    setModalVisible(true);
  };

  // Handle editing a category
  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setModalVisible(true);
  };

  // Handle deleting a single category
  const handleDelete = async (id: string) => {
    if (!id) return;
    try {
      await deleteCategory(id);
      refetchCategories(); // Refresh categories after deletion
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  // Handle submitting form data for adding or updating a category
  const handleSubmit = async (data: Omit<Category, '_id' | '__v' | 'message'>) => {
    try {
      if (selectedCategory?._id) {
        await updateCategory({ 
          ...data, 
          _id: selectedCategory._id,
          __v: selectedCategory.__v,
        });
      } else {
        await createCategory(data);
      }
      setModalVisible(false);
      refetchCategories(); // Refresh categories after update/create
    } catch (error) {
      console.error('Error submitting category:', error);
    }
  };

  // Handle bulk deletion of selected categories
  const handleBulkDelete = async () => {
    try {
      await Promise.all(
        selectedRowKeys
          .map(key => key.toString())
          .filter((id): id is string => id !== undefined)
          .map(id => deleteCategory(id))
      );
      setSelectedRowKeys([]);
      refetchCategories(); // Refresh categories after bulk deletion
    } catch (error) {
      console.error('Error bulk deleting categories:', error);
    }
  };

  // Row selection configuration
  const rowSelection: TableRowSelection<Category> = {
    selectedRowKeys,
    onChange: (selectedKeys: React.Key[]) => {
      setSelectedRowKeys(selectedKeys);
    },
  };

  const isLoading = isCreating || isUpdating || isDeleting || isLoadingCategories;

  return {
    selectedCategory,
    modalVisible,
    selectedRowKeys,
    setModalVisible,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleBulkDelete,
    rowSelection,
    isLoading,
    categories: categories || [],
  };
}
