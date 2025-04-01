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
  Space,
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
  const [selectedCategories, setSelectedCategories] = useState<any[]>([]);
  const { data: categories, isPending } = useAllCategories();

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const mainCategories = categories?.filter((cat) => !cat.parentCategory) || [];

  useEffect(() => {
    if (visible && initialData) {
      const categoryId = initialData.categories?.[0]?._id;
      
      // Set all form values including category-specific fields
      const formValues: any = {
        name: initialData.name,
        description: initialData.description,
        categories: categoryId,
        cost: initialData.cost,
        images: initialData.images,
        isAvailable: initialData.isAvailable,
        specifications: initialData.specifications,
      };

      // If it's a perfume, set the specific fields
      if (categoryId === '67c86bfeeee50cc264f911f8') {
        const perfumeData = initialData as Perfume;
        if ('brand' in initialData && 'scent' in initialData && 'gender' in initialData && 'sizes' in initialData) {
          formValues.brand = perfumeData.brand;
          formValues.scent = perfumeData.scent;
          formValues.gender = perfumeData.gender;
          formValues.sizes = perfumeData.sizes;
        }
      }

      // Set form values
      form.setFieldsValue(formValues);

      // Set images in fileList for display with correct typing
      const initialFileList: UploadFile[] = (initialData.images || []).map((url, index) => ({
        uid: `-${index}`,
        name: `image-${index}`,
        status: 'done' as const,
        url: url,
        type: 'image/jpeg',
      }));
      setFileList(initialFileList);
      setImageUrls(initialData.images || []);
      setSelectedCategories([categoryId]); // Set the category ID for the second section
    } else {
      // Reset form when modal is opened for creation
      form.resetFields();
      setFileList([]);
      setImageUrls([]);
      setSelectedCategories([]);
    }
  }, [visible, initialData, form]);

  const handleChange: UploadProps['onChange'] = (info) => {
    setFileList(info.fileList);
    const urls = info.fileList.map(file => file.url || file.response?.url).filter(url => url);
    form.setFieldsValue({ images: urls });
  };

  const handlePreview = async (file: UploadFile) => {
    let previewURL = file.url || file.preview;
    
    if (!previewURL && file.originFileObj) {
      previewURL = await getBase64(file.originFileObj);
    }

    // Open preview in new window
    const image = new Image();
    image.src = previewURL as string;
    const imgWindow = window.open('');
    if (imgWindow) {
      imgWindow.document.write('<html><body style="margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f0f0f0;">');
      imgWindow.document.write('<img src="' + previewURL + '" style="max-width: 100%; max-height: 100vh; object-fit: contain;">');
      imgWindow.document.write('</body></html>');
      imgWindow.document.close();
    }
  };

  const handleRemove = (file: UploadFile) => {
    const newFileList = fileList.filter((item) => item.uid !== file.uid);
    setFileList(newFileList);

    const fileUrl = file.url || file.response?.url;
    if (fileUrl) {
      const newImageUrls = imageUrls.filter((url) => url !== fileUrl);
      setImageUrls(newImageUrls);
      form.setFieldsValue({ images: newImageUrls });
    }
    return true;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl); // Clean up memory
    setSelectedImage(null);
    setPreviewUrl(null);
  };

  const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

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
      
      if (!values.categories) {
        message.error('Please select a valid category');
        return;
      }

      await onSubmit(values);
      form.resetFields();
      setCurrentStep(0);
      onCancel();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleNext = async () => {
    try {
      await form.validateFields([
        'name',
        'description',
        'categories',
        'cost',
        'images',
        'isAvailable',
      ]);
      
      // Store current form values before moving to next step
      const currentValues = form.getFieldsValue();
      setCurrentStep(1);
      
      // Re-set form values after step change to preserve data
      setTimeout(() => {
        form.setFieldsValue(currentValues);
      }, 0);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleBack = () => {
    // Store current form values before moving back
    const currentValues = form.getFieldsValue();
    setCurrentStep(0);
    
    // Re-set form values after step change to preserve data
    setTimeout(() => {
      form.setFieldsValue(currentValues);
    }, 0);
  };

  const renderCategorySpecificFields = () => {
    if (!selectedCategories?.[0]) return null;

    switch (selectedCategories[0]) {
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
                      <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
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
        setSelectedCategories([]);
        setFileList([]);
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
        <div style={{ display: currentStep === 0 ? 'block' : 'none' }}>
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
              name="categories"
              label="Category"
              rules={[{ required: true, message: 'Please select a category' }]}
            >
              <Select
                loading={isPending}
                onChange={(value) => {
                  setSelectedCategories([value]); // Update selectedCategories when selection changes
                  form.setFieldsValue({ categories: value }); // Keep form in sync
                }}
                style={{ width: '100%' }}
                placeholder="Select category"
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
                          name={[name, 'cost']}
                          rules={[{ required: true, message: 'Missing price' }]}
                        >
                          <InputNumber placeholder="Cost" min={0} />
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
              valuePropName="fileList"
              getValueFromEvent={(e) => {
                if (Array.isArray(e)) {
                  return e;
                }
                return e?.fileList;
              }}
            >
              <Upload
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                onRemove={handleRemove}
                customRequest={async ({ file, onSuccess }) => {
                  if (file instanceof File) {
                    try {
                      await handleUpload(file);
                      onSuccess?.("ok");
                    } catch (error) {
                      console.error('Upload failed:', error);
                    }
                  }
                }}
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
        </div>

        <div style={{ display: currentStep === 1 ? 'block' : 'none' }}>
          {renderCategorySpecificFields()}
        </div>
      </Form>
    </Modal>
  );
};

export default ProductModal;
