import React from "react";
import { Link } from "react-router-dom";
import { Category } from "../../models/category.model";
import { RightOutlined } from "@ant-design/icons";

interface ProductsMenuProps {
  categories: Category[];
  onClose?: () => void;
  activeCategory: string | null;
  setActiveCategory: (id: string | null) => void;
}

const ProductsMenu = ({ categories, onClose, activeCategory, setActiveCategory }: ProductsMenuProps) => {
  // Get main categories (those without parent)
  const mainCategories = categories.filter(cat => !cat.parentCategory);

  // Get subcategories for a main category
  const getSubCategories = (parentId: string) => {
    return categories.filter(cat => cat.parentCategory === parentId);
  };

  // Check if a category has subcategories
  const hasSubCategories = (categoryId: string | undefined) => {
    return categories.some(cat => cat.parentCategory === categoryId);
  };

  const handleCategoryClick = () => {
    onClose?.();
  };

  return (
    <div className="relative">
      <div className="py-2 w-48">
        {mainCategories.map((category) => (
          <div
            key={category._id}
            className="relative group"
          >
            <Link
              to={`/categories/${category._id}`}
              className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-500"
              onClick={handleCategoryClick}
              onMouseEnter={() => category._id ? setActiveCategory(category._id) : null}
            >
              <span>{category.name}</span>
              {hasSubCategories(category._id) && (
                <RightOutlined className="text-xs" />
              )}
            </Link>
            {/* Subcategories dropdown */}
            {hasSubCategories(category._id) && activeCategory === category._id && (
              <div 
                className="absolute left-full top-0 w-48 bg-white border border-gray-200 rounded-md shadow-lg"
                onMouseLeave={() => setActiveCategory(null)}
              >
                <div className="py-2">
                  {getSubCategories(category._id).map((subCategory) => (
                    <Link
                      key={subCategory._id}
                      to={`/categories/${subCategory._id}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-500"
                      onClick={handleCategoryClick}
                    >
                      {subCategory.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsMenu;
