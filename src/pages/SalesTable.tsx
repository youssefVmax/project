import React, { useState, useEffect } from 'react';
import { dataStore, SalesEntry } from '../utils/dataStore';
import { motion } from 'framer-motion';
import Papa from 'papaparse';
import { Table, Search, Download, Filter, Eye } from 'lucide-react';

const CSV_PATH = '/data/Three-month-dashboard-R.csv';

interface SalesRow {
  id: number;
  agent: string;
  closer: string;
  amount: number;
  program: string;
  server: string;
  month: string;
  date: string;
  status: string;
  commission: number;
  region: string;
  customerType: string;
}

export const SalesTable: React.FC = () => {
  const [csvData, setCsvData] = useState<any[]>([]);
  const [realTimeEntries, setRealTimeEntries] = useState<SalesEntry[]>([]);
  const [salesData, setSalesData] = useState<SalesRow[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [statusFilter, setStatusFilter] = useState('');

  // Load CSV data
  useEffect(() => {
    fetch(CSV_PATH)
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results: Papa.ParseResult<any>) => {
            const rows = results.data
              .filter((row: any) => row.sales_agent && row.amount_paid && row.data_month)
              .map((row: any, index: number) => ({
                id: index + 1,
                agent: row.sales_agent || '',
                closer: row.closing_agent || '',
                amount: parseFloat(row.amount_paid) || 0,
                program: row.product_type || '',
                server: row.service_tier || '',
                month: row.data_month || '',
                date: row.signup_date || '',
                status: 'Closed',
                commission: parseFloat(row.paid_per_month) || 0,
                region: row.country || '',
                customerType: row.subscription_duration || ''
              }));
            setCsvData(rows);
          },
          error: () => {
            setCsvData([]);
          }
        });
      })
      .catch(() => {
        setCsvData([]);
      });
  }, []);

  // Subscribe to real-time data updates
  useEffect(() => {
    const unsubscribe = dataStore.subscribe(() => {
      setRealTimeEntries(dataStore.getEntries());
    });
    
    setRealTimeEntries(dataStore.getEntries());
    return unsubscribe;
  }, []);

  // Combine CSV data with real-time entries
  useEffect(() => {
    const convertedRealTimeData: SalesRow[] = realTimeEntries.map((entry: SalesEntry) => ({
      id: entry.id,
      agent: entry.agent,
      closer: entry.closer,
      amount: entry.amount,
      program: entry.program,
      server: entry.server,
      month: entry.month,
      date: entry.date,
      status: entry.status,
      commission: entry.commission,
      region: entry.region,
      customerType: entry.customerType
    }));
    
    const combined = [...csvData, ...convertedRealTimeData];
    setSalesData(combined);
  }, [csvData, realTimeEntries]);

  const filteredData = salesData
    .filter((item: SalesRow) => 
      (item.agent.toLowerCase().includes(searchTerm.toLowerCase()) ||
       item.closer.toLowerCase().includes(searchTerm.toLowerCase()) ||
       item.program.toLowerCase().includes(searchTerm.toLowerCase()) ||
       item.server.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === '' || item.status === statusFilter)
    )
    .sort((a: SalesRow, b: SalesRow) => {
      const aValue = a[sortField as keyof SalesRow];
      const bValue = b[sortField as keyof SalesRow];
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Agent', 'Closer', 'Amount', 'Program', 'Server', 'Month', 'Date', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredData.map((row: SalesRow) => 
        [row.id, row.agent, row.closer, row.amount, row.program, row.server, row.month, row.date, row.status].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sales_data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
          Sales & Deals Table
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Comprehensive view of all sales transactions and deals
        </p>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 mb-6"
      >
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search agents, closers, programs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-80"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="Closed">Closed</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={exportToCSV}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700">
              <tr>
                {[
                  { key: 'id', label: 'ID' },
                  { key: 'agent', label: 'Agent' },
                  { key: 'closer', label: 'Closer' },
                  { key: 'amount', label: 'Amount' },
                  { key: 'program', label: 'Program' },
                  { key: 'server', label: 'Server' },
                  { key: 'month', label: 'Month' },
                  { key: 'date', label: 'Date' },
                  { key: 'status', label: 'Status' },
                ].map((column) => (
                  <th
                    key={column.key}
                    onClick={() => handleSort(column.key)}
                    className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                  >
                    <div className="flex items-center space-x-1">
                      <span>{column.label}</span>
                      {sortField === column.key && (
                        <span className="text-blue-600">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredData.map((row, index) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">
                    #{row.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">
                    {row.agent}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">
                    {row.closer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600 dark:text-green-400">
                    ${row.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full text-xs">
                      {row.program}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">
                    <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-2 py-1 rounded-full text-xs">
                      {row.server}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">
                    {row.month}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">
                    {row.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      row.status === 'Closed' 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                        : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <Eye className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400">No data found matching your criteria</p>
          </div>
        )}
      </motion.div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-6 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {filteredData.length}
            </p>
            <p className="text-slate-600 dark:text-slate-400">Total Records</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              ${filteredData.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
            </p>
            <p className="text-slate-600 dark:text-slate-400">Total Revenue</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {filteredData.filter(item => item.status === 'Closed').length}
            </p>
            <p className="text-slate-600 dark:text-slate-400">Closed Deals</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              ${Math.round(filteredData.reduce((sum, item) => sum + item.commission, 0)).toLocaleString()}
            </p>
            <p className="text-slate-600 dark:text-slate-400">Total Commission</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};