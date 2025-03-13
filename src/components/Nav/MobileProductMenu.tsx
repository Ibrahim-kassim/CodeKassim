import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";

interface Category {
  title: string;
  items: {
    name: string;
    path: string;
  }[];
}

interface MobileProductMenuProps {
  categories: Category[];
  onItemClick?: () => void;
}

const MobileProductMenu = ({ categories, onItemClick }: MobileProductMenuProps) => {
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
          {categories.map((category, index) => (
            <div key={index}>
              <h3 className="font-semibold text-base text-gray-800 mb-3 pb-1 border-b">
                {category.title}
              </h3>
              <div className="space-y-2">
                {category.items.map((item, itemIndex) => (
                  <NavLink
                    key={itemIndex}
                    to={item.path}
                    onClick={onItemClick}
                    className="block py-1.5 text-gray-600 hover:text-red-500"
                  >
                    {item.name}
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
