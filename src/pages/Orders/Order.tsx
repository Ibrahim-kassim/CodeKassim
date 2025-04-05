import React, { useEffect, useState, useMemo } from "react";
import { Button, Popconfirm, Radio, Space, Table, Tag } from "antd";
import { AddButton } from "../../generalComponents";
import { useOrderActions } from "./hooks/useOrderActions";
import { useOrderColumns } from "./hooks/useOrderColumns";
import { Order } from "../../models/order.model";
import OrderModal from "./components/OrderModal";

export default function Orders() {
  const {
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
    orders,
  } = useOrderActions();

  const [selectedOrderFilter, setSelectedOrderFilter] =
    useState<string>('all');

  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    
    switch (selectedOrderFilter) {
      case 'Pending':
        return orders.filter((order) => 
          (order as Order).status === 'pending'
        );
      case 'Completed':
        return orders.filter((order) => 
          (order as Order).status === 'completed'
        );
      case 'Cancelled':
        return orders.filter((order) => 
          (order as Order).status === 'cancelled'
        );
      default:
        return orders;
    }
  }, [orders, selectedOrderFilter]);

  // Get columns configuration from the hook
  const columns = useMemo(() => useOrderColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  }), [handleEdit, handleDelete]);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-red-600">Orders</h1>
        <div className="flex space-x-3">
          {selectedRowKeys.length > 0 && (
            <Popconfirm
              title={`Delete ${selectedRowKeys.length} selected orders?`}
              onConfirm={handleBulkDelete}
            >
              <Button danger>Delete Selected</Button>
            </Popconfirm>
          )}
        </div>
      </div>

      {/* Order Filter */}
      <div className="mb-4">
        <Radio.Group
          value={selectedOrderFilter}
          onChange={(e) => setSelectedOrderFilter(e.target.value)}
          optionType="button"
          buttonStyle="solid"
        >
          <Radio.Button value="all">All</Radio.Button>
          <Radio.Button value="completed">Completed</Radio.Button>
          <Radio.Button value="cancelled">Cancelled</Radio.Button>
          <Radio.Button value="pending">Pending</Radio.Button>
        </Radio.Group>
      </div>

      {/* Table Section */}
      <Table<Order>
        dataSource={filteredOrders as Order[]}
        columns={columns}
        rowKey={(record) => record._id || ''}
        pagination={{ pageSize: 5 }}
        rowSelection={rowSelection}
        loading={isLoading}
      />

      {/* Modal for Adding/Editing Contacts */}
      <OrderModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmit}
        initialData={selectedOrder}
      />
    </div>
  );
}