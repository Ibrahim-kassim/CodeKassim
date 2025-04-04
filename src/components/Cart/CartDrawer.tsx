import React from 'react';
import { CloseOutlined, ShoppingOutlined } from '@ant-design/icons';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />
      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-96 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold">Shopping Cart</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <CloseOutlined className="text-lg" />
            </button>
          </div>

          {/* Empty Cart Content */}
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="w-32 h-32 mb-6 text-gray-300">
              <ShoppingOutlined style={{ fontSize: '128px' }} />
            </div>
            <p className="text-gray-500 text-center">Your cart is empty</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
