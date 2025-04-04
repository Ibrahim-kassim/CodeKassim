import React from 'react';
import { Form, Input } from 'antd';
import { Rule } from 'antd/es/form';
import { NamePath } from 'antd/es/form/interface';

interface Props {
  id: NamePath;
  label: string;
  required?: boolean;
  type?: 'text' | 'textarea';
  rules?: Rule[];
}

const TextField: React.FC<Props> = ({ id, label, required, type = 'text', rules = [] }) => {
  const defaultRules = required ? [{ required: true, message: `Please enter ${label}` }] : [];
  const InputComponent = type === 'textarea' ? Input.TextArea : Input;

  return (
    <Form.Item
      name={id}
      label={label}
      rules={[...defaultRules, ...rules]}
    >
      <InputComponent />
    </Form.Item>
  );
};

export default TextField;
