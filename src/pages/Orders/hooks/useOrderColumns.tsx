import React from 'react';
import { Space, Tag, Popconfirm, Collapse, Typography, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Order } from '../../../models/order.model';
import { EditButton, DeleteButton } from '../../../generalComponents';
import { formatDistanceToNow } from 'date-fns';
import { CheckOutlined, DeleteOutlined } from '@ant-design/icons';
import { Product } from '../../../models/product.model';

const { Text } = Typography;

interface UseOrderColumnsProps {
  onEdit: (order: Order) => void;
  onDelete: (id: string) => void;
}

export function useOrderColumns({ 
  onEdit, 
  onDelete,
}: UseOrderColumnsProps): ColumnsType<Order> {
  return [
    {
      title: 'Client Name',
      dataIndex: 'clientName',
      key: 'clientName',
    },
    {
      title: 'Client Phone',
      dataIndex: 'clientPhone',
      key: 'clientPhone',
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Products',
      key: 'products',
      render: (_, record: Order) => {
        if (!record.products?.length) return null;
        return (
          <Space>
            {record.products.map((product) => (
              <Tag key={product._id}>
                {product.name}
              </Tag>
            ))}
          </Space>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: Order) => {
        const hasId = typeof record._id === 'string' && record._id.length > 0;

        return (
          <Space>
            <EditButton onClick={() => onEdit(record)} />
            {hasId && (
              <Popconfirm
                title="Are you sure you want to delete this order?"
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
}
