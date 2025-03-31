import React from 'react';
import { Form, Input } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

type Props = {
  disabled?: boolean;
  id: string;
  label: string;
  required?: boolean;
  dataCy?: string;
};

export default function PasswordField({
  disabled,
  id,
  label,
  required,
  dataCy,
}: Props) {
  return (
    <Form.Item
      key={id}
      label={label}
      name={id}
      rules={[{ required, message: 'Required' }]}
    >
      <Input.Password
        disabled={disabled}
        data-cy={dataCy}
        placeholder="Enter your password"
        iconRender={(visible) =>
          visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
        }
      />
    </Form.Item>
  );
}
