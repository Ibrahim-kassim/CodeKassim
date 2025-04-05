import { useState } from 'react';
import { TableRowSelection } from 'antd/es/table/interface';
import { Order } from '../../../models/order.model';
import { useAllOrders as useOrders, useCreateOrder, useDeleteOrder, useUpdateOrder } from '../../../queries/order.query';

export function useOrderActions() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const { data: orders, isLoading, refetch: refetchOrders } = useOrders();
  const { mutateAsync: createOrder } = useCreateOrder();
  const { mutateAsync: updateOrder } = useUpdateOrder();
  const { mutateAsync: deleteOrder } = useDeleteOrder();

  // Handle adding new order
  const handleAdd = () => {
    setSelectedOrder(null);
    setModalVisible(true);
  };

  // Handle editing order
  const handleEdit = (order: Order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  // Handle deleting order
  const handleDelete = async (id: string) => {
    try {
      await deleteOrder({ orderId: id });
      refetchOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  // Handle form submission
  const handleSubmit = async (formData: Order) => {
    try {
      if (selectedOrder?._id) {
        await updateOrder({ _id: selectedOrder._id, ...formData });
      } else {
        await createOrder(formData as Required<Order>);
      }
      refetchOrders();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    try {
      await Promise.all(
        selectedRowKeys.map((key) => deleteOrder({ orderId: key.toString() }))
      );
      setSelectedRowKeys([]);
      refetchOrders();
    } catch (error) {
      console.error('Error deleting orders:', error);
    }
  };

  // Row selection configuration
  const rowSelection: TableRowSelection<Order> = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  return {
    selectedOrder,
    modalVisible,
    selectedRowKeys,
    setModalVisible,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleBulkDelete,
    rowSelection,
    isLoading,
    orders: orders || [],
  };
}
