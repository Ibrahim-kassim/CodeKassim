import React, { useState } from "react";
import { MenuOutlined, CloseOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import NavMenu from "./NavMenu";
import { motion, AnimatePresence } from "framer-motion";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Search } from "../../generalComponents";
import Logo from "../Logo/Logo";
import CartDrawer from "../Cart/CartDrawer";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    return (
        <header className="sticky top-0 z-50 bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Logo />

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center flex-1 justify-between ml-8">
                        <NavMenu 
                            activeCategory={activeCategory}
                            setActiveCategory={setActiveCategory}
                        />
                        <div className="flex items-center space-x-6">
                            <div className="w-72">
                                <Search
                                    placeholder="Search..."
                                    onChange={() => {}}
                                />
                            </div>
                            <button
                                onClick={() => setCartOpen(true)}
                                className="p-2 hover:text-red-500"
                            >
                                <ShoppingCartOutlined className="text-2xl" />
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="md:hidden flex items-center space-x-4">
                        <button
                            onClick={() => setCartOpen(true)}
                            className="p-2 hover:text-red-500"
                        >
                            <ShoppingCartOutlined className="text-2xl" />
                        </button>
                        <button
                            className="text-2xl text-red-600"
                            onClick={() => setMenuOpen(!menuOpen)}
                            aria-label="Toggle menu"
                        >
                            {menuOpen ? <CloseOutlined /> : <MenuOutlined />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.nav
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "spring", stiffness: 250, damping: 25 }}
                        className="fixed top-0 left-0 w-full h-full bg-white z-40 flex flex-col p-6 overflow-y-auto"
                    >
                        <div className="w-full">
                            {/* Mobile Top Bar */}
                            <div className="flex justify-between items-center mb-8">
                                <Logo />
                                <button
                                    onClick={() => setMenuOpen(false)}
                                    className="text-2xl text-red-600"
                                >
                                    <CloseOutlined />
                                </button>
                            </div>

                            {/* Mobile Search */}
                            <div className="mb-6">
                                <Search placeholder="Search..." onChange={() => {}} />
                            </div>

                            {/* Mobile Nav Menu */}
                            <NavMenu 
                                onItemClick={() => setMenuOpen(false)}
                                activeCategory={activeCategory}
                                setActiveCategory={setActiveCategory}
                            />
                        </div>
                    </motion.nav>
                )}
            </AnimatePresence>

            {/* Cart Drawer */}
            <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
        </header>
    );
};

export default Navbar;