import React, { useEffect, useState } from 'react';
import {
  Drawer,
  Form,
  Input,
  InputNumber,
  Button,
  Select,
  Upload,
  message,
  Switch,
  Collapse,
  Space,
  Tag,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Product } from '../../../models/product.model';
import { useAllCategories } from '../../../queries/category.query';
import { storage } from '../../../firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { UploadFile } from 'antd/es/upload/interface';
import { Perfume } from '../../../models/perfume.model';
import { Textile } from '../../../models/textile.model';
import { Appliance } from '../../../models/appliance.model';

const { Panel } = Collapse;

interface Cost {
  cost: number;
  currency: string;
}

interface ProductModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: Omit<Product | Perfume | Textile | Appliance, '_id'>) => Promise<void>;
  initialData?: Product | Perfume | Textile | Appliance;
}

const ProductModal: React.FC<ProductModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialData,
}) => {
  const [form] = Form.useForm();
  const { data: categories } = useAllCategories();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const mainCategories = categories?.filter((cat) => !cat.parentCategory) || [];

  const getAvailableCategories = (selectedCats: string[]) => {
    if (selectedCats.length === 0) {
      return mainCategories; // Show only main categories when nothing is selected
    }
  
    const lastSelectedCategory = selectedCats[selectedCats.length - 1]; // Get the most recent selection
    return categories?.filter(cat => cat.parentCategory && cat.parentCategory._id === lastSelectedCategory) || [];
  };
  
  const handleCategoryChange = (values: string[]) => {
    if (values.length === 0) {
      // Reset to main categories if nothing is selected
      setSelectedCategories([]);
      form.setFieldsValue({ categories: [] });
      return;
    }
  
    const lastSelectedCategory = values[values.length - 1]; // Get the most recent selection
    const subCategories = categories?.filter(cat => cat.parentCategory?._id === lastSelectedCategory).map(cat => cat._id) || [];
  
    if (subCategories.length > 0) {
      // Keep only the last selected category
      setSelectedCategories([lastSelectedCategory]);
      form.setFieldsValue({ categories: [lastSelectedCategory] });
    } else {
      // Allow selection of multiple subcategories if no further nesting exists
      setSelectedCategories(values);
      form.setFieldsValue({ categories: values });
    }
  };

  useEffect(() => {
    // Reset form when modal opens
    if (visible) {
      if (initialData) {
        const categoryIds = initialData.categories
  ?.map(cat => cat._id)
  .filter((id): id is string => id !== undefined) || [];

        // Set all form values including category-specific fields
        const formValues: any = {
          name: initialData.name,
          description: initialData.description,
          categories: categoryIds,
          isAvailable: initialData.isAvailable,
          specifications: initialData.specifications,
          images: initialData.images,
        };

        // Handle cost array
        if (Array.isArray(initialData.cost)) {
          formValues.cost = initialData.cost as Cost[];
        } else if (initialData.cost) {
          const cost = initialData.cost as Cost;
          formValues.cost = [
            {
              cost: cost.cost,
              currency: cost.currency || 'USD',
            },
          ];
        }

        // Set form values
        form.setFieldsValue(formValues);

        // Set images in fileList for display
        const initialFileList: UploadFile[] = (initialData.images || []).map((url, index) => ({
          uid: `-${index}`,
          name: `image-${index}`,
          status: 'done',
          url: url,
          type: 'image/jpeg',
        }));
        setFileList(initialFileList);
        setImageUrls(initialData.images || []);

        // Set selected categories
        setSelectedCategories(categoryIds as string[]);
      } else {
        // Reset everything when opening for a new product
        form.resetFields();
        setFileList([]);
        setImageUrls([]);
        setSelectedCategories([]);
      }
    }
  }, [visible, initialData, form]);

  const handleUpload = async (file: File) => {
    try {
      setUploading(true);
      
      // Create a unique filename to prevent overwriting
      const timestamp = Date.now();
      const uniqueFileName = `${timestamp}_${file.name}`;
      const storageRef = ref(storage, `products/${uniqueFileName}`);
      
      // Upload the file
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      // Update image URLs in state
      setImageUrls(prev => [...prev, url]);

      // Get current images and ensure it's an array
      let currentImages = form.getFieldValue('images');
      if (!Array.isArray(currentImages)) {
        currentImages = [];
      }

      // Update form with new image URL
      form.setFieldsValue({
        images: [...currentImages, url],
      });

      // Update fileList with new image
      setFileList(prev => [
        ...prev,
        {
          uid: `-${prev.length + 1}`,
          name: file.name,
          status: 'done',
          url: url,
          type: file.type,
        },
      ]);

      message.success('Image uploaded successfully!');
      return url;
    } catch (error) {
      console.error('Error uploading image:', error);
      message.error('Failed to upload image');
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (!values.categories || values.categories.length < 1) {
        message.error('Please select at least one category');
        return;
      }

      await onSubmit(values);
      form.resetFields();
      onCancel();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const renderCategorySpecificFields = () => {
    // Get the first main category selected (if any)
    const mainCategory = selectedCategories.find((catId) =>
      mainCategories.some((main) => main._id === catId)
    );

    if (!mainCategory) return null;

    switch (mainCategory) {
      case '67c86bfeeee50cc264f911f8': //Perfume
        return (
          <>
            <Form.Item
              name="brand"
              label="Brand"
              rules={[{ required: true, message: 'Please enter brand' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="scent"
              label="Scent"
              rules={[{ required: true, message: 'Please enter the scent' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="gender"
              label="Gender"
              rules={[{ required: true, message: 'Please select gender' }]}
            >
              <Select>
                <Select.Option value="Men">Men</Select.Option>
                <Select.Option value="Women">Women</Select.Option>
                <Select.Option value="Unisex">Unisex</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Sizes"
              required
              style={{ marginBottom: 0 }}
            >
              <Form.List
                name="sizes"
                rules={[
                  {
                    validator: async (_, sizes) => {
                      if (!sizes || sizes.length < 1) {
                        return Promise.reject(new Error('At least one size is required'));
                      }
                    },
                  },
                ]}
              >
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Space
                        key={key}
                        style={{ display: 'flex', marginBottom: 8 }}
                        align="baseline"
                      >
                        <Form.Item
                          {...restField}
                          name={[name, 'size']}
                          rules={[{ required: true, message: 'Missing size' }]}
                        >
                          <Input placeholder="Size" />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, 'price']}
                          rules={[{ required: true, message: 'Missing price' }]}
                        >
                          <InputNumber placeholder="Price" min={0} />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, 'currency']}
                          rules={[{ required: true, message: 'Missing currency' }]}
                          initialValue="USD"
                        >
                          <Input placeholder="Currency" />
                        </Form.Item>
                        <Button onClick={() => remove(name)} type="link" danger>
                          Delete
                        </Button>
                      </Space>
                    ))}
                    <Form.Item>
                      <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                        Add Size
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Form.Item>
          </>
        );

      case '67dc2bdbbea1059b31737418': //textiles
        return (
          <>
            <Form.Item
              name="brand"
              label="Brand"
              rules={[{ required: true, message: 'Please enter brand' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="material"
              label="Material"
              rules={[{ required: true, message: 'Please enter material' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="color"
              label="Color"
              rules={[{ required: true, message: 'Please enter color' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="careInstructions"
              label="Care Instructions"
              rules={[{ required: true, message: 'Please enter care instructions' }]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item
              label="Sizes"
              required
              style={{ marginBottom: 0 }}
            >
              <Form.List
                name="sizes"
                rules={[
                  {
                    validator: async (_, sizes) => {
                      if (!sizes || sizes.length < 1) {
                        return Promise.reject(new Error('At least one size is required'));
                      }
                    },
                  },
                ]}
              >
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Space
                        key={key}
                        style={{ display: 'flex', marginBottom: 8 }}
                        align="baseline"
                      >
                        <Form.Item
                          {...restField}
                          name={[name, 'size']}
                          rules={[{ required: true, message: 'Missing size' }]}
                        >
                          <Input placeholder="Size" />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, 'price']}
                          rules={[{ required: true, message: 'Missing price' }]}
                        >
                          <InputNumber placeholder="Price" min={0} />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, 'currency']}
                          rules={[{ required: true, message: 'Missing currency' }]}
                          initialValue="USD"
                        >
                          <Input placeholder="Currency" />
                        </Form.Item>
                        <Button onClick={() => remove(name)} type="link" danger>
                          Delete
                        </Button>
                      </Space>
                    ))}
                    <Form.Item>
                      <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                        Add Size
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Form.Item>
          </>
        );

      case '67dc8f84bc9305e3287ae843': //appliances
        return (
          <>
            <Form.Item
              name="brand"
              label="Brand"
              rules={[{ required: true, message: 'Please enter brand' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="warranty"
              label="Warranty"
              rules={[{ required: true, message: 'Please enter warranty' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="powerConsumption"
              label="Power Consumption"
              rules={[{ required: true, message: 'Please enter Power Consumption' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="rooms"
              label="Rooms"
              rules={[{ required: true, message: 'Please select rooms' }]}
            >
              <Select mode="multiple">
                <Select.Option value="living">Living Room</Select.Option>
                <Select.Option value="bedroom">Bedroom</Select.Option>
                <Select.Option value="kitchen">Kitchen</Select.Option>
                <Select.Option value="bathroom">Bathroom</Select.Option>
                <Select.Option value="office">Office</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Sizes"
              required
              style={{ marginBottom: 0 }}
            >
              <Form.List
                name="sizes"
                rules={[
                  {
                    validator: async (_, sizes) => {
                      if (!sizes || sizes.length < 1) {
                        return Promise.reject(new Error('At least one size is required'));
                      }
                    },
                  },
                ]}
              >
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Space
                        key={key}
                        style={{ display: 'flex', marginBottom: 8 }}
                        align="baseline"
                      >
                        <Form.Item
                          {...restField}
                          name={[name, 'size']}
                          rules={[{ required: true, message: 'Missing size' }]}
                        >
                          <Input placeholder="Size" />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, 'price']}
                          rules={[{ required: true, message: 'Missing price' }]}
                        >
                          <InputNumber placeholder="Price" min={0} />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, 'currency']}
                          rules={[{ required: true, message: 'Missing currency' }]}
                          initialValue="USD"
                        >
                          <Input placeholder="Currency" />
                        </Form.Item>
                        <Button onClick={() => remove(name)} type="link" danger>
                          Delete
                        </Button>
                      </Space>
                    ))}
                    <Form.Item>
                      <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                        Add Size
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Form.Item>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Drawer
      title={initialData ? 'Edit Product' : 'Add Product'}
      placement="right"
      width={720}
      onClose={() => {
        // Clean up form and state when drawer closes
        form.resetFields();
        setFileList([]);
        setImageUrls([]);
        setSelectedCategories([]);
        onCancel();
      }}
      open={visible}
      extra={
        <Space>
          <Button
            onClick={() => {
              // Clean up form and state when canceling
              form.resetFields();
              setFileList([]);
              setImageUrls([]);
              setSelectedCategories([]);
              onCancel();
            }}
          >
            Cancel
          </Button>
          <Button type="primary" onClick={handleSubmit}>
            Save
          </Button>
        </Space>
      }
    >
      <Form form={form} layout="vertical" requiredMark>
        <Collapse defaultActiveKey={['1', '2', '3']} ghost>
          <Panel header="Basic Information" key="1">
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: 'Please enter product name' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: 'Please enter product description' }]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item
              name="categories"
              label="Categories"
              rules={[{ required: true, message: 'Please select at least one category' }]}
            >
              <Select
  mode="multiple"
  placeholder="Select categories"
  onChange={handleCategoryChange}
  options={getAvailableCategories(selectedCategories).map((cat) => ({
    value: cat._id, // Keep _id as value
    label: cat.name, // Show name in the dropdown
  }))}
  value={selectedCategories}
  tagRender={(props) => {
    const { label, value, closable, onClose } = props;
    const category = categories?.find(cat => cat._id === value);
    return (
      <Tag 
        closable={closable} 
        onClose={onClose} 
        style={{ marginRight: 3 }}
      >
        {category ? category.name : label} {/* Show category name */}
      </Tag>
    );
  }}
/>

            </Form.Item>
            <Form.Item
              name="cost"
              label="Cost"
              rules={[{ required: true, message: 'Please add at least one cost' }]}
            >
              <Form.List
                name="cost"
                rules={[
                  {
                    validator: async (_, costs) => {
                      if (!costs || costs.length < 1) {
                        return Promise.reject(new Error('At least one cost is required'));
                      }
                    },
                  },
                ]}
              >
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Space
                        key={key}
                        style={{ display: 'flex', marginBottom: 8 }}
                        align="baseline"
                      >
                        <Form.Item
                          {...restField}
                          name={[name, 'cost']}
                          rules={[{ required: true, message: 'Missing cost' }]}
                        >
                          <InputNumber placeholder="Cost" min={0} />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, 'currency']}
                          rules={[{ required: true, message: 'Missing currency' }]}
                          initialValue="USD"
                        >
                          <Input placeholder="Currency" />
                        </Form.Item>
                        <Button onClick={() => remove(name)} type="link" danger>
                          Delete
                        </Button>
                      </Space>
                    ))}
                    <Form.Item>
                      <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                        Add Cost
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Form.Item>
            <Form.Item
              name="isAvailable"
              label="Available"
              valuePropName="checked"
              initialValue={true}
            >
              <Switch />
            </Form.Item>
          </Panel>

          <Panel header="Images" key="2">
            <Form.Item
              name="images"
              label="Product Images"
              rules={[{ required: true, message: 'Please upload at least one image' }]}
              initialValue={[]}
            >
              <Upload
                listType="picture-card"
                fileList={fileList}
                beforeUpload={(file) => {
                  const isImage = file.type.startsWith('image/');
                  if (!isImage) {
                    message.error('You can only upload image files!');
                  }
                  return isImage;
                }}
                customRequest={async ({ file, onSuccess, onError }) => {
                  try {
                    if (file instanceof File) {
                      await handleUpload(file);
                      onSuccess?.('ok');
                    }
                  } catch (error) {
                    onError?.(error as Error);
                  }
                }}
                onRemove={(file) => {
                  const index = fileList.indexOf(file);
                  const newFileList = fileList.slice();
                  newFileList.splice(index, 1);
                  setFileList(newFileList);

                  // Also update form images
                  const currentImages = form.getFieldValue('images') || [];
                  const newImages = [...currentImages];
                  newImages.splice(index, 1);
                  form.setFieldsValue({ images: newImages });

                  return true;
                }}
              >
                {fileList.length >= 8 ? null : (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
          </Panel>

          {selectedCategories.length > 0 && (
            <Panel header="Category-Specific Details" key="3">
              {renderCategorySpecificFields()}
            </Panel>
          )}
        </Collapse>
      </Form>
    </Drawer>
  );
};

export default ProductModal;
