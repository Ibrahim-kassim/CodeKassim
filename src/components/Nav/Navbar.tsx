import React, { useState } from "react";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";
import NavMenu from "./NavMenu";
import { motion, AnimatePresence } from "framer-motion";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Search } from "../../generalComponents";
import Logo from "../Logo/Logo";
import SocialMedia from "../SocialMedia/SocialMedia";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 py-3">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Logo />

                    {/* Desktop Menu & Search */}
                    <div className="hidden md:flex items-center space-x-6">
                        <NavMenu />
                        <div className="w-52">
                            <Search placeholder="Type here..." onChange={() => { }} />
                        </div>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden text-2xl text-red-600"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                    >
                        {menuOpen ? <CloseOutlined /> : <MenuOutlined />}
                    </button>
                </div>
            </div>

            {/* Mobile Full-Screen Slide Menu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.nav
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "spring", stiffness: 250, damping: 25 }}
                        className="fixed top-0 left-0 w-full h-full bg-white z-40 flex flex-col justify-between p-6 overflow-y-auto"
                    >
                        <div className="w-full">
                            {/* Top Section: Logo & Close Button */}
                            <div className="w-full flex justify-between items-center mb-4">
                                <Logo />
                                <button
                                    className="text-3xl text-red-600"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    <CloseOutlined />
                                </button>
                            </div>

                            {/* Search Input */}
                            <div className="w-full mb-6">
                                <Search placeholder="Type here..." onChange={() => { }} />
                            </div>

                            {/* Navigation Menu */}
                            <NavMenu onItemClick={() => setMenuOpen(false)} />
                        </div>
                        <SocialMedia />
                    </motion.nav>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;