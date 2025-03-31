import React, { useEffect, useState } from "react";
import { Button, Popconfirm, Radio, Space, Table, Tag } from "antd";
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

  const [selectedCategoryFilter, setSelectedCategoryFilter] =
    useState<string>('all');
  
  const mainCategories = categories?.filter((cat) => !cat.parentCategory) || [];
  const subCategories = categories?.filter((cat) => cat.parentCategory) || [];

  let filteredProducts = [];
  
  switch (selectedCategoryFilter) {
    case 'all':
      filteredProducts = categories;
      break;

    case 'main':
      filteredProducts = mainCategories;
      break;

    case 'sub':
      filteredProducts = subCategories;
      break;

    default:
      filteredProducts = categories;
      break;
  }

  // Get columns configuration from the hook
  const columns = useCategoryColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

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

      {/* Category Filter */}
      <div className="mb-4">
        <Radio.Group
          value={selectedCategoryFilter}
          onChange={(e) => setSelectedCategoryFilter(e.target.value)}
          optionType="button"
          buttonStyle="solid"
        >
          <Radio.Button value="all">All</Radio.Button>
          <Radio.Button value="main">Main</Radio.Button>
          <Radio.Button value="sub">Sub</Radio.Button>
        </Radio.Group>
      </div>

      {/* Table Section */}
      <Table<Category>
        dataSource={filteredProducts}
        columns={columns}
        rowKey={(record) => record._id || ''}
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