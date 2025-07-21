import React, { useState } from 'react';
import { dataStore } from '../utils/dataStore';
import { motion } from 'framer-motion';
import { Plus, Save, Calendar, User, DollarSign, Server, Package, MapPin, Building } from 'lucide-react';

export const DataEntry: React.FC = () => {
  const [formData, setFormData] = useState({
    agent: '',
    closer: '',
    amount: '',
    program: '',
    server: '',
    month: '',
    date: '',
    region: '',
    customerType: '',
    commission: ''
  });

  const [entries, setEntries] = useState<any[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Add to real-time data store
    dataStore.addEntry({
      agent: formData.agent,
      closer: formData.closer,
      amount: parseFloat(formData.amount),
      program: formData.program,
      server: formData.server,
      month: formData.month,
      date: formData.date,
      region: formData.region,
      customerType: formData.customerType,
      commission: formData.commission
    });
    
    // Also add to local state for immediate UI update
    const newEntry = {
      ...formData,
      amount: parseFloat(formData.amount),
      id: Date.now()
    };
    setEntries(prev => [...prev, newEntry]);
    
    // Reset form
    setFormData({
      agent: '',
      closer: '',
      amount: '',
      program: '',
      server: '',
      month: '',
      date: '',
      region: '',
      customerType: '',
      commission: ''
    });
  };

  const formFields = [
    { name: 'agent', label: 'Agent Name', type: 'text', icon: User },
    { name: 'closer', label: 'Closer Name', type: 'text', icon: User },
    { name: 'amount', label: 'Amount ($)', type: 'number', icon: DollarSign },
    { name: 'program', label: 'Program', type: 'select', icon: Package, options: ['IPTV Premium', 'IPTV Standard', 'SkyLive Pro', 'SkyLive Premium', 'SkyLive Standard'] },
    { name: 'server', label: 'Server', type: 'select', icon: Server, options: ['VMax', 'SkyLive'] },
    { name: 'month', label: 'Month', type: 'select', icon: Calendar, options: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] },
    { name: 'date', label: 'Date', type: 'date', icon: Calendar },
    { name: 'region', label: 'Region', type: 'select', icon: MapPin, options: ['North America', 'Europe', 'Asia', 'South America', 'Africa', 'Oceania'] },
    { name: 'customerType', label: 'Customer Type', type: 'select', icon: Building, options: ['Enterprise', 'SMB', 'Individual'] },
    { name: 'commission', label: 'Commission ($)', type: 'number', icon: DollarSign }
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
          Data Entry
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400">
          Add new sales data and track monthly performance
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-700"
        >
          <div className="flex items-center space-x-3 mb-8">
            <Plus className="w-8 h-8 text-green-600" />
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Add New Entry</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {formFields.map((field, index) => (
              <motion.div
                key={field.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  <div className="flex items-center space-x-3">
                    <field.icon className="w-5 h-5" />
                    <span>{field.label}</span>
                  </div>
                </label>
                {field.type === 'select' ? (
                  <select
                    name={field.name}
                    value={formData[field.name as keyof typeof formData]}
                    onChange={handleInputChange}
                    required
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
                    required
                    className="w-full px-4 py-4 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 shadow-sm"
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                  />
                )}
              </motion.div>
            ))}

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 flex items-center justify-center space-x-3 shadow-xl hover:shadow-2xl"
            >
              <Save className="w-6 h-6" />
              <span>Save Entry</span>
            </motion.button>
          </form>
        </motion.div>

        {/* Recent Entries */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-700"
        >
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Recent Entries</h2>
          
          <div className="space-y-6 max-h-96 overflow-y-auto">
            {entries.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500 dark:text-slate-400 text-lg">
                  No entries yet. Add your first entry using the form.
                  <br />
                  <span className="text-sm">Data will be saved in real-time and appear in Sales Table and Dashboard.</span>
                </p>
              </div>
            ) : (
              entries.slice(-5).reverse().map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-600 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{entry.agent}</h3>
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                      ${entry.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <p><span className="font-medium">Closer:</span> {entry.closer}</p>
                    <p><span className="font-medium">Program:</span> {entry.program}</p>
                    <p><span className="font-medium">Server:</span> {entry.server}</p>
                    <p><span className="font-medium">Month:</span> {entry.month}</p>
                    {entry.commission && <p><span className="font-medium">Commission:</span> ${entry.commission.toLocaleString()}</p>}
                    {entry.region && <p><span className="font-medium">Region:</span> {entry.region}</p>}
                    <p><span className="font-medium text-green-600">Status:</span> Saved to Dashboard</p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};