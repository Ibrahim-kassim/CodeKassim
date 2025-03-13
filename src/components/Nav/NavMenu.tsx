import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { LogoutOutlined, LoginOutlined } from "@ant-design/icons";
import { ROUTES } from "../../constants/routes";
import { productCategories } from "../../constants/categories";
import ProductsMenu from "./ProductsMenu";
import MobileProductMenu from "./MobileProductMenu";

const NavMenu = ({ onItemClick }: { onItemClick?: () => void }) => {
  const [showProductsMenu, setShowProductsMenu] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isMobile = window.innerWidth < 768;

  const handleLogout = () => {
    localStorage.removeItem("token");
    if (onItemClick) onItemClick();
    navigate(ROUTES.HOME);
  };

  const handleLogin = () => {
    if (onItemClick) onItemClick();
    navigate(ROUTES.Auth);
  };

  const toggleProductsMenu = () => {
    if (isMobile) {
      setShowProductsMenu(!showProductsMenu);
    }
  };

  return (
    <ul className="flex flex-col md:flex-row md:space-x-6 space-y-4 md:space-y-0 text-gray-800 font-medium">
      <li>
        <NavLink
          to={ROUTES.HOME}
          onClick={onItemClick}
          className={({ isActive }) =>
            `transition duration-200 text-lg px-2 py-1 rounded-md ${
              isActive ? "bg-red-500 text-white shadow-lg" : "hover:text-red-500"
            }`
          }
        >
          Home
        </NavLink>
      </li>
      <li className="md:relative">
        <div
          onMouseEnter={() => !isMobile && setShowProductsMenu(true)}
          onMouseLeave={() => !isMobile && setShowProductsMenu(false)}
        >
          <button
            onClick={toggleProductsMenu}
            className={`transition duration-200 text-lg px-2 py-1 rounded-md  text-left ${
              showProductsMenu ? "text-red-500" : "hover:text-red-500"
            }`}
          >
            Products
          </button>
          <AnimatePresence>
            {showProductsMenu && (
              <>
                {/* Desktop Menu */}
                <div className="hidden md:block absolute left-0 right-0 transform -translate-x-2">
                  <ProductsMenu categories={productCategories} />
                </div>
                {/* Mobile Menu */}
                <MobileProductMenu 
                  categories={productCategories}
                  onItemClick={onItemClick}
                />
              </>
            )}
          </AnimatePresence>
        </div>
      </li>
      <li>
        <NavLink
          to={ROUTES.CART}
          onClick={onItemClick}
          className={({ isActive }) =>
            `transition duration-200 text-lg px-2 py-1 rounded-md ${
              isActive ? "bg-red-500 text-white shadow-lg" : "hover:text-red-500"
            }`
          }
        >
          Cart
        </NavLink>
      </li>
      <li>
        <NavLink
          to={ROUTES.CHECKOUT}
          onClick={onItemClick}
          className={({ isActive }) =>
            `transition duration-200 text-lg px-2 py-1 rounded-md ${
              isActive ? "bg-red-500 text-white shadow-lg" : "hover:text-red-500"
            }`
          }
        >
          Checkout
        </NavLink>
      </li>
      <li>
        <NavLink
          to={ROUTES.CONTACT}
          onClick={onItemClick}
          className={({ isActive }) =>
            `transition duration-200 text-lg px-2 py-1 rounded-md ${
              isActive ? "bg-red-500 text-white shadow-lg" : "hover:text-red-500"
            }`
          }
        >
          Contact
        </NavLink>
      </li>
      <li>
        {token ? (
          <button
            onClick={handleLogout}
            className="flex items-center space-x-1 text-lg px-2 py-1 text-red-500 hover:text-red-600 transition duration-200"
          >
            <LogoutOutlined />
            <span>Logout</span>
          </button>
        ) : (
          <button
            onClick={handleLogin}
            className="flex items-center space-x-1 text-lg px-2 py-1 text-gray-800 hover:text-red-500 transition duration-200"
          >
            <LoginOutlined />
            <span>Login</span>
          </button>
        )}
      </li>
    </ul>
  );
};

export default NavMenu;