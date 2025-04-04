import React, { useEffect } from 'react';
import { Modal, Form } from 'antd';
import { ContactUs } from '../../../models/contactUs.model';
import TextField from '../../../components/forms/components/TextField';

type ContactFormData = Omit<ContactUs, '_id' | '__v' | 'createdAt' | 'updatedAt'>;

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (contact: ContactFormData) => void;
  initialData?: ContactUs | null;
};

const ContactModal: React.FC<Props> = ({
  visible,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [form] = Form.useForm<ContactFormData>();

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        name: initialData.name,
        email: initialData.email,
        phone: initialData.phone,
      });
    } else {
      form.resetFields();
    }
  }, [initialData, form]);

  const handleFinish = (values: ContactFormData) => {
    const formData = {
      ...values,
    };
    onSubmit(formData);
    onClose();
  };

  return (
    <Modal
      open={visible}
      title={initialData ? 'View Contact' : 'Add Contact'}
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
          id="name" 
          label="Name" 
          required 
        />

        <TextField 
          id="email" 
          label="Email" 
          required 
          rules={[
            { type: 'email', message: 'Please enter a valid email' }
          ]}
        />

        <TextField 
          id="phone" 
          label="Phone" 
          required 
          rules={[
            { pattern: /^[0-9]+$/, message: 'Please enter valid phone number' }
          ]}
        />
      </Form>
    </Modal>
  );
};

export default ContactModal;
