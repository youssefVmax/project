import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, Plus, Table, Building2, Home, Brain, LogOut, 
  Bell, Users, Settings, ChevronDown, User, Shield, Trophy
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { NotificationPanel } from './NotificationPanel';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';

export const Navigation: React.FC = () => {
  const location = useLocation();
  const { user, logout, users, switchToUser, currentViewingUser } = useAuth();
  const { unreadCount } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Don't show navigation on landing page or login page
  if (location.pathname === '/' || location.pathname === '/login') {
    return null;
  }

  const getNavItems = () => {
    const baseItems = [
      { path: '/dashboard', icon: Home, label: 'Dashboard' },
      { path: '/sales-table', icon: Table, label: 'Sales Table' },
      { path: '/prediction', icon: Brain, label: 'Analytics' },
      { path: '/competation', icon: Trophy, label: 'Competition' },
      { path: '/company-overview', icon: Building2, label: 'Company' },
    ];

    if (user?.role === 'admin') {
      return [
        ...baseItems,
        { path: '/admin', icon: Shield, label: 'Admin Panel' },
        { path: '/user-management', icon: Users, label: 'Users' }
      ];
    } else {
      return [
        ...baseItems,
        { path: '/data-entry', icon: Plus, label: 'New Deal' }
      ];
    }
  };

  const navItems = getNavItems();

  return (
    <nav className="w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50 transition-colors duration-300">
      <div className="w-full px-2 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Link to="/dashboard" className="flex items-center space-x-3">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-slate-900 dark:text-white">FlashX Analytics</span>
            </Link>
          </div>

          {/* Navigation Items */}
          <div className="hidden lg:flex items-center space-x-6">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  location.pathname === path
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </Link>
            ))}
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-4">
            {/* User Switcher (Admin Only) */}
            {user?.role === 'admin' && (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {currentViewingUser?.avatar}
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {currentViewingUser?.name}
                  </span>
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700">
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Switch User View</p>
                    </div>
                    {users.map(u => (
                      <button
                        key={u.id}
                        onClick={() => {
                          switchToUser(u.id);
                          setShowUserMenu(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${
                          currentViewingUser?.id === u.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                          u.role === 'admin' ? 'bg-gradient-to-r from-red-500 to-pink-600' : 'bg-gradient-to-r from-blue-500 to-purple-600'
                        }`}>
                          {u.avatar}
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-sm font-medium text-slate-900 dark:text-white">{u.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{u.role}</p>
                        </div>
                        {u.role === 'admin' && <Shield className="w-4 h-4 text-red-500" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <NotificationPanel onClose={() => setShowNotifications(false)} />
              )}
            </div>

            {/* User Info */}
            <div className="flex items-center space-x-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user?.role}</p>
              </div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                user?.role === 'admin' ? 'bg-gradient-to-r from-red-500 to-pink-600' : 'bg-gradient-to-r from-blue-500 to-purple-600'
              }`}>
                {user?.avatar}
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:block">Logout</span>
            </button>

            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};