import React from 'react';
import { Button, Space, Tag, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import { Product } from '../../../models/product.model';
import { Category } from '../../../models/category.model';
import { DeleteButton, EditButton } from '../../../generalComponents';

interface UseProductColumnsProps {
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

export const useProductColumns = ({ onEdit, onDelete }: UseProductColumnsProps): ColumnsType<Product> => [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    sorter: (a, b) => a.name.localeCompare(b.name),
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    ellipsis: true,
  },
  {
    title: 'Categories',
    dataIndex: 'categories',
    key: 'categories',
    render: (categories: Category[]) => (
      <Space wrap>
        {categories.map((category: Category) => (
          <Tag key={category._id} color="blue">
            {category.name}
          </Tag>
        ))}
      </Space>
    ),
  },
  {
    title: 'Available',
    dataIndex: 'isAvailable',
    key: 'isAvailable',
    render: (isAvailable: boolean) => (
      <Tag color={isAvailable ? 'success' : 'error'}>
        {isAvailable ? 'Yes' : 'No'}
      </Tag>
    ),
  },
  {
    title: 'Actions',
    key: 'actions',
    render: (_, record: Product) => {
      const hasId = typeof record._id === 'string' && record._id.length > 0;

      return (
        <Space>
          <EditButton onClick={() => onEdit(record)} />
          {hasId && (
            <Popconfirm
              title="Are you sure you want to delete this product?"
              onConfirm={() => onDelete(record._id!)}
              okText="Yes"
              cancelText="No"
            >
              <DeleteButton />
            </Popconfirm>
          )}
        </Space>
      );
    },
  },
];
