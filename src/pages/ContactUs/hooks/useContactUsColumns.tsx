import React from 'react';
import { Space, Tag, Popconfirm, Collapse, Typography, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ContactUs } from '../../../models/contactUs.model';
import { EditButton, DeleteButton } from '../../../generalComponents';
import { formatDistanceToNow } from 'date-fns';
import { CheckOutlined, DeleteOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface UseContactUsColumnsProps {
  onEdit: (contact: ContactUs) => void;
  onDelete: (id: string) => void;
  onReadMessage: (contactId: string, messageIndex: number) => void;
  onDeleteMessage: (contactId: string, messageIndex: number) => void;
}

export function useContactUsColumns({ 
  onEdit, 
  onDelete,
  onReadMessage,
  onDeleteMessage 
}: UseContactUsColumnsProps): ColumnsType<ContactUs> {
  return [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Messages',
      key: 'messages',
      width: 400,
      render: (_, record: ContactUs) => {
        if (!record.messages?.length) return null;
        
        const sortedMessages = [...record.messages].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        const latestMessage = sortedMessages[0];
        
        return (
          <div className="max-w-lg">
            {/* Latest message preview */}
            <Space direction="vertical" size={0} className="mb-2">
              <Text strong>Latest Message:</Text>
              <div className="flex items-center gap-2">
                <Text>{latestMessage.text}</Text>
                <Tag color={latestMessage.isRead ? 'green' : 'gold'}>
                  {latestMessage.isRead ? 'Read' : 'Unread'}
                </Tag>
                <Space>
                  {!latestMessage.isRead && (
                    <Button
                      type="text"
                      icon={<CheckOutlined />}
                      onClick={() => onReadMessage(record._id!, 0)}
                      title="Mark as Read"
                    />
                  )}
                  <Popconfirm
                    title="Delete this message?"
                    onConfirm={() => onDeleteMessage(record._id!, 0)}
                  >
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      title="Delete Message"
                    />
                  </Popconfirm>
                </Space>
              </div>
              <Text type="secondary" className="text-xs">
                {formatDistanceToNow(new Date(latestMessage.createdAt), { addSuffix: true })}
              </Text>
            </Space>

            {/* Collapsible history */}
            {sortedMessages.length > 1 && (
              <Collapse size="small" className="bg-transparent">
                <Collapse.Panel header="View Message History" key="1">
                  <Space direction="vertical" className="w-full">
                    {sortedMessages.slice(1).map((msg, index) => (
                      <div key={index} className="border-b pb-2 last:border-b-0">
                        <div className="flex items-center gap-2">
                          <Text>{msg.text}</Text>
                          <Tag color={msg.isRead ? 'green' : 'gold'}>
                            {msg.isRead ? 'Read' : 'Unread'}
                          </Tag>
                          <Space>
                            {!msg.isRead && (
                              <Button
                                type="text"
                                icon={<CheckOutlined />}
                                onClick={() => onReadMessage(record._id!, index + 1)}
                                title="Mark as Read"
                              />
                            )}
                            <Popconfirm
                              title="Delete this message?"
                              onConfirm={() => onDeleteMessage(record._id!, index + 1)}
                            >
                              <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                                title="Delete Message"
                              />
                            </Popconfirm>
                          </Space>
                        </div>
                        <Text type="secondary" className="text-xs">
                          {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                        </Text>
                      </div>
                    ))}
                  </Space>
                </Collapse.Panel>
              </Collapse>
            )}
          </div>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: ContactUs) => {
        const hasId = typeof record._id === 'string' && record._id.length > 0;

        return (
          <Space>
            <EditButton onClick={() => onEdit(record)} />
            {hasId && (
              <Popconfirm
                title="Are you sure you want to delete this contact?"
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
