// src/components/LoginForm.tsx
import React from "react";
import { Button, Form, Alert } from "antd";
import TextField from "../forms/components/TextField";
import PasswordField from "../forms/components/PasswordField";

type LoginFormProps = {
  onSubmit: (values: { username: string; password: string }) => void;
  initialUsername?: string;
  initialPassword?: string;
  loading?: boolean;
  error?: string;
};

const LoginForm: React.FC<LoginFormProps> = ({ 
    onSubmit, 
    initialUsername = "", 
    initialPassword = "",
    loading = false,
    error
}) => {
    const [form] = Form.useForm();

    const handleFinish = (values: { username: string; password: string }) => {
        onSubmit(values);
    };

    return (
      <Form
        form={form}
        layout="vertical"
        initialValues={{ username: initialUsername, password: initialPassword }}
        onFinish={handleFinish}
        className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg"
        disabled={loading}
      >
        <h2 className="text-2xl font-semibold text-center mb-6 text-red-600">
          Login
        </h2>

        {error && (
          <Form.Item>
            <Alert message={error} type="error" showIcon />
          </Form.Item>
        )}

        <TextField
          id="username"
          label="userName"
          required={true}
          disabled={loading}
        />
        <PasswordField
          id="password"
          label="Password"
          required={true}
          disabled={loading}
        />
        <Form.Item>
          <Button
            type="primary"
            className="bg-red-500 hover:bg-red-600"
            htmlType="submit"
            loading={loading}
            block
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </Form.Item>
      </Form>
    );
};

export default LoginForm;
