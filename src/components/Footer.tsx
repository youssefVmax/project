import React from 'react';
import { Twitter, Github, Linkedin, Mail, BarChart3 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-slate-900 dark:text-white">Analytics Dashboard</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mb-4 max-w-md">
              Comprehensive sales analytics and data visualization platform for VMax company.
            </p>
            <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md">
              <strong>Created by:</strong> Youssef Bassiony - Data Scientist and Software Engineer<br/>
              Specialized in business intelligence and data analytics solutions.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-slate-900 dark:text-white font-semibold mb-4">Analytics</h3>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400">
              <li><a href="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">Dashboard</a></li>
              <li><a href="/data-entry" className="hover:text-slate-900 dark:hover:text-white transition-colors">Data Entry</a></li>
              <li><a href="/sales-table" className="hover:text-slate-900 dark:hover:text-white transition-colors">Sales Table</a></li>
              <li><a href="/company-overview" className="hover:text-slate-900 dark:hover:text-white transition-colors">Company Overview</a></li>
            </ul>
          </div>
          
    
        </div>
        
        <div className="border-t border-stone-200 dark:border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-slate-600 dark:text-slate-400">© 2025 FlashX Company. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a href="#" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-sm">Privacy Policy</a>
            <a href="#" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-sm">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};