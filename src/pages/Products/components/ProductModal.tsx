import React, { useEffect, useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Upload,
  message,
  Button,
  Switch,
  Steps,
  UploadProps,
  UploadFile,
} from 'antd';
import { Product } from '../../../models/product.model';
import { useAllCategories } from '../../../queries/category.query';
import { PlusOutlined } from '@ant-design/icons';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../../../firebase/config';
import { Perfume } from '../../../models/perfume.model';
import { Textile } from '../../../models/textile.model';
import { Appliance } from '../../../models/appliance.model';
import { Category } from '../../../models/category.model';

interface ProductModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (
    values: Omit<Product | Perfume | Textile | Appliance, '_id'>
  ) => Promise<void>;
  initialData?: Product | Perfume | Textile | Appliance;
}

const ProductModal: React.FC<ProductModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialData,
}) => {
  const [form] = Form.useForm();
  const [imageUrls, setImageUrls] = React.useState<string[]>([]);
  const [uploading, setUploading] = React.useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const { data: categories, isPending } = useAllCategories();

  const [fileList, setFileList] = useState<UploadFile[]>([]);


  const mainCategories = categories?.filter((cat) => !cat.parentCategory) || [];

  useEffect(() => {
    if (visible && initialData) {
      const firstCategory = initialData.categories?.[0];
      form.setFieldsValue({
        ...initialData,
        category: firstCategory,
      });
      setImageUrls(initialData.images || []);
      if (firstCategory) {
        setSelectedCategory(firstCategory);
      }
    }
  }, [visible, initialData, form]);

  const handleChange: UploadProps['onChange'] = (info) => {
    setFileList(info.fileList);
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = (await getBase64(file.originFileObj as File)) as string;
    }

    const image = new Image();
    image.src = file.url ?? file.preview ?? '';
    const imgWindow = window.open(image.src);
    imgWindow?.document.write(image.outerHTML);
  };

  const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  
  const uploadButton = <div>+ Upload</div>;

  const handleUpload = async (file: File) => {
    try {
      setUploading(true);
      const storageRef = ref(storage, `products/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setImageUrls((prev) => [...prev, url]);
      const currentImages = form.getFieldValue('images') || [];
      form.setFieldsValue({ images: [...currentImages, url] });
      message.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      message.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const category = categories?.find((c) => c._id === values.category);

      if (!category) {
        message.error('Please select a valid category');
        return;
      }

      // Convert form values based on category type
      const productData = {
        ...values,
        categories: [values.category], // Only allow one main category
      };

      await onSubmit(productData);
      form.resetFields();
      setCurrentStep(0);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleNext = async () => {
    try {
      await form.validateFields([
        'name',
        'description',
        'category',
        'cost',
        'images',
        'isAvailable',
      ]);
      setCurrentStep(1);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleBack = () => {
    setCurrentStep(0);
  };

  const renderCategorySpecificFields = () => {
    const category = categories?.find(
      (c) => c._id === form.getFieldValue('category')
    );
    if (!category) return null;

    switch (category.name.toLowerCase()) {
      case 'perfumes':
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
              name="sizes"
              label="Volumes"
              rules={[
                { required: true, message: 'Please add at least one volume' },
              ]}
            >
              <Form.List name="sizes">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <div
                        key={key}
                        style={{ display: 'flex', marginBottom: 8, gap: 8 }}
                      >
                        <Form.Item
                          {...restField}
                          name={[name, 'size']}
                          rules={[
                            { required: true, message: 'Missing volume' },
                          ]}
                        >
                          <Input placeholder="Volume (ml)" />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, 'currency']}
                          rules={[
                            { required: true, message: 'Missing currency' },
                          ]}
                        >
                          <Input placeholder="Currency" />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, 'price']}
                          rules={[{ required: true, message: 'Missing price' }]}
                        >
                          <InputNumber placeholder="Price" min={0} />
                        </Form.Item>
                        <Button onClick={() => remove(name)} type="link" danger>
                          Delete
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Add Volume
                    </Button>
                  </>
                )}
              </Form.List>
            </Form.Item>
          </>
        );

      case 'textiles':
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
              rules={[
                { required: true, message: 'Please enter care instructions' },
              ]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item
              name="sizes"
              label="Sizes"
              rules={[
                { required: true, message: 'Please add at least one size' },
              ]}
            >
              <Form.List name="sizes">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <div
                        key={key}
                        style={{ display: 'flex', marginBottom: 8, gap: 8 }}
                      >
                        <Form.Item
                          {...restField}
                          name={[name, 'size']}
                          rules={[{ required: true, message: 'Missing size' }]}
                        >
                          <Input placeholder="Size (e.g., 3x4)" />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, 'currency']}
                          rules={[
                            { required: true, message: 'Missing currency' },
                          ]}
                        >
                          <Input placeholder="Currency" />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, 'price']}
                          rules={[{ required: true, message: 'Missing price' }]}
                        >
                          <InputNumber placeholder="Price" min={0} />
                        </Form.Item>
                        <Button onClick={() => remove(name)} type="link" danger>
                          Delete
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Add Size
                    </Button>
                  </>
                )}
              </Form.List>
            </Form.Item>
          </>
        );

      case 'appliances':
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
              label="Warrenty"
              rules={[{ required: true, message: 'Please enter warrenty' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="powerConsumption"
              label="Power Consumption"
              rules={[
                { required: true, message: 'Please enter Power Consumption' },
              ]}
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
              name="sizes"
              label="Sizes"
              rules={[
                { required: true, message: 'Please add at least one size' },
              ]}
            >
              <Form.List name="sizes">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <div
                        key={key}
                        style={{ display: 'flex', marginBottom: 8, gap: 8 }}
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
                          name={[name, 'currency']}
                          rules={[
                            { required: true, message: 'Missing currency' },
                          ]}
                        >
                          <Input placeholder="Currency" />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, 'price']}
                          rules={[{ required: true, message: 'Missing price' }]}
                        >
                          <InputNumber placeholder="Price" min={0} />
                        </Form.Item>
                        <Button onClick={() => remove(name)} type="link" danger>
                          Delete
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Add Size
                    </Button>
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
    <Modal
      title={initialData ? 'Edit Product' : 'Add Product'}
      open={visible}
      onCancel={onCancel}
      afterClose={() => {
        form.resetFields();
        setImageUrls([]);
        setCurrentStep(0);
        setSelectedCategory(null);
      }}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        currentStep === 0 ? (
          <Button key="next" type="primary" onClick={handleNext}>
            Next
          </Button>
        ) : (
          <>
            <Button key="back" onClick={handleBack}>
              Back
            </Button>
            <Button key="submit" type="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </>
        ),
      ]}
    >
      <Steps
        current={currentStep}
        items={[
          { title: 'General Product Info' },
          { title: 'Category-Specific Details' },
        ]}
      />

      <Form form={form} layout="vertical" initialValues={{ isAvailable: true }}>
        {currentStep === 0 ? (
          <>
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
              rules={[
                { required: true, message: 'Please enter product description' },
              ]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>

            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true, message: 'Please select a category' }]}
            >
              <Select
                placeholder="Select category"
                onChange={(value) => setSelectedCategory(value)}
              >
                {mainCategories.map((category) => (
                  <Select.Option key={category._id} value={category._id}>
                    {category.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="cost"
              label="Cost"
              rules={[
                { required: true, message: 'Please add at least one cost' },
              ]}
            >
              <Form.List name="cost">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <div
                        key={key}
                        style={{ display: 'flex', marginBottom: 8, gap: 8 }}
                      >
                        <Form.Item
                          {...restField}
                          name={[name, 'currency']}
                          rules={[
                            { required: true, message: 'Missing currency' },
                          ]}
                        >
                          <Input placeholder="Currency" />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, 'price']}
                          rules={[{ required: true, message: 'Missing price' }]}
                        >
                          <InputNumber placeholder="Price" min={0} />
                        </Form.Item>
                        <Button onClick={() => remove(name)} type="link" danger>
                          Delete
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Add Volume
                    </Button>
                  </>
                )}
              </Form.List>
            </Form.Item>

            <Form.Item
              name="images"
              label="Images"
              rules={[
                { required: true, message: 'Please upload at least one image' },
              ]}
            >
              <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={handleChange}
                onPreview={handlePreview}
              >
                {fileList.length >= 8 ? null : uploadButton}
              </Upload>
            </Form.Item>

            <Form.Item
              name="isAvailable"
              label="Available"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </>
        ) : (
          renderCategorySpecificFields()
        )}
      </Form>
    </Modal>
  );
};

export default ProductModal;
