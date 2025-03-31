import React from 'react';
import { Form, Input } from 'antd';
import { Rule } from 'antd/lib/form';
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

interface Props {
  id: string;
  name: string;
  label: string;
  rules?: Rule[];
  disabled?: boolean;
  required?: boolean;
  dataCy?: string;
}

const PasswordField: React.FC<Props> = ({ 
  id, 
  name, 
  label, 
  rules = [], 
  disabled = false,
  required = false,
  dataCy,
}) => {
  const finalRules = [...rules];
  if (required && !rules.some(rule => 'required' in rule)) {
    finalRules.unshift({ required: true, message: `${label} is required` });
  }

  return (
    <Form.Item
      key={id}
      name={name}
      label={label}
      rules={finalRules}
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
};

export default PasswordField;
