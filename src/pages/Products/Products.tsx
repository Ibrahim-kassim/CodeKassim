import React, { useState } from 'react';
import { Table, Button, Popconfirm, Radio } from 'antd';
import { useProductActions } from './hooks/useProductActions';
import ProductModal from './components/ProductModal';
import { AddButton } from '../../generalComponents';
import { useCategoryActions } from '../Catigories/hooks/useCategoryActions';
import { useProductColumns } from './hooks/useProductColumns';

const Products: React.FC = () => {
  const {
    products,
    selectedProduct,
    modalVisible,
    selectedRowKeys,
    setModalVisible,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleBulkDelete,
    isLoading,
    rowSelection,
  } = useProductActions();

  const { categories } = useCategoryActions();
  const [selectedCategoryFilter, setSelectedCategoryFilter] =
    useState<string>('all');

  // Get main categories (those without parent)
  const mainCategories = categories?.filter((cat) => !cat.parentCategory) || [];

  // Filter products based on selected category
  const filteredProducts =
    selectedCategoryFilter === 'all'
      ? products
      : products?.filter((product) =>
          product.categories.some((cat) => cat._id === selectedCategoryFilter)
        );

  const columns = useProductColumns({ onEdit: handleEdit, onDelete: handleDelete });

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-red-600">Products</h1>
        <div className="flex space-x-3">
          <AddButton onClick={handleAdd} label="Add Product" />
          {selectedRowKeys.length > 0 && (
            <Popconfirm
              title={`Delete ${selectedRowKeys.length} selected products?`}
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
          {mainCategories.map((category) => (
            <Radio.Button key={category._id} value={category._id}>
              {category.name}
            </Radio.Button>
          ))}
        </Radio.Group>
      </div>

      <Table
        rowKey="_id"
        columns={columns}
        dataSource={filteredProducts}
        rowSelection={rowSelection}
        loading={isLoading}
      />

      <ProductModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSubmit={handleSubmit}
        initialData={selectedProduct}
      />
    </div>
  );
};

export default Products;
