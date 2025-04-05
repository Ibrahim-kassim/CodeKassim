import React, { useEffect, useState } from 'react';
import { Modal, Form, Select, Tag, Input, Space } from 'antd';
import type { InputRef } from 'antd';
import TextField from '../../../components/forms/components/TextField';
import { PlusOutlined } from '@ant-design/icons';
import { useAllCategories } from '../../../queries/category.query';

interface BaseCategory {
  name: string;
  attributes?: string[];
}

interface CategoryWithId extends BaseCategory {
  _id: string;
  parentCategory: CategoryWithId | null;
}

interface CategoryFormData extends BaseCategory {
  parentCategory: string | null;
  attributes: string[];
}

interface CategoryModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (category: CategoryFormData) => void;
  initialData?: CategoryWithId | null;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  visible,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [form] = Form.useForm<CategoryFormData>();
  const [attributes, setAttributes] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [inputVisible, setInputVisible] = useState(false);
  const [selectedParentCategory, setSelectedParentCategory] = useState<string | null>(null);
  const inputRef = React.useRef<InputRef>(null);

  const { data: categories, isPending } = useAllCategories() as { data: CategoryWithId[] | undefined, isPending: boolean };
  
  const mainCategories = categories?.filter(cat => !cat.parentCategory) || [];

  const getAvailableCategories = () => {
    if (!categories) return [];
    
    // Function to check if a category is an ancestor of another
    const isAncestor = (potentialAncestor: CategoryWithId, category: CategoryWithId): boolean => {
      if (!category.parentCategory) return false;
      if (category.parentCategory._id === potentialAncestor._id) return true;
      return isAncestor(potentialAncestor, category.parentCategory);
    };

    // Function to get the current category if we're editing
    const getCurrentCategory = () => {
      if (!initialData) return null;
      return categories.find(cat => cat._id === initialData._id) || null;
    };

    // When selecting a parent category
    const currentCategory = getCurrentCategory();
    return categories.filter(cat => {
      // Don't show the category itself
      if (currentCategory && cat._id === currentCategory._id) return false;
      
      // Don't show any descendants of the current category (to prevent circular references)
      if (currentCategory && isAncestor(currentCategory, cat)) return false;
      
      return true;
    })
  };

  const handleParentCategoryChange = (value: string | null) => {
    setSelectedParentCategory(value);
    form.setFieldsValue({ parentCategory: value });
  };

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        name: initialData.name,
        parentCategory: initialData.parentCategory?._id || null,
        attributes: initialData.attributes,
      });
      setSelectedParentCategory(initialData.parentCategory?._id || null);
      setAttributes(initialData.attributes || []);
    } else {
      form.resetFields();
      setAttributes([]);
      setSelectedParentCategory(null);
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
      afterClose={() => {
        form.resetFields();
        setAttributes([]);
        setInputVisible(false);
        setInputValue('');
      }}
      onOk={() => form.submit()}
      okText="Save"
      confirmLoading={isPending}
      forceRender
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{ parentCategory: null, attributes: [] }}
      >
        <TextField id="name" label="Name" required />

        <Form.Item name="parentCategory" label="Parent Category">
          <Select
            allowClear
            placeholder="Select parent category"
            loading={isPending}
            onChange={handleParentCategoryChange}
            value={selectedParentCategory}
            options={getAvailableCategories().map((cat) => ({
              value: cat._id,
              label: cat.name,
            }))}
            tagRender={(props) => {
              const { label, closable, onClose } = props;
              return (
                <Tag closable={closable} onClose={onClose} style={{ marginRight: 3 }}>
                  {label}
                </Tag>
              );
            }}
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
