import React, { useEffect } from "react";
import { Button, Popconfirm, Space, Table, Tag } from "antd";
import { Category } from '../../models/category.model';
import CategoryModal from "./components/CategoryModal";
import { AddButton, DeleteButton, EditButton } from "../../generalComponents";
import { useCategoryActions } from "./hooks/useCategoryActions";
import { useCategoryColumns } from "./hooks/useCategoryColumns";

export default function Categories() {
  const {
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
    categories,
  } = useCategoryActions();

  // Get columns configuration from the hook
  const columns = useCategoryColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  // Log categories data when it changes
  useEffect(() => {
    console.log('Categories Component Data:', {
      totalCategories: categories?.length || 0,
      categories,
    });
  }, [categories]);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-red-600">Categories</h1>
        <div className="flex space-x-3">
          <AddButton onClick={handleAdd} label="Add Category" />
          {selectedRowKeys.length > 0 && (
            <Popconfirm
              title={`Delete ${selectedRowKeys.length} selected categories?`}
              onConfirm={handleBulkDelete}
            >
              <Button danger>Delete Selected</Button>
            </Popconfirm>
          )}
        </div>
      </div>

      {/* Table Section */}
      <Table<Category>
        dataSource={categories}
        columns={columns}
        rowKey={record => record._id || ''}
        pagination={{ pageSize: 5 }}
        rowSelection={rowSelection}
        loading={isLoading}
      />

      {/* Modal for Adding/Editing Categories */}
      <CategoryModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmit}
        initialData={selectedCategory}
      />
    </div>
  );
}