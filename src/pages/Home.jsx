import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MainFeature from '../components/MainFeature';
import ApperIcon from '../components/ApperIcon';

const Home = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [activeModule, setActiveModule] = useState('inventory');

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const modules = [
    {
      id: 'inventory',
      name: 'Inventory',
      icon: 'Package',
      description: 'Manage products, track stock levels, and set alerts',
      color: 'bg-gradient-to-br from-blue-500 to-blue-600'
    },
    {
      id: 'service',
      name: 'Service',
      icon: 'Wrench',
      description: 'Track repair requests and service tickets',
      color: 'bg-gradient-to-br from-green-500 to-green-600'
    },
    {
      id: 'billing',
      name: 'Billing',
      icon: 'Receipt',
      description: 'Generate invoices and manage payments',
      color: 'bg-gradient-to-br from-purple-500 to-purple-600'
    },
    {
      id: 'customers',
      name: 'Customers',
      icon: 'Users',
      description: 'Manage customer relationships and history',
      color: 'bg-gradient-to-br from-orange-500 to-orange-600'
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-lg border-b border-surface-200 dark:border-surface-700 sticky top-0 z-40"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center neu-shadow">
                <ApperIcon name="Zap" className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  TechFlow
                </h1>
                <p className="text-xs md:text-sm text-surface-600 dark:text-surface-400 hidden sm:block">
                  Computer Shop Management
                </p>
              </div>
            </motion.div>

            <div className="flex items-center space-x-2 md:space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleDarkMode}
                className="p-2 md:p-3 rounded-xl bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors neu-shadow"
              >
                <ApperIcon 
                  name={darkMode ? "Sun" : "Moon"} 
                  className="w-4 h-4 md:w-5 md:h-5 text-surface-700 dark:text-surface-300" 
                />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 md:p-3 rounded-xl bg-primary text-white hover:bg-primary-dark transition-colors neu-shadow"
              >
                <ApperIcon name="Settings" className="w-4 h-4 md:w-5 md:h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Navigation */}
      <motion.nav
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white/60 dark:bg-surface-800/60 backdrop-blur-lg border-b border-surface-200 dark:border-surface-700"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-2 md:space-x-4 py-3 md:py-4 overflow-x-auto scrollbar-hide">
            {modules.map((module) => (
              <motion.button
                key={module.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveModule(module.id)}
                className={`flex items-center space-x-2 md:space-x-3 px-4 md:px-6 py-2 md:py-3 rounded-xl transition-all whitespace-nowrap ${
                  activeModule === module.id
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600'
                }`}
              >
                <ApperIcon name={module.icon} className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-sm md:text-base font-medium">{module.name}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4 md:space-y-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-lg rounded-2xl p-4 md:p-6 border border-surface-200 dark:border-surface-700 neu-shadow"
            >
              <h3 className="text-lg md:text-xl font-semibold text-surface-900 dark:text-surface-100 mb-4">
                Quick Stats
              </h3>
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm md:text-base text-surface-600 dark:text-surface-400">Products</span>
                  <span className="font-semibold text-primary">1,234</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm md:text-base text-surface-600 dark:text-surface-400">Active Services</span>
                  <span className="font-semibold text-green-500">45</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm md:text-base text-surface-600 dark:text-surface-400">Pending Invoices</span>
                  <span className="font-semibold text-orange-500">12</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-lg rounded-2xl p-4 md:p-6 border border-surface-200 dark:border-surface-700 neu-shadow"
            >
              <h3 className="text-lg md:text-xl font-semibold text-surface-900 dark:text-surface-100 mb-4">
                Recent Activity
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-surface-600 dark:text-surface-400">Service completed</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-surface-600 dark:text-surface-400">New inventory added</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm text-surface-600 dark:text-surface-400">Invoice generated</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Main Feature Area */}
          <div className="lg:col-span-3">
            <MainFeature activeModule={activeModule} darkMode={darkMode} />
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Home;