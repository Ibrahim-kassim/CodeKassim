import React, { useEffect, useState, useMemo } from "react";
import { Button, Popconfirm, Radio, Space, Table, Tag } from "antd";
import { ContactUs } from '../../models/contactUs.model';
import ContactModal from "./components/ContactModal";
import { AddButton, DeleteButton, EditButton } from "../../generalComponents";
import { useContactUsActions } from "./hooks/useContactUsActions";
import { useContactUsColumns } from "./hooks/useContactUsColumns";

export default function Contacts() {
  const {
    selectedContact,
    modalVisible,
    selectedRowKeys,
    setModalVisible,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleBulkDelete,
    handleReadMessage,
    handleDeleteMessage,
    rowSelection,
    isLoading,
    contacts,
  } = useContactUsActions();

  const [selectedContactFilter, setSelectedContactFilter] =
    useState<string>('all');

  const filteredContacts = useMemo(() => {
    if (!contacts) return [];
    
    switch (selectedContactFilter) {
      case 'read':
        return contacts.filter((contact) => 
          contact.messages?.some(msg => msg.isRead)
        );
      case 'unread':
        return contacts.filter((contact) => 
          contact.messages?.every(msg => !msg.isRead)
        );
      default:
        return contacts;
    }
  }, [contacts, selectedContactFilter]);

  // Get columns configuration from the hook
  const columns = useMemo(() => useContactUsColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
    onReadMessage: handleReadMessage,
    onDeleteMessage: handleDeleteMessage,
  }), [handleEdit, handleDelete, handleReadMessage, handleDeleteMessage]);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-red-600">Contacts</h1>
        <div className="flex space-x-3">
          {selectedRowKeys.length > 0 && (
            <Popconfirm
              title={`Delete ${selectedRowKeys.length} selected contacts?`}
              onConfirm={handleBulkDelete}
            >
              <Button danger>Delete Selected</Button>
            </Popconfirm>
          )}
        </div>
      </div>

      {/* Contact Filter */}
      <div className="mb-4">
        <Radio.Group
          value={selectedContactFilter}
          onChange={(e) => setSelectedContactFilter(e.target.value)}
          optionType="button"
          buttonStyle="solid"
        >
          <Radio.Button value="all">All</Radio.Button>
          <Radio.Button value="read">Read</Radio.Button>
          <Radio.Button value="unread">Unread</Radio.Button>
        </Radio.Group>
      </div>

      {/* Table Section */}
      <Table<ContactUs>
        dataSource={filteredContacts}
        columns={columns}
        rowKey={(record) => record._id || ''}
        pagination={{ pageSize: 5 }}
        rowSelection={rowSelection}
        loading={isLoading}
        rowClassName={(record) => {
          const hasUnreadMessages = record.messages?.every(msg => !msg.isRead);
          return hasUnreadMessages ? 'bg-gray-50' : '';
        }}
      />

      {/* Modal for Adding/Editing Contacts */}
      <ContactModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmit}   
        initialData={selectedContact}
      />
    </div>
  );
}