import React from 'react';
import { Space, Tag, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Category } from '../../../models/category.model';
import { EditButton, DeleteButton } from '../../../generalComponents';



interface UseCategoryColumnsProps {
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

export function useCategoryColumns({ onEdit, onDelete }: UseCategoryColumnsProps): ColumnsType<Category> {
  return [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Parent Category',
      dataIndex: 'parentCategory',
      key: 'parentCategory',
      render: (parentCategory: Category | null) => 
        parentCategory ? <Tag color="green">{parentCategory.name}</Tag> : '-',
    },
    {
      title: 'Attributes',
      dataIndex: 'attributes',
      key: 'attributes',
      render: (attributes: string[]) => (
        <Space size={[0, 4]} wrap>
          {attributes?.map((attr, index) => (
            <Tag key={index} color="orange">{attr}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: Category) => {
        // Only show delete button if we have an ID
        const hasId = typeof record._id === 'string' && record._id.length > 0;
        
        return (
          <Space>
            <EditButton onClick={() => onEdit(record)} />
            {hasId && (
              <Popconfirm
                title="Are you sure you want to delete this category?"
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
