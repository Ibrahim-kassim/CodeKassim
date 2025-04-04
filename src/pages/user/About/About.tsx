import React from 'react';
import { motion } from 'framer-motion';
import { ShopOutlined, TeamOutlined, TrophyOutlined, HeartOutlined } from '@ant-design/icons';

const About = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-red-500 to-red-600 text-white py-24">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Welcome to Online Souks</h1>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto">
              Your premier destination for quality products and exceptional shopping experience
            </p>
          </motion.div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We believe in creating a shopping experience that combines quality, convenience, and customer satisfaction.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <ShopOutlined className="text-4xl text-red-500" />,
                title: 'Quality Products',
                description: 'Carefully curated selection of premium products'
              },
              {
                icon: <TeamOutlined className="text-4xl text-red-500" />,
                title: 'Customer First',
                description: 'Dedicated to providing exceptional customer service'
              },
              {
                icon: <TrophyOutlined className="text-4xl text-red-500" />,
                title: 'Excellence',
                description: 'Committed to maintaining high standards'
              },
              {
                icon: <HeartOutlined className="text-4xl text-red-500" />,
                title: 'Community',
                description: 'Building lasting relationships with our customers'
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white p-8 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow"
              >
                {value.icon}
                <h3 className="text-xl font-semibold mt-4 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          >
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-gray-600 mb-6">
                Online Souks was founded with a vision to bring quality products directly to your doorstep. 
                We understand the value of your time and trust, which is why we've created a seamless 
                shopping experience that puts you first.
              </p>
              <p className="text-gray-600">
                Today, we continue to grow and evolve, always keeping our core values at heart: 
                quality, reliability, and customer satisfaction. We're not just a store; we're 
                your trusted partner in finding the perfect products for your needs.
              </p>
            </div>
            <div className="relative h-96 rounded-lg overflow-hidden shadow-xl">
              <img
                src="/store-image.jpg"
                alt="Our Store"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About;
