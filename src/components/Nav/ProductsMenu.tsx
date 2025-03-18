import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { RightOutlined } from "@ant-design/icons";
import { useState } from 'react';

interface Category {
  title: string;
  items: {
    name: string;
    path: string;
  }[];
}

interface ProductsMenuProps {
  categories?: Category[];
}

const ProductsMenu = ({ categories = [] }: ProductsMenuProps) => {
  // const [currentIndex, setCurrentIndex] = useState(0);

  // const visibleCategories = categories.slice(currentIndex, currentIndex + 2);

  // const handleNext = () => {
  //   if (currentIndex + 2 < categories.length) {
  //     setCurrentIndex((prev) => prev + 2);
  //   }
  // };

  // const handlePrev = () => {
  //   if (currentIndex > 0) {
  //     setCurrentIndex((prev) => prev - 2);
  //   }
  // };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute top-full left-0 max-w-[50vw] w-screen bg-white shadow-lg py-6 mt-1 z-50 border-t border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {categories.map((category, index) => (
            <div key={index} className="space-y-2 md:space-y-3">
              <h3 className="font-semibold text-base md:text-lg text-gray-800 mb-2 md:mb-3 pb-2 border-b border-gray-100 flex items-center justify-between">
                {category.title}
                <RightOutlined className="md:hidden text-xs text-gray-400" />
              </h3>
              <div className="grid grid-cols-1 gap-1">
                {category.items.map((item, itemIndex) => (
                  <NavLink
                    key={itemIndex}
                    to={item.path}
                    className="group flex items-center justify-between py-1.5 text-gray-600 hover:text-red-500 transition-colors"
                  >
                    <span>{item.name}</span>
                    <RightOutlined className="hidden md:block opacity-0 group-hover:opacity-100 text-xs transition-opacity" />
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductsMenu;
