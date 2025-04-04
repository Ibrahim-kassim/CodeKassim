import React from 'react';
import { Link } from 'react-router-dom';
import { useAllCategories } from '../../queries/category.query';

const Footer = () => {
  const { data: categories = [] } = useAllCategories();

  // Get main categories (those without parent)
  const mainCategories = categories.filter(cat => !cat.parentCategory);

  return (
    <footer className="bg-[#2B2B43] text-white py-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Online Souks */}
        <div>
          <h3 className="text-xl font-medium mb-4">Online Souks</h3>
          <p className="text-gray-300">Your one-stop shop for quality products</p>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-xl font-medium mb-4">Categories</h3>
          <ul className="space-y-2">
            {mainCategories.slice(0, 5).map((category) => (
              <li key={category._id}>
                <Link 
                  to={`/categories/${category._id}`}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-xl font-medium mb-4">Contact</h3>
          <ul className="space-y-2">
            <li className="text-gray-300">Online Shop</li>
            <li>
              <a 
                href="mailto:onlinesouks1@gmail.com" 
                className="text-gray-300 hover:text-white transition-colors"
              >
                onlinesouks1@gmail.com
              </a>
            </li>
            <li>
              <a 
                href="tel:8171041" 
                className="text-gray-300 hover:text-white transition-colors"
              >
                8171041
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-gray-700">
        <div className="text-center text-gray-400 text-sm">
          <p>Developed by HTW</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
