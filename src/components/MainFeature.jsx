import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import ApperIcon from './ApperIcon';
import { inventoryService } from '../services/api/inventoryService';
import { serviceService } from '../services/api/serviceService';
import { billingService } from '../services/api/billingService';
import { customersService } from '../services/api/customersService';

const MainFeature = ({ activeModule, darkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Get authentication status
  const { isAuthenticated } = useSelector((state) => state.user);

  // Service mapping
  const services = {
    inventory: inventoryService,
    service: serviceService,
    billing: billingService,
    customers: customersService
  };

  useEffect(() => {
    if (isAuthenticated && activeModule) {
      loadData();
    }
    setSearchTerm('');
  }, [activeModule, isAuthenticated]);

  const loadData = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    try {
      const service = services[activeModule];
      if (service) {
        const data = await service.getAll();
        setItems(data || []);
      }
    } catch (err) {
      setError(err.message);
      setItems([]);
      console.error(`Error loading ${activeModule} data:`, err);
    } finally {
      setLoading(false);
    }
  };

const filteredItems = items.filter(item => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    
    switch (activeModule) {
      case 'inventory':
        return (item.Name || '').toLowerCase().includes(searchLower) || 
               (item.category || '').toLowerCase().includes(searchLower);
      case 'service':
        return (item.customer || '').toLowerCase().includes(searchLower) || 
               (item.issue || '').toLowerCase().includes(searchLower) ||
               (item.technician || '').toLowerCase().includes(searchLower);
      case 'billing':
        return (item.customer || '').toLowerCase().includes(searchLower);
      case 'customers':
        return (item.Name || '').toLowerCase().includes(searchLower) || 
               (item.email || '').toLowerCase().includes(searchLower) ||
               (item.phone || '').includes(searchTerm);
      default:
        return true;
    }
  });

  const handleAdd = () => {
    setSelectedItem(null);
    setFormData({});
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormData(item);
    setIsModalOpen(true);
  };

const handleDelete = async (id) => {
    if (!isAuthenticated) return;
    
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      const service = services[activeModule];
      if (service) {
        await service.delete(id);
        setItems(items.filter(item => item.Id !== id));
      }
    } catch (error) {
      console.error(`Error deleting ${activeModule} item:`, error);
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      const service = services[activeModule];
      if (!service) return;
      
      if (selectedItem) {
        // Edit existing item
        const updatedItem = await service.update(selectedItem.Id, formData);
        if (updatedItem) {
          setItems(items.map(item => item.Id === selectedItem.Id ? updatedItem : item));
        }
      } else {
        // Add new item
        const newItem = await service.create(formData);
        if (newItem) {
          setItems([...items, newItem]);
        }
      }
      setIsModalOpen(false);
      setFormData({});
    } catch (error) {
      console.error(`Error saving ${activeModule} item:`, error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'unpaid': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'partial': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'in progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'pending': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-surface-100 text-surface-800 dark:bg-surface-700 dark:text-surface-200';
    }
  };

  const renderTableHeaders = () => {
    switch (activeModule) {
      case 'inventory':
        return (
          <tr className="bg-surface-50 dark:bg-surface-800">
            <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Product</th>
            <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider hidden md:table-cell">Category</th>
            <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Price</th>
            <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Stock</th>
            <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Actions</th>
          </tr>
        );
      case 'service':
        return (
          <tr className="bg-surface-50 dark:bg-surface-800">
            <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Customer</th>
            <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider hidden lg:table-cell">Issue</th>
            <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Status</th>
            <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider hidden md:table-cell">Priority</th>
            <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Actions</th>
          </tr>
        );
      case 'billing':
        return (
          <tr className="bg-surface-50 dark:bg-surface-800">
            <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Customer</th>
            <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Amount</th>
            <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider hidden md:table-cell">Date</th>
            <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Status</th>
            <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Actions</th>
          </tr>
        );
      case 'customers':
        return (
          <tr className="bg-surface-50 dark:bg-surface-800">
            <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Name</th>
            <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider hidden md:table-cell">Contact</th>
            <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Total Spent</th>
            <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider hidden lg:table-cell">Last Visit</th>
            <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Actions</th>
          </tr>
        );
      default:
        return null;
    }
  };

  const renderTableRow = (item) => {
    switch (activeModule) {
      case 'inventory':
        return (
<tr key={item.Id} className="bg-white dark:bg-surface-800 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors">
            <td className="px-3 md:px-6 py-4 whitespace-nowrap">
              <div className="text-sm font-medium text-surface-900 dark:text-surface-100">{item.Name}</div>
              <div className="text-xs text-surface-500 dark:text-surface-400 md:hidden">{item.category}</div>
            </td>
            <td className="px-3 md:px-6 py-4 whitespace-nowrap hidden md:table-cell">
              <span className="text-sm text-surface-900 dark:text-surface-100">{item.category}</span>
            </td>
            <td className="px-3 md:px-6 py-4 whitespace-nowrap">
              <span className="text-sm font-medium text-surface-900 dark:text-surface-100">₹{(item.price || 0).toLocaleString()}</span>
            </td>
            <td className="px-3 md:px-6 py-4 whitespace-nowrap">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                (item.stock || 0) <= (item.threshold || 0) ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              }`}>
                {item.stock}
              </span>
            </td>
            <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm font-medium space-x-1 md:space-x-2">
              <button onClick={() => handleEdit(item)} className="text-primary hover:text-primary-dark">
                <ApperIcon name="Edit2" className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(item.Id)} className="text-red-600 hover:text-red-900">
                <ApperIcon name="Trash2" className="w-4 h-4" />
              </button>
            </td>
          </tr>
        );
      case 'service':
return (
          <tr key={item.Id} className="bg-white dark:bg-surface-800 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors">
            <td className="px-3 md:px-6 py-4 whitespace-nowrap">
              <div className="text-sm font-medium text-surface-900 dark:text-surface-100">{item.customer}</div>
              <div className="text-xs text-surface-500 dark:text-surface-400 lg:hidden">{item.issue}</div>
            </td>
            <td className="px-3 md:px-6 py-4 hidden lg:table-cell">
              <span className="text-sm text-surface-900 dark:text-surface-100">{item.issue}</span>
            </td>
            <td className="px-3 md:px-6 py-4 whitespace-nowrap">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                {item.status}
              </span>
            </td>
            <td className="px-3 md:px-6 py-4 whitespace-nowrap hidden md:table-cell">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.priority)}`}>
                {item.priority}
              </span>
            </td>
            <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm font-medium space-x-1 md:space-x-2">
              <button onClick={() => handleEdit(item)} className="text-primary hover:text-primary-dark">
                <ApperIcon name="Edit2" className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(item.Id)} className="text-red-600 hover:text-red-900">
                <ApperIcon name="Trash2" className="w-4 h-4" />
              </button>
            </td>
          </tr>
        );
      case 'billing':
return (
          <tr key={item.Id} className="bg-white dark:bg-surface-800 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors">
            <td className="px-3 md:px-6 py-4 whitespace-nowrap">
              <div className="text-sm font-medium text-surface-900 dark:text-surface-100">{item.customer}</div>
              <div className="text-xs text-surface-500 dark:text-surface-400 md:hidden">{item.date}</div>
            </td>
            <td className="px-3 md:px-6 py-4 whitespace-nowrap">
              <span className="text-sm font-medium text-surface-900 dark:text-surface-100">₹{(item.amount || 0).toLocaleString()}</span>
            </td>
            <td className="px-3 md:px-6 py-4 whitespace-nowrap hidden md:table-cell">
              <span className="text-sm text-surface-900 dark:text-surface-100">{item.date}</span>
            </td>
            <td className="px-3 md:px-6 py-4 whitespace-nowrap">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                {item.status}
              </span>
            </td>
            <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm font-medium space-x-1 md:space-x-2">
              <button onClick={() => toast.success("Invoice downloaded!")} className="text-green-600 hover:text-green-900">
                <ApperIcon name="Download" className="w-4 h-4" />
              </button>
              <button onClick={() => handleEdit(item)} className="text-primary hover:text-primary-dark">
                <ApperIcon name="Edit2" className="w-4 h-4" />
              </button>
            </td>
          </tr>
        );
      case 'customers':
return (
          <tr key={item.Id} className="bg-white dark:bg-surface-800 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors">
            <td className="px-3 md:px-6 py-4 whitespace-nowrap">
              <div className="text-sm font-medium text-surface-900 dark:text-surface-100">{item.Name}</div>
              <div className="text-xs text-surface-500 dark:text-surface-400 md:hidden">{item.phone}</div>
            </td>
            <td className="px-3 md:px-6 py-4 hidden md:table-cell">
              <div className="text-sm text-surface-900 dark:text-surface-100">{item.phone}</div>
              <div className="text-xs text-surface-500 dark:text-surface-400">{item.email}</div>
            </td>
            <td className="px-3 md:px-6 py-4 whitespace-nowrap">
              <span className="text-sm font-medium text-surface-900 dark:text-surface-100">₹{(item.total_spent || 0).toLocaleString()}</span>
            </td>
            <td className="px-3 md:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
              <span className="text-sm text-surface-900 dark:text-surface-100">{item.last_visit}</span>
            </td>
            <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm font-medium space-x-1 md:space-x-2">
              <button onClick={() => handleEdit(item)} className="text-primary hover:text-primary-dark">
                <ApperIcon name="Edit2" className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(item.Id)} className="text-red-600 hover:text-red-900">
                <ApperIcon name="Trash2" className="w-4 h-4" />
              </button>
            </td>
          </tr>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      key={activeModule}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-lg rounded-2xl border border-surface-200 dark:border-surface-700 neu-shadow"
    >
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-surface-200 dark:border-surface-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <h2 className="text-xl md:text-2xl font-bold text-surface-900 dark:text-surface-100 capitalize">
            {activeModule} Management
          </h2>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <div className="relative">
              <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-surface-400" />
              <input
                type="text"
                placeholder={`Search ${activeModule}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full sm:w-64 border border-surface-300 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-100 focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAdd}
              className="flex items-center space-x-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl transition-colors"
            >
              <ApperIcon name="Plus" className="w-4 h-4" />
              <span className="hidden sm:inline">Add New</span>
              <span className="sm:hidden">Add</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Table */}
<div className="overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-lg text-surface-600 dark:text-surface-400">Loading...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-lg text-red-600 dark:text-red-400">Error: {error}</div>
          </div>
        ) : !isAuthenticated ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-lg text-surface-600 dark:text-surface-400">Please log in to view data</div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-lg text-surface-600 dark:text-surface-400">No {activeModule} records found</div>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-surface-200 dark:divide-surface-700">
            <thead>
              {renderTableHeaders()}
            </thead>
            <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
              {filteredItems.map(renderTableRow)}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-surface-800 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-surface-900 dark:text-surface-100">
                  {selectedItem ? 'Edit' : 'Add'} {activeModule.charAt(0).toUpperCase() + activeModule.slice(1)}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-surface-400 hover:text-surface-600 dark:hover:text-surface-300"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {activeModule === 'inventory' && (
                  <>
<input
                      type="text"
                      placeholder="Product Name"
                      value={formData.Name || ''}
                      onChange={(e) => setFormData({...formData, Name: e.target.value})}
                      className="w-full px-4 py-2 border border-surface-300 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-100"
                    />
                    <select
                      value={formData.category || ''}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-4 py-2 border border-surface-300 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-100"
                    >
                      <option value="">Select Category</option>
                      <option value="Laptops">Laptops</option>
                      <option value="Accessories">Accessories</option>
                      <option value="Software">Software</option>
                    </select>
                    <input
                      type="number"
                      placeholder="Price"
                      value={formData.price || ''}
                      onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                      className="w-full px-4 py-2 border border-surface-300 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-100"
                    />
                    <input
                      type="number"
                      placeholder="Stock Quantity"
                      value={formData.stock || ''}
                      onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})}
                      className="w-full px-4 py-2 border border-surface-300 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-100"
                    />
                    <input
                      type="number"
                      placeholder="Low Stock Threshold"
                      value={formData.threshold || ''}
                      onChange={(e) => setFormData({...formData, threshold: Number(e.target.value)})}
                      className="w-full px-4 py-2 border border-surface-300 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-100"
                    />
                  </>
                )}

                {activeModule === 'service' && (
                  <>
                    <input
                      type="text"
                      placeholder="Customer Name"
                      value={formData.customer || ''}
                      onChange={(e) => setFormData({...formData, customer: e.target.value})}
                      className="w-full px-4 py-2 border border-surface-300 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-100"
                    />
                    <input
                      type="text"
                      placeholder="Issue Description"
                      value={formData.issue || ''}
                      onChange={(e) => setFormData({...formData, issue: e.target.value})}
                      className="w-full px-4 py-2 border border-surface-300 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-100"
                    />
                    <select
                      value={formData.status || ''}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full px-4 py-2 border border-surface-300 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-100"
                    >
                      <option value="">Select Status</option>
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                    <select
                      value={formData.priority || ''}
                      onChange={(e) => setFormData({...formData, priority: e.target.value})}
                      className="w-full px-4 py-2 border border-surface-300 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-100"
                    >
                      <option value="">Select Priority</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </>
                )}

                {activeModule === 'customers' && (
                  <>
<input
                      type="text"
                      placeholder="Customer Name"
                      value={formData.Name || ''}
                      onChange={(e) => setFormData({...formData, Name: e.target.value})}
                      className="w-full px-4 py-2 border border-surface-300 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-100"
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={formData.phone || ''}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-2 border border-surface-300 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-100"
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={formData.email || ''}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-2 border border-surface-300 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-100"
                    />
                  </>
                )}
              </div>

              <div className="flex space-x-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                  className="flex-1 bg-primary hover:bg-primary-dark text-white py-2 rounded-xl transition-colors"
                >
                  {selectedItem ? 'Update' : 'Add'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-surface-200 dark:bg-surface-600 hover:bg-surface-300 dark:hover:bg-surface-500 text-surface-900 dark:text-surface-100 py-2 rounded-xl transition-colors"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MainFeature;