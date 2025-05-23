import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '../components/ApperIcon';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-blue-50 to-indigo-50 dark:from-surface-900 dark:via-surface-800 dark:to-surface-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center max-w-md mx-auto"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          className="mb-8"
        >
          <ApperIcon name="AlertTriangle" className="w-20 h-20 md:w-24 md:h-24 text-orange-500 mx-auto" />
        </motion.div>
        
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-6xl md:text-8xl font-bold text-surface-900 dark:text-surface-100 mb-4"
        >
          404
        </motion.h1>
        
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl md:text-2xl font-semibold text-surface-700 dark:text-surface-300 mb-4"
        >
          Page Not Found
        </motion.h2>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-surface-600 dark:text-surface-400 mb-8 text-sm md:text-base"
        >
          Sorry, the page you're looking for doesn't exist in TechFlow.
        </motion.p>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Link
            to="/"
            className="inline-flex items-center space-x-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl transition-colors shadow-lg hover:shadow-xl"
          >
            <ApperIcon name="ArrowLeft" className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;