import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from './ApperIcon';

const MainFeature = ({ activeModule, darkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [items, setItems] = useState([]);

  // Sample data for different modules
  const sampleData = {
    inventory: [
      { id: 1, name: 'Gaming Laptop RTX 4070', category: 'Laptops', price: 89999, stock: 15, threshold: 5 },
      { id: 2, name: 'Wireless Mouse', category: 'Accessories', price: 2999, stock: 3, threshold: 10 },
      { id: 3, name: 'Antivirus Software', category: 'Software', price: 4999, stock: 50, threshold: 20 },
      { id: 4, name: '27" Gaming Monitor', category: 'Accessories', price: 25999, stock: 8, threshold: 5 },
    ],
    service: [
      { id: 1, customer: 'John Doe', issue: 'Laptop Screen Repair', status: 'In Progress', technician: 'Mike Wilson', priority: 'High' },
      { id: 2, customer: 'Sarah Smith', issue: 'Software Installation', status: 'Pending', technician: 'Not Assigned', priority: 'Medium' },
      { id: 3, customer: 'Bob Johnson', issue: 'Hardware Upgrade', status: 'Completed', technician: 'Alex Chen', priority: 'Low' },
      { id: 4, customer: 'Emma Davis', issue: 'Virus Removal', status: 'In Progress', technician: 'Mike Wilson', priority: 'High' },
    ],
    billing: [
      { id: 1, customer: 'John Doe', amount: 15999, status: 'Paid', date: '2024-01-15', items: 2 },
      { id: 2, customer: 'Sarah Smith', amount: 89999, status: 'Unpaid', date: '2024-01-14', items: 1 },
      { id: 3, customer: 'Bob Johnson', amount: 7500, status: 'Partial', date: '2024-01-13', items: 3 },
      { id: 4, customer: 'Emma Davis', amount: 25999, status: 'Paid', date: '2024-01-12', items: 1 },
    ],
    customers: [
      { id: 1, name: 'John Doe', phone: '+91 98765 43210', email: 'john@email.com', totalSpent: 45999, lastVisit: '2024-01-15' },
      { id: 2, name: 'Sarah Smith', phone: '+91 87654 32109', email: 'sarah@email.com', totalSpent: 89999, lastVisit: '2024-01-14' },
      { id: 3, name: 'Bob Johnson', phone: '+91 76543 21098', email: 'bob@email.com', totalSpent: 12500, lastVisit: '2024-01-13' },
      { id: 4, name: 'Emma Davis', phone: '+91 65432 10987', email: 'emma@email.com', totalSpent: 33999, lastVisit: '2024-01-12' },
    ]
  };

  useEffect(() => {
    setItems(sampleData[activeModule] || []);
    setSearchTerm('');
  }, [activeModule]);

  const filteredItems = items.filter(item => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    
    switch (activeModule) {
      case 'inventory':
        return item.name.toLowerCase().includes(searchLower) || 
               item.category.toLowerCase().includes(searchLower);
      case 'service':
        return item.customer.toLowerCase().includes(searchLower) || 
               item.issue.toLowerCase().includes(searchLower) ||
               item.technician.toLowerCase().includes(searchLower);
      case 'billing':
        return item.customer.toLowerCase().includes(searchLower);
      case 'customers':
        return item.name.toLowerCase().includes(searchLower) || 
               item.email.toLowerCase().includes(searchLower) ||
               item.phone.includes(searchTerm);
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

  const handleDelete = (id) => {
    setItems(items.filter(item => item.id !== id));
    toast.success(`${activeModule.charAt(0).toUpperCase() + activeModule.slice(1)} item deleted successfully!`);
  };

  const handleSave = () => {
    if (selectedItem) {
      // Edit existing item
      setItems(items.map(item => item.id === selectedItem.id ? { ...formData } : item));
      toast.success(`${activeModule.charAt(0).toUpperCase() + activeModule.slice(1)} item updated successfully!`);
    } else {
      // Add new item
      const newItem = { ...formData, id: Date.now() };
      setItems([...items, newItem]);
      toast.success(`New ${activeModule} item added successfully!`);
    }
    setIsModalOpen(false);
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
          <tr key={item.id} className="bg-white dark:bg-surface-800 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors">
            <td className="px-3 md:px-6 py-4 whitespace-nowrap">
              <div className="text-sm font-medium text-surface-900 dark:text-surface-100">{item.name}</div>
              <div className="text-xs text-surface-500 dark:text-surface-400 md:hidden">{item.category}</div>
            </td>
            <td className="px-3 md:px-6 py-4 whitespace-nowrap hidden md:table-cell">
              <span className="text-sm text-surface-900 dark:text-surface-100">{item.category}</span>
            </td>
            <td className="px-3 md:px-6 py-4 whitespace-nowrap">
              <span className="text-sm font-medium text-surface-900 dark:text-surface-100">₹{item.price.toLocaleString()}</span>
            </td>
            <td className="px-3 md:px-6 py-4 whitespace-nowrap">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                item.stock <= item.threshold ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              }`}>
                {item.stock}
              </span>
            </td>
            <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm font-medium space-x-1 md:space-x-2">
              <button onClick={() => handleEdit(item)} className="text-primary hover:text-primary-dark">
                <ApperIcon name="Edit2" className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900">
                <ApperIcon name="Trash2" className="w-4 h-4" />
              </button>
            </td>
          </tr>
        );
      case 'service':
        return (
          <tr key={item.id} className="bg-white dark:bg-surface-800 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors">
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
              <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900">
                <ApperIcon name="Trash2" className="w-4 h-4" />
              </button>
            </td>
          </tr>
        );
      case 'billing':
        return (
          <tr key={item.id} className="bg-white dark:bg-surface-800 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors">
            <td className="px-3 md:px-6 py-4 whitespace-nowrap">
              <div className="text-sm font-medium text-surface-900 dark:text-surface-100">{item.customer}</div>
              <div className="text-xs text-surface-500 dark:text-surface-400 md:hidden">{item.date}</div>
            </td>
            <td className="px-3 md:px-6 py-4 whitespace-nowrap">
              <span className="text-sm font-medium text-surface-900 dark:text-surface-100">₹{item.amount.toLocaleString()}</span>
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
          <tr key={item.id} className="bg-white dark:bg-surface-800 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors">
            <td className="px-3 md:px-6 py-4 whitespace-nowrap">
              <div className="text-sm font-medium text-surface-900 dark:text-surface-100">{item.name}</div>
              <div className="text-xs text-surface-500 dark:text-surface-400 md:hidden">{item.phone}</div>
            </td>
            <td className="px-3 md:px-6 py-4 hidden md:table-cell">
              <div className="text-sm text-surface-900 dark:text-surface-100">{item.phone}</div>
              <div className="text-xs text-surface-500 dark:text-surface-400">{item.email}</div>
            </td>
            <td className="px-3 md:px-6 py-4 whitespace-nowrap">
              <span className="text-sm font-medium text-surface-900 dark:text-surface-100">₹{item.totalSpent.toLocaleString()}</span>
            </td>
            <td className="px-3 md:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
              <span className="text-sm text-surface-900 dark:text-surface-100">{item.lastVisit}</span>
            </td>
            <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm font-medium space-x-1 md:space-x-2">
              <button onClick={() => handleEdit(item)} className="text-primary hover:text-primary-dark">
                <ApperIcon name="Edit2" className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900">
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
        <table className="min-w-full divide-y divide-surface-200 dark:divide-surface-700">
          <thead>
            {renderTableHeaders()}
          </thead>
          <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
            {filteredItems.map(renderTableRow)}
          </tbody>
        </table>
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
                      value={formData.name || ''}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
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
                      value={formData.name || ''}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
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