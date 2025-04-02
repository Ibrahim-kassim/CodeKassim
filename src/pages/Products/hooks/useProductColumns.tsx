import React from 'react';
import { Button, Space, Tag, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import { Product } from '../../../models/product.model';
import { Category } from '../../../models/category.model';

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
    render: (_, record) => (
      console.log(record),
      <Space size="middle">
        <Button
          type="text"
          icon={<EditOutlined />}
          onClick={() => onEdit(record)}
        />
        <Popconfirm
          title="Are you sure you want to delete this product?"
          onConfirm={() => onDelete(record._id!)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      </Space>
    ),
  },
];
