// src/components/CategoryModal.tsx
import React, { useEffect } from "react";
import { Modal, Form } from "antd";
import { Category } from "../../../models/category.model";
import TextField from "../../../components/forms/components/TextField";
import TextAreaField from "../../../components/forms/components/TextAreaField";

type CategoryFormData = Omit<Category, "_id" | "__v" | "message">;

type Props = {
    visible: boolean;
    onClose: () => void;
    onSubmit: (category: CategoryFormData) => void;
    initialData?: Category | null;
};

const CategoryModal: React.FC<Props> = ({ visible, onClose, onSubmit, initialData }) => {
    const [form] = Form.useForm<CategoryFormData>();

    useEffect(() => {
        if (initialData) {
            form.setFieldsValue({
                name: initialData.name,
                parentCategory: initialData.parentCategory,
                attributes: initialData.attributes
            });
        } else {
            form.resetFields();
        }
    }, [initialData, form]);

    const handleFinish = (values: CategoryFormData) => {
        onSubmit(values);
        onClose();
    };

    return (
        <Modal
            open={visible}
            title={initialData ? "Edit Category" : "Add Category"}
            onCancel={onClose}
            onOk={() => form.submit()}
            okText="Save"
        >
            <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={{ parentCategory: null, attributes: [], description: '' }}>
                <TextField id="name" label="Name" required />
         
            </Form>
        </Modal>
    );
};

export default CategoryModal;
