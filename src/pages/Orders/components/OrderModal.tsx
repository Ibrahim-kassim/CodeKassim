import React, { useEffect } from 'react';
import { Modal, Form } from 'antd';
import { Order } from '../../../models/order.model';
import TextField from '../../../components/forms/components/TextField';

type OrderFormData = Omit<Order, '_id' | '__v' | 'createdAt' | 'updatedAt'>;

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (order: OrderFormData) => void;
  initialData?: Order | null;
};

const OrderModal: React.FC<Props> = ({
  visible,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [form] = Form.useForm<OrderFormData>();

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        clientName: initialData.clientName,
        clientPhone: initialData.clientPhone,
        location: initialData.location,
        products: initialData.products,
        status: initialData.status,
      });
    } else {
      form.resetFields();
    }
  }, [initialData, form]);

  const handleFinish = (values: OrderFormData) => {
    const formData = {
      ...values,
    };
    onSubmit(formData);
    onClose();
  };

  return (
    <Modal
      open={visible}
      title={initialData ? 'View Order' : 'Add Order'}
      onCancel={onClose}
      afterClose={() => {
        form.resetFields();
      }}
      onOk={() => form.submit()}
      okText="Save"
      forceRender
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          name: '',
          email: '',
          phone: '',
          messages: [{
            text: '',
            isRead: false,
            createdAt: new Date().toISOString(),
          }],
        }}
      >
        <TextField 
          id="clientName" 
          label="Client Name" 
          required 
        />

        <TextField 
          id="clientPhone" 
          label="Client Phone" 
          required 
          rules={[
            { pattern: /^[0-9]+$/, message: 'Please enter valid phone number' }
          ]}
        />

        <TextField 
          id="location" 
          label="Location" 
          required 
        />

        <TextField 
          id="products" 
          label="Products" 
          required 
          rules={[
            { pattern: /^[0-9]+$/, message: 'Please enter valid phone number' }
          ]}
        />

        <TextField 
          id="status" 
          label="Status" 
          required 
          rules={[
            { pattern: /^[0-9]+$/, message: 'Please enter valid phone number' }
          ]}
        />
      </Form>
    </Modal>
  );
};

export default OrderModal;
