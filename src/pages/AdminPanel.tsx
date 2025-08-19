import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, Users, BarChart3, Bell, Settings, Eye, 
  TrendingUp, DollarSign, Award, Target, Calendar,
  User, Building, Phone, Mail, MapPin, Clock
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useDeals } from '../contexts/DealsContext';
import { useNotifications } from '../contexts/NotificationContext';
import { formatDateTime } from '../utils/dateUtils';

export const AdminPanel: React.FC = () => {
  const { users, switchToUser, currentViewingUser } = useAuth();
  const { deals, getDealsStats } = useDeals();
  const { notifications } = useNotifications();
  const [selectedUser, setSelectedUser] = useState<string>('');

  const stats = getDealsStats();
  const recentDeals = deals.slice(0, 10);
  const recentNotifications = notifications.slice(0, 5);

  const salesmen = users.filter(user => user.role === 'salesman');

  const handleUserSwitch = (userId: string) => {
    setSelectedUser(userId);
    switchToUser(userId);
  };

  const getUserStats = (userId: string) => {
    const user = users.find(u => u.id === userId);
    const userDeals = deals.filter(deal => deal.salesAgent === user?.name);
    const totalRevenue = userDeals.reduce((sum, deal) => sum + deal.amount, 0);
    const closedDeals = userDeals.filter(deal => deal.status === 'closed').length;
    
    return {
      totalDeals: userDeals.length,
      totalRevenue,
      closedDeals,
      avgDealSize: userDeals.length > 0 ? totalRevenue / userDeals.length : 0
    };
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Shield className="w-10 h-10 text-red-600" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
            Admin Control Panel
          </h1>
        </div>
        <p className="text-xl text-slate-600 dark:text-slate-400">
          Comprehensive management and analytics dashboard
        </p>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Deals', value: stats.totalDeals, icon: BarChart3, color: 'blue' },
          { title: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'green' },
          { title: 'Closed Deals', value: stats.closedDeals, icon: Award, color: 'purple' },
          { title: 'Avg Deal Size', value: `$${Math.round(stats.avgDealSize).toLocaleString()}`, icon: Target, color: 'orange' }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-${stat.color}-100 dark:bg-${stat.color}-900/30`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-1">{stat.title}</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* User Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-700"
      >
        <div className="flex items-center space-x-3 mb-6">
          <Users className="w-6 h-6 text-blue-600" />
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Sales Team Management</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Selector */}
          <div>
            <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Switch to User Dashboard</h4>
            <div className="space-y-3">
              {salesmen.map(user => {
                const userStats = getUserStats(user.id);
                return (
                  <motion.div
                    key={user.id}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      currentViewingUser?.id === user.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600'
                    }`}
                    onClick={() => handleUserSwitch(user.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {user.avatar}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">{user.name}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{user.department}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">${userStats.totalRevenue.toLocaleString()}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{userStats.totalDeals} deals</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Current User Stats */}
          <div>
            <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Current View: {currentViewingUser?.name}
            </h4>
            {currentViewingUser && (
              <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {(() => {
                    const userStats = getUserStats(currentViewingUser.id);
                    return [
                      { label: 'Total Deals', value: userStats.totalDeals },
                      { label: 'Closed Deals', value: userStats.closedDeals },
                      { label: 'Total Revenue', value: `$${userStats.totalRevenue.toLocaleString()}` },
                      { label: 'Avg Deal Size', value: `$${Math.round(userStats.avgDealSize).toLocaleString()}` }
                    ].map((stat, index) => (
                      <div key={stat.label} className="text-center">
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</p>
                      </div>
                    ));
                  })()}
                </div>
                <button
                  onClick={() => window.open('/dashboard', '_blank')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Full Dashboard</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Deals */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-700"
        >
          <div className="flex items-center space-x-3 mb-6">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Recent Deals</h3>
          </div>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {recentDeals.length === 0 ? (
              <div className="text-center py-8">
                <BarChart3 className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-500 dark:text-slate-400">No deals yet</p>
              </div>
            ) : (
              recentDeals.map((deal, index) => (
                <motion.div
                  key={deal.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.05 }}
                  className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-slate-900 dark:text-white">{deal.customerName}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      deal.status === 'closed' ? 'bg-green-100 text-green-800' :
                      deal.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {deal.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <p><span className="font-medium">Amount:</span> ${deal.amount.toLocaleString()}</p>
                    <p><span className="font-medium">Agent:</span> {deal.salesAgent}</p>
                    <p><span className="font-medium">Product:</span> {deal.product}</p>
                    <p><span className="font-medium">Created:</span> {formatDateTime(deal.createdAt)}</p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Recent Notifications */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-700"
        >
          <div className="flex items-center space-x-3 mb-6">
            <Bell className="w-6 h-6 text-purple-600" />
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Recent Notifications</h3>
          </div>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {recentNotifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-500 dark:text-slate-400">No notifications</p>
              </div>
            ) : (
              recentNotifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.05 }}
                  className={`p-4 rounded-lg border-l-4 ${
                    notification.priority === 'high' ? 'border-l-red-500 bg-red-50 dark:bg-red-900/10' :
                    notification.priority === 'medium' ? 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/10' :
                    'border-l-blue-500 bg-blue-50 dark:bg-blue-900/10'
                  } ${!notification.isRead ? 'ring-2 ring-blue-200 dark:ring-blue-800' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900 dark:text-white">{notification.title}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{notification.message}</p>
                      <div className="flex items-center space-x-2 mt-2 text-xs text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span>{formatDateTime(notification.createdAt)}</span>
                      </div>
                    </div>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* System Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white"
      >
        <h2 className="text-3xl font-bold mb-8 text-center">System Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <Users className="w-12 h-12 mx-auto mb-4 text-blue-200" />
            <h3 className="text-xl font-bold mb-2">Active Users</h3>
            <p className="text-3xl font-bold">{users.filter(u => u.isActive).length}</p>
            <p className="text-sm opacity-75">{salesmen.length} Sales Agents</p>
          </div>
          <div className="text-center">
            <Bell className="w-12 h-12 mx-auto mb-4 text-purple-200" />
            <h3 className="text-xl font-bold mb-2">Notifications</h3>
            <p className="text-3xl font-bold">{notifications.filter(n => !n.isRead).length}</p>
            <p className="text-sm opacity-75">Unread Messages</p>
          </div>
          <div className="text-center">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 text-green-200" />
            <h3 className="text-xl font-bold mb-2">Performance</h3>
            <p className="text-3xl font-bold">{((stats.closedDeals / stats.totalDeals) * 100 || 0).toFixed(1)}%</p>
            <p className="text-sm opacity-75">Close Rate</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};