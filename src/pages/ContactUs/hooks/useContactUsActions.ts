import { useState } from 'react';
import { TableRowSelection } from 'antd/es/table/interface';
import { ContactUs } from '../../../models/contactUs.model';
import { useAllContacts as useContacts, useCreateContact, useDeleteContact, useUpdateContact, useReadMessage, useDeleteMessage } from '../../../queries/contactUs.query';

export function useContactUsActions() {
  const [selectedContact, setSelectedContact] = useState<ContactUs | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const { data: contacts, isLoading, refetch: refetchContacts } = useContacts();
  const { mutateAsync: createContact } = useCreateContact();
  const { mutateAsync: updateContact } = useUpdateContact();
  const { mutateAsync: deleteContact } = useDeleteContact();
  const { mutateAsync: readMessage } = useReadMessage();
  const { mutateAsync: deleteMessage } = useDeleteMessage();

  // Handle adding new contact
  const handleAdd = () => {
    setSelectedContact(null);
    setModalVisible(true);
  };

  // Handle editing contact
  const handleEdit = (contact: ContactUs) => {
    setSelectedContact(contact);
    setModalVisible(true);
  };

  // Handle deleting contact
  const handleDelete = async (id: string) => {
    try {
      await deleteContact({ contactId: id });
      refetchContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  // Handle form submission
  const handleSubmit = async (formData: ContactUs) => {
    try {
      if (selectedContact?._id) {
        await updateContact({ _id: selectedContact._id, ...formData });
      } else {
        await createContact(formData as Required<ContactUs>);
      }
      refetchContacts();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    try {
      await Promise.all(
        selectedRowKeys.map((key) => deleteContact({ contactId: key.toString() }))
      );
      setSelectedRowKeys([]);
      refetchContacts();
    } catch (error) {
      console.error('Error deleting contacts:', error);
    }
  };

  // Handle reading a message
  const handleReadMessage = async (contactId: string, messageIndex: number) => {
    try {
      await readMessage({ contactId, messageIndex });
      refetchContacts();
    } catch (error) {
      console.error('Error reading message:', error);
    }
  };

  // Handle deleting a message
  const handleDeleteMessage = async (contactId: string, messageIndex: number) => {
    try {
      await deleteMessage({ contactId, messageIndex });
      refetchContacts();
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  // Row selection configuration
  const rowSelection: TableRowSelection<ContactUs> = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  return {
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
    contacts: contacts || [],
  };
}
