import React from 'react';
import { Table, Button, Space, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useProductActions } from './hooks/useProductActions';
import ProductModal from './components/ProductModal';
import { Product } from '../../models/product.model';
import { AddButton, DeleteButton } from '../../generalComponents';

const Products: React.FC = () => {
  const {
    products,
    selectedProduct,
    modalVisible,
    selectedRowKeys,
    selectedProducts,
    setModalVisible,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleBulkDelete,
    isLoading,
    rowSelection,
  } = useProductActions();

  const columns: ColumnsType<Product> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Categories',
      dataIndex: 'categories',
      key: 'categories',
      render: (categories: string[]) => categories.join(', '),
    },
    {
      title: 'Status',
      dataIndex: 'isAvailable',
      key: 'isAvailable',
      render: (isAvailable: boolean) => (isAvailable ? 'Available' : 'Not Available'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <DeleteButton onClick={() => handleDelete(record.?_id)} />
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-red-600">Products</h1>
        <div className="flex space-x-3">
          <AddButton onClick={handleAdd} label="Add Product" />
          {selectedProducts.length > 0 && (
            <Popconfirm
              title={`Delete ${selectedProducts.length} selected products?`}
              onConfirm={handleBulkDelete}
            >
              <Button danger>Delete Selected</Button>
            </Popconfirm>
          )}
        </div>
      </div>

      <Table
        rowKey="_id"
        columns={columns}
        dataSource={products}
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