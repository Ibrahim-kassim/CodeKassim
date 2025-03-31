import React, { useEffect, useState } from 'react';
import { Modal, Form, Select, Tag, Input, Space } from 'antd';
import type { InputRef } from 'antd';
import { Category } from '../../../models/category.model';
import TextField from '../../../components/forms/components/TextField';
import { PlusOutlined } from '@ant-design/icons';
import { useAllCategories } from '../../../queries/category.query';

type CategoryFormData = {
  name: string;
  parentCategory: string | null;
  attributes: string[];
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (category: CategoryFormData) => void;
  initialData?: Category | null;
};

const CategoryModal: React.FC<Props> = ({
  visible,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [form] = Form.useForm<CategoryFormData>();
  const [attributes, setAttributes] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [inputVisible, setInputVisible] = useState(false);
  const inputRef = React.useRef<InputRef>(null);

  const { data: categories, isPending } = useAllCategories();

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        name: initialData.name,
        parentCategory: initialData.parentCategory,
        attributes: initialData.attributes,
      });
      setAttributes(initialData.attributes || []);
    } else {
      form.resetFields();
      setAttributes([]);
    }
  }, [initialData, form]);

  const handleFinish = (values: CategoryFormData) => {
    const formData = {
      ...values,
      attributes,
      parentCategory: values.parentCategory || null,
    };
    onSubmit(formData);
    onClose();
  };

  const handleInputConfirm = () => {
    if (inputValue && !attributes.includes(inputValue)) {
      setAttributes([...attributes, inputValue]);
    }
    setInputVisible(false);
    setInputValue('');
  };

  const handleAttributeDelete = (removedAttribute: string) => {
    const newAttributes = attributes.filter(
      (attribute) => attribute !== removedAttribute
    );
    setAttributes(newAttributes);
  };

  return (
    <Modal
      open={visible}
      title={initialData ? 'Edit Category' : 'Add Category'}
      onCancel={onClose}
      afterClose={() => {form.resetFields(); setAttributes([]); setInputVisible(false); setInputValue('');}}
      onOk={() => form.submit()}
      okText="Save"
      confirmLoading={isPending}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{ parentCategory: null, attributes: [] }}
      >
        <TextField id="name" name="name" label="Name" required />

        <Form.Item name="parentCategory" label="Parent Category">
          <Select
            allowClear
            placeholder="Select parent category"
            loading={isPending}
            options={categories?.map((cat: Category) => ({
              value: cat._id,
              label: cat.name,
            }))}
          />
        </Form.Item>

        <Form.Item label="Attributes">
          <Space direction="vertical" style={{ width: '100%' }}>
            <div style={{ marginBottom: 8 }}>
              {attributes.map((attribute) => (
                <Tag
                  key={attribute}
                  closable
                  onClose={() => handleAttributeDelete(attribute)}
                  style={{ marginBottom: 4 }}
                >
                  {attribute}
                </Tag>
              ))}
            </div>
            {inputVisible ? (
              <Input
                ref={inputRef}
                type="text"
                size="small"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onBlur={handleInputConfirm}
                onPressEnter={handleInputConfirm}
                style={{ width: 200 }}
              />
            ) : (
              <Tag
                onClick={() => setInputVisible(true)}
                style={{ cursor: 'pointer' }}
              >
                <PlusOutlined /> Add Attribute
              </Tag>
            )}
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CategoryModal;
