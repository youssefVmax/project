import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, Save, Calendar, User, DollarSign, Package, MapPin, 
  Building, Phone, Mail, FileText, Star, AlertTriangle
} from 'lucide-react';
import { useDeals } from '../contexts/DealsContext';
import { useAuth } from '../contexts/AuthContext';
import { Deal } from '../types/deals';

export const DataEntry: React.FC = () => {
  const { addDeal } = useDeals();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    country: '',
    amount: '',
    commission: '',
    duration: '',
    product: '',
    serviceType: '',
    closingAgent: '',
    team: '',
    notes: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const dealData: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'> = {
        customerName: formData.customerName,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        amount: parseFloat(formData.amount),
        commission: parseFloat(formData.commission),
        duration: parseInt(formData.duration),
        product: formData.product,
        serviceType: formData.serviceType,
        salesAgent: user?.name || 'Unknown',
        closingAgent: formData.closingAgent,
        team: formData.team,
        status: 'pending',
        notes: formData.notes,
        priority: formData.priority
      };

      addDeal(dealData);

      // Reset form
      setFormData({
        customerName: '',
        email: '',
        phone: '',
        country: '',
        amount: '',
        commission: '',
        duration: '',
        product: '',
        serviceType: '',
        closingAgent: '',
        team: '',
        notes: '',
        priority: 'medium'
      });

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error adding deal:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formFields = [
    { 
      name: 'customerName', 
      label: 'Customer Name', 
      type: 'text', 
      icon: User, 
      required: true,
      placeholder: 'Enter customer full name'
    },
    { 
      name: 'email', 
      label: 'Email Address', 
      type: 'email', 
      icon: Mail, 
      required: true,
      placeholder: 'customer@example.com'
    },
    { 
      name: 'phone', 
      label: 'Phone Number', 
      type: 'tel', 
      icon: Phone, 
      required: true,
      placeholder: '+1 (555) 123-4567'
    },
    { 
      name: 'country', 
      label: 'Country', 
      type: 'select', 
      icon: MapPin, 
      required: true,
      options: ['United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Australia', 'Other']
    },
    { 
      name: 'amount', 
      label: 'Deal Amount ($)', 
      type: 'number', 
      icon: DollarSign, 
      required: true,
      placeholder: '0.00'
    },
    { 
      name: 'commission', 
      label: 'Commission ($)', 
      type: 'number', 
      icon: DollarSign, 
      required: false,
      placeholder: '0.00'
    },
    { 
      name: 'duration', 
      label: 'Duration (Months)', 
      type: 'number', 
      icon: Calendar, 
      required: true,
      placeholder: '12'
    },
    { 
      name: 'product', 
      label: 'Product Type', 
      type: 'select', 
      icon: Package, 
      required: true,
      options: ['VMax IPTV Premium', 'VMax IPTV Standard', 'SkyLive Pro', 'SkyLive Premium', 'SkyLive Standard', 'IBO Player', 'BOB Player', 'Smarters TV']
    },
    { 
      name: 'serviceType', 
      label: 'Service Tier', 
      type: 'select', 
      icon: Star, 
      required: true,
      options: ['Premium', 'Standard', 'Basic', 'Enterprise']
    },
    { 
      name: 'closingAgent', 
      label: 'Closing Agent', 
      type: 'text', 
      icon: User, 
      required: false,
      placeholder: 'Enter closing agent name'
    },
    { 
      name: 'team', 
      label: 'Sales Team', 
      type: 'select', 
      icon: Building, 
      required: true,
      options: ['Team Alpha', 'Team Beta', 'Team Gamma', 'Team Delta', 'Enterprise Team']
    }
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
          Create New Deal
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400">
          Add new sales data and track customer information
        </p>
        <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-slate-500">
          <User className="w-4 h-4" />
          <span>Logged in as: <strong>{user?.name}</strong> ({user?.role})</span>
        </div>
      </motion.div>

      {/* Success Message */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mb-6 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 text-green-800 dark:text-green-300 px-4 py-3 rounded-lg flex items-center space-x-2"
        >
          <Save className="w-5 h-5" />
          <span>Deal created successfully and notification sent to admin!</span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="xl:col-span-2 bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-700"
        >
          <div className="flex items-center space-x-3 mb-8">
            <Plus className="w-8 h-8 text-green-600" />
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Deal Information</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formFields.map((field, index) => (
                <motion.div
                  key={field.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className={field.name === 'notes' ? 'md:col-span-2' : ''}
                >
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                    <div className="flex items-center space-x-3">
                      <field.icon className="w-5 h-5" />
                      <span>{field.label}</span>
                      {field.required && <span className="text-red-500">*</span>}
                    </div>
                  </label>
                  {field.type === 'select' ? (
                    <select
                      name={field.name}
                      value={formData[field.name as keyof typeof formData]}
                      onChange={handleInputChange}
                      required={field.required}
                      className="w-full px-4 py-4 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 shadow-sm"
                    >
                      <option value="">Select {field.label}</option>
                      {field.options?.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name as keyof typeof formData]}
                      onChange={handleInputChange}
                      required={field.required}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-4 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 shadow-sm"
                    />
                  )}
                </motion.div>
              ))}
            </div>

            {/* Priority and Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-5 h-5" />
                    <span>Priority Level</span>
                  </div>
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 shadow-sm"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5" />
                    <span>Additional Notes</span>
                  </div>
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Add any additional notes about this deal..."
                  className="w-full px-4 py-4 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 shadow-sm resize-none"
                />
              </motion.div>
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:from-slate-400 disabled:to-slate-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 flex items-center justify-center space-x-3 shadow-xl hover:shadow-2xl"
            >
              <Save className="w-6 h-6" />
              <span>{isSubmitting ? 'Creating Deal...' : 'Create Deal'}</span>
            </motion.button>
          </form>
        </motion.div>

        {/* Deal Preview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-700"
        >
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Deal Preview</h2>
          
          <div className="space-y-4">
            <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Customer Information</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Name:</span> {formData.customerName || 'Not specified'}</p>
                <p><span className="font-medium">Email:</span> {formData.email || 'Not specified'}</p>
                <p><span className="font-medium">Phone:</span> {formData.phone || 'Not specified'}</p>
                <p><span className="font-medium">Country:</span> {formData.country || 'Not specified'}</p>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Deal Details</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Amount:</span> ${formData.amount || '0'}</p>
                <p><span className="font-medium">Commission:</span> ${formData.commission || '0'}</p>
                <p><span className="font-medium">Duration:</span> {formData.duration || '0'} months</p>
                <p><span className="font-medium">Product:</span> {formData.product || 'Not selected'}</p>
                <p><span className="font-medium">Service:</span> {formData.serviceType || 'Not selected'}</p>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Team Information</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Sales Agent:</span> {user?.name}</p>
                <p><span className="font-medium">Closing Agent:</span> {formData.closingAgent || 'Not assigned'}</p>
                <p><span className="font-medium">Team:</span> {formData.team || 'Not assigned'}</p>
                <p><span className="font-medium">Priority:</span> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
                    formData.priority === 'high' ? 'bg-red-100 text-red-800' :
                    formData.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {formData.priority}
                  </span>
                </p>
              </div>
            </div>

            {formData.notes && (
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Notes</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{formData.notes}</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};