import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ProductsMenu from "./ProductsMenu";
import MobileProductMenu from "./MobileProductMenu";
import { useAllCategories } from "../../queries/category.query";

const NavMenu = ({ onItemClick, activeCategory, setActiveCategory }: { onItemClick?: () => void, activeCategory: string | null, setActiveCategory: (category: string | null) => void }) => {
  const [showProductsMenu, setShowProductsMenu] = useState(false);
  const [isMenuLocked, setIsMenuLocked] = useState(false);
  const token = localStorage.getItem("token");
  const isMobile = window.innerWidth < 768;
  const { data: categories = [] } = useAllCategories();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate(ROUTES.HOME);
  };

  const toggleProductsMenu = () => {
    if (showProductsMenu) {
      setShowProductsMenu(false);
      setIsMenuLocked(false);
      setActiveCategory(null);
    } else {
      setShowProductsMenu(true);
      setIsMenuLocked(true);
    }
  };

  const handleMouseEnter = () => {
    if (!isMenuLocked) {
      setShowProductsMenu(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMenuLocked) {
      setShowProductsMenu(false);
      setActiveCategory(null);
    }
  };

  return (
    <nav>
      <ul className="flex flex-col md:flex-row items-center">
        <li className="relative group">
          <NavLink
            to={ROUTES.HOME}
            onClick={onItemClick}
            className={({ isActive }) =>
              `block px-4 py-2 text-base font-medium ${
                isActive ? "text-red-500" : "text-gray-700 hover:text-red-500"
              }`
            }
          >
            Home
          </NavLink>
        </li>
        <li 
          className="relative group"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button
            className={`block px-4 py-2 text-base font-medium ${
              showProductsMenu ? "text-red-500" : "text-gray-700 hover:text-red-500"
            }`}
            onClick={toggleProductsMenu}
          >
            Categories
          </button>
          {showProductsMenu && (
            <div className="absolute left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
              <ProductsMenu 
                categories={categories} 
                onClose={() => {
                  if (!isMenuLocked) {
                    setShowProductsMenu(false);
                    setActiveCategory(null);
                  }
                }}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
              />
            </div>
          )}
        </li>
        <li className="relative group">
          <NavLink
            to={ROUTES.ABOUT}
            onClick={onItemClick}
            className={({ isActive }) =>
              `block px-4 py-2 text-base font-medium ${
                isActive ? "text-red-500" : "text-gray-700 hover:text-red-500"
              }`
            }
          >
            About Us
          </NavLink>
        </li>
        <li className="relative group">
          <NavLink
            to={ROUTES.CONTACT}
            onClick={onItemClick}
            className={({ isActive }) =>
              `block px-4 py-2 text-base font-medium ${
                isActive ? "text-red-500" : "text-gray-700 hover:text-red-500"
              }`
            }
          >
            Contact Us
          </NavLink>
        </li>
        {token && (
          <li className="relative group">
            <button
              onClick={handleLogout}
              className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-red-500"
            >
              Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default NavMenu;