import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { Category } from "../../models/category.model";
import { useAllCategories } from "../../queries/category.query";

interface MobileProductMenuProps {
  onItemClick?: () => void;
}

const MobileProductMenu = ({ onItemClick }: MobileProductMenuProps) => {
  const { data: categories = [] } = useAllCategories();

  // Get main categories (those without parent)
  const mainCategories = categories.filter(cat => !cat.parentCategory);

  // Get subcategories for a main category
  const getSubCategories = (parentId: string) => {
    return categories
      .filter(cat => cat.parentCategory === parentId)
      .slice(0, 4); // Limit to 4 subcategories for mobile
  };

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="block md:hidden mt-2 bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden"
    >
      <div className="p-4">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8">
          {mainCategories.map((category) => (
            <div key={category._id}>
              <h3 className="font-semibold text-base text-gray-800 mb-3 pb-1 border-b">
                <NavLink 
                  to={`/products/${category._id}`}
                  className="hover:text-red-600 transition-colors"
                  onClick={onItemClick}
                >
                  {category.name}
                </NavLink>
              </h3>
              <div className="space-y-2">
                {getSubCategories(category._id || '').map((subCategory) => (
                  <NavLink
                    key={subCategory._id}
                    to={`/products/${subCategory._id}`}
                    className="block text-sm text-gray-600 hover:text-red-600 transition-colors py-1"
                    onClick={onItemClick}
                  >
                    {subCategory.name}
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

export default MobileProductMenu;
