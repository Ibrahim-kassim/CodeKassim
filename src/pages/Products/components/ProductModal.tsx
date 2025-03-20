import React, { useEffect } from "react";
import { Modal, Form, Input, Select, InputNumber, Upload, message, Button, Switch } from "antd";
import { Product } from "../../../models/product.model";
import { useCategories } from "../../../hooks/useCategories";
import { PlusOutlined } from "@ant-design/icons";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../../firebase/config";

interface ProductModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: Omit<Product, "_id">) => Promise<void>;
  initialData?: Product;
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
  const { categories } = useCategories();

  useEffect(() => {
    if (visible && initialData) {
      form.setFieldsValue({
        ...initialData,
        categories: initialData.categories,
      });
      setImageUrls(initialData.images || []);
    } else if (!visible) {
      form.resetFields();
      setImageUrls([]);
    }
  }, [visible, initialData, form]);

  const handleUpload = async (file: File) => {
    try {
      setUploading(true);
      const storageRef = ref(storage, `products/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setImageUrls(prev => [...prev, url]);
      const currentImages = form.getFieldValue('images') || [];
      form.setFieldsValue({ images: [...currentImages, url] });
      message.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      message.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values);
      form.resetFields();
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  return (
    <Modal
      title={initialData ? "Edit Product" : "Add Product"}
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      confirmLoading={uploading}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ isAvailable: true }}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please enter product name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please enter product description" }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          name="categories"
          label="Categories"
          rules={[{ required: true, message: "Please select at least one category" }]}
        >
          <Select mode="multiple" placeholder="Select categories">
            {categories?.map(category => (
              <Select.Option key={category._id} value={category._id}>
                {category.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="prices"
          label="Prices"
          rules={[{ required: true, message: "Please add at least one price" }]}
        >
          <Form.List name="prices">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} style={{ display: 'flex', marginBottom: 8, gap: 8 }}>
                    <Form.Item
                      {...restField}
                      name={[name, 'size']}
                      rules={[{ required: true, message: 'Missing size' }]}
                    >
                      <Input placeholder="Size" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'color']}
                      rules={[{ required: true, message: 'Missing color' }]}
                    >
                      <Input placeholder="Color" />
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
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Add Price
                </Button>
              </>
            )}
          </Form.List>
        </Form.Item>

        <Form.Item
          name="images"
          label="Images"
          rules={[{ required: true, message: "Please upload at least one image" }]}
        >
          <Upload
            listType="picture-card"
            showUploadList={true}
            beforeUpload={(file) => {
              handleUpload(file);
              return false;
            }}
            fileList={imageUrls.map((url, index) => ({
              uid: `-${index}`,
              name: `image-${index}`,
              status: 'done',
              url,
            }))}
          >
            {imageUrls.length >= 8 ? null : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <Form.Item
          name="isAvailable"
          valuePropName="checked"
          label="Available"
        >
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProductModal;