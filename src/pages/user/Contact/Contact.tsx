import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { MailOutlined, PhoneOutlined, UserOutlined, SendOutlined } from '@ant-design/icons';
import { useCreateContact } from '../../../queries/contactUs.query';

const { TextArea } = Input;

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const Contact = () => {
  const [form] = Form.useForm();
  const createContactMutation = useCreateContact();

  const onFinish = (values: ContactFormData) => {
    console.log('Form values:', values);
    const contactData = {
      name: values.name,
      email: values.email,
      phone: values.phone,
      message: values.message
    };

    createContactMutation.mutate(contactData as any, {
      onSuccess: () => {
        message.success('Message sent successfully!');
        form.resetFields();
      },
      onError: () => {
        message.error('Failed to send message. Please try again.');
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Contact Us</h1>
            <p className="text-lg text-gray-600">
              Have a question or feedback? We'd love to hear from you.
            </p>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              className="space-y-4"
            >
              <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: 'Please enter your name' }]}
              >
                <Input
                  prefix={<UserOutlined className="text-gray-400" />}
                  placeholder="Your name"
                  size="large"
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Please enter your email' },
                  { type: 'email', message: 'Please enter a valid email' }
                ]}
              >
                <Input
                  prefix={<MailOutlined className="text-gray-400" />}
                  placeholder="Your email"
                  size="large"
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item
                name="phone"
                label="Phone"
                rules={[{ required: true, message: 'Please enter your phone number' }]}
              >
                <Input
                  prefix={<PhoneOutlined className="text-gray-400" />}
                  placeholder="Your phone number"
                  size="large"
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item
                name="message"
                label="Message"
                rules={[{ required: true, message: 'Please enter your message' }]}
              >
                <TextArea
                  placeholder="Your message"
                  rows={6}
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item className="mb-0">
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  icon={<SendOutlined />}
                  loading={createContactMutation.isPending}
                  className="w-full bg-red-500 hover:bg-red-600 border-none rounded-lg h-12 text-lg"
                >
                  Send Message
                </Button>
              </Form.Item>
            </Form>
          </div>

          {/* Additional Contact Info */}
          <div className="mt-12 grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6 bg-white rounded-xl shadow-md">
              <MailOutlined className="text-3xl text-red-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Email</h3>
              <p className="text-gray-600">support@example.com</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-md">
              <PhoneOutlined className="text-3xl text-red-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Phone</h3>
              <p className="text-gray-600">+1 234 567 890</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-md">
              <UserOutlined className="text-3xl text-red-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Office</h3>
              <p className="text-gray-600">123 Business Ave, Suite 100</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;