import React from 'react';
import { Table, Button, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import DeleteButton from '../../generalComponents/DeleteButton/DeleteButton';
import { useProductActions } from './hooks/useProductActions';
import ProductModal from './components/ProductModal';
import { Product } from '../../models/product.model';

const Products: React.FC = () => {
  const {
    products,
    selectedProduct,
    modalVisible,
    selectedProducts,
    setModalVisible,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleBulkDelete,
    isLoading,
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
      render: (categories: any[]) => categories.map((cat: any) => cat.name).join(', '),
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
          <DeleteButton onClick={() => handleDelete(record._id!)}>Delete</DeleteButton>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys: selectedProducts,
    onChange: (selectedRowKeys: React.Key[]) => {
      selectedProducts.length = 0;
      selectedProducts.push(...selectedRowKeys.map(key => key.toString()));
    },
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleAdd} style={{ marginRight: 8 }}>
          Add Product
        </Button>
        {selectedProducts.length > 0 && (
          <Button danger onClick={handleBulkDelete}>
            Delete Selected
          </Button>
        )}
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