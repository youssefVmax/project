import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Plus, Table, Building2, Home, Brain } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export const Navigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/data-entry', icon: Plus, label: 'Data Entry' },
    { path: '/sales-table', icon: Table, label: 'Sales Table' },
    { path: '/prediction', icon: Brain, label: 'Prediction' },
    { path: '/company-overview', icon: Building2, label: 'Company Overview' },
  ];

  return (
    <nav className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50 transition-colors duration-300">
      <div className="w-full px-2 sm:px-4 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between h-auto sm:h-16 py-2 sm:py-0">
          <div className="flex items-center space-x-3 mb-2 sm:mb-0">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-slate-900 dark:text-white">Dashboard Analytics</span>
          </div>
          <div className="flex flex-wrap items-center space-x-2 sm:space-x-8 w-full sm:w-auto justify-center sm:justify-end">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-2 sm:px-3 py-2 rounded-lg transition-all duration-200 text-sm sm:text-base ${
                  location.pathname === path
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden md:block">{label}</span>
              </Link>
            ))}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};