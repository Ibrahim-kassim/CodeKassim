import { useState, useEffect } from 'react';
import { message } from 'antd';
import { Product } from '../../../models/product.model';
import api from '../../../AppServices/initApi';
import {
  useAllProducts,
  useCreateProduct,
  useDeleteProduct,
  useUpdateProduct,
} from '../../../queries/products.query';
import { TableRowSelection } from 'antd/es/table/interface';
import { Category } from '../../../models/category.model';

export function useProductActions() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const {
    data: Products,
    isPending: isLoadingCategories,
    refetch: refetchCategories,
  } = useAllProducts();
  const { mutateAsync: createProduct, isPending: isCreating } =
    useCreateProduct();
  const { mutateAsync: updateProduct, isPending: isUpdating } =
    useUpdateProduct();
  const { mutateAsync: deleteProduct, isPending: isDeleting } =
    useDeleteProduct();

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await api.getProducts();
      setProducts((response || []) as Product[]);
    } catch (error) {
      console.error('Error fetching products:', error);
      message.error('Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAdd = () => {
    setSelectedProduct(undefined);
    setModalVisible(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    if (!id) return;
    try {
      await api.deleteProduct({ productId: id });
      message.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      message.error('Failed to delete product');
    }
  };

  const handleSubmit = async (values: Omit<Product, '_id'>) => {
    try {
      if (selectedProduct?._id) {
        await api.updateProduct({
          ...values,
          _id: selectedProduct._id,
        });
        message.success('Product updated successfully');
      } else {
        await api.createProduct(values);
        message.success('Product created successfully');
      }
      setModalVisible(false);
      fetchProducts();
    } catch (error) {
      console.error('Error submitting product:', error);
      message.error('Failed to submit product');
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(
        selectedRowKeys
          .map((key) => key.toString())
          .filter((id): id is string => id !== undefined)
          .map((id) => deleteProduct({ productId: id }))
      );
      setSelectedRowKeys([]);
      fetchProducts();
    } catch (error) {
      console.error('Error bulk deleting products:', error);
      message.error('Failed to delete products');
    }
  };

  const rowSelection: TableRowSelection<Product> = {
    selectedRowKeys,
    onChange: (selectedKeys: React.Key[]) => {
      setSelectedRowKeys(selectedKeys);
    },
  };

  return {
    selectedProduct,
    modalVisible,
    selectedProducts,
    setModalVisible,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleBulkDelete,
    isLoading,
    products,
    selectedRowKeys,
    rowSelection,
  };
}
