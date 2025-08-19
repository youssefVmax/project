import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, ComposedChart
} from 'recharts';
import { 
  TrendingUp, Users, DollarSign, Award, Filter, Calendar, Target, 
  BarChart2, BarChart3, Activity, Zap, Star, Crown, User, Building2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useDeals } from '../contexts/DealsContext';

const CSV_PATH = '/data/3,4,5,6,7-monthes.csv';

interface SalesRow {
  signup_date: string;
  customer_name: string;
  email: string;
  phone_clean: string;
  country: string;
  amount_paid: number;
  paid_per_month: number;
  duration_months_cleaned: number;
  sales_agent: string;
  closing_agent: string;
  sales_team: string;
  product_type: string;
  service_tier: string;
  data_month: string;
}

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#6366F1', '#EC4899', '#14B8A6'];

export const Dashboard: React.FC = () => {
  const { user, currentViewingUser } = useAuth();
  const { deals, getDealsStats } = useDeals();
  const [salesData, setSalesData] = useState<SalesRow[]>([]);
  const [filteredData, setFilteredData] = useState<SalesRow[]>([]);
  const [filters, setFilters] = useState({
    sales_agent: '',
    closing_agent: '',
    product_type: '',
    service_tier: '',
    sales_team: '',
    data_month: '',
    country: '',
    date_from: '',
    date_to: '',
    amount_min: '',
    amount_max: ''
  });

  // Load CSV data
  useEffect(() => {
    fetch(CSV_PATH)
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results: Papa.ParseResult<any>) => {
            const rows: SalesRow[] = results.data
              .map((row: any) => ({
                signup_date: row.signup_date || '',
                customer_name: row.Customer_Name || '',
                email: row.email || '',
                phone_clean: row.phone_clean || '',
                country: row.country || '',
                amount_paid: parseFloat(row.amount_paid) || 0,
                paid_per_month: parseFloat(row.paid_per_month) || 0,
                duration_months_cleaned: parseFloat(row.duration_months_cleaned) || 0,
                sales_agent: row.sales_agent || '',
                closing_agent: row.closing_agent || '',
                sales_team: row.sales_team || '',
                product_type: row.product_type || '',
                service_tier: row.service_tier || '',
                data_month: row.data_month || ''
              }))
              .filter((row: SalesRow) => row.sales_agent && row.amount_paid > 0);
            
            setSalesData(rows);
            setFilteredData(rows);
          }
        });
      })
      .catch(() => {
        setSalesData([]);
        setFilteredData([]);
      });
  }, []);

  // Filter data based on current viewing user and filters
  useEffect(() => {
    let filtered = salesData;

    // If viewing a specific salesman's data, filter by their name
    if (currentViewingUser?.role === 'salesman') {
      filtered = filtered.filter(row => row.sales_agent === currentViewingUser.name);
    }

    // Apply additional filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        if (key === 'date_from' && value) {
          filtered = filtered.filter(row => new Date(row.signup_date) >= new Date(value));
        } else if (key === 'date_to' && value) {
          filtered = filtered.filter(row => new Date(row.signup_date) <= new Date(value));
        } else if (key === 'amount_min' && value) {
          filtered = filtered.filter(row => row.amount_paid >= parseFloat(value));
        } else if (key === 'amount_max' && value) {
          filtered = filtered.filter(row => row.amount_paid <= parseFloat(value));
        } else if (key.startsWith('amount_') || key.startsWith('date_')) {
          // Skip these as they're handled above
        } else {
          filtered = filtered.filter(row => 
            String(row[key as keyof SalesRow]).toLowerCase().includes(value.toLowerCase())
          );
        }
      }
    });

    setFilteredData(filtered);
  }, [filters, salesData, currentViewingUser]);

  // Get unique values for filters
  const getUniqueValues = (field: keyof SalesRow): string[] => {
    return [...new Set(salesData.map(item => String(item[field])).filter(v => v))].sort();
  };

  // Calculate KPIs
  const totalAmount = filteredData.reduce((sum, item) => sum + item.amount_paid, 0);
  const totalDeals = filteredData.length;
  const avgDealSize = totalDeals > 0 ? totalAmount / totalDeals : 0;
  const totalCommission = filteredData.reduce((sum, item) => sum + item.paid_per_month, 0);

  // Agent performance data
  const agentStats = filteredData.reduce((acc: Record<string, {amount: number, deals: number}>, item) => {
    const agent = item.sales_agent;
    if (!acc[agent]) {
      acc[agent] = { amount: 0, deals: 0 };
    }
    acc[agent].amount += item.amount_paid;
    acc[agent].deals += 1;
    return acc;
  }, {});

  const agentPerformance = Object.entries(agentStats)
    .map(([name, stats]) => ({
      name,
      amount: stats.amount,
      deals: stats.deals,
      avgDeal: stats.amount / stats.deals
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 10);

  // Product distribution
  const productStats = filteredData.reduce((acc: Record<string, number>, item) => {
    const product = item.product_type;
    acc[product] = (acc[product] || 0) + item.amount_paid;
    return acc;
  }, {});

  const productData = Object.entries(productStats)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // Monthly trend
  const monthlyTrend = filteredData.reduce((acc: any[], item) => {
    const existing = acc.find(m => m.month === item.data_month);
    if (existing) {
      existing.amount += item.amount_paid;
      existing.deals += 1;
    } else {
      acc.push({ 
        month: item.data_month, 
        amount: item.amount_paid, 
        deals: 1
      });
    }
    return acc;
  }, []).sort((a, b) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months.indexOf(a.month) - months.indexOf(b.month);
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
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
          {currentViewingUser?.role === 'admin' ? (
            <Shield className="w-10 h-10 text-red-600" />
          ) : (
            <User className="w-10 h-10 text-blue-600" />
          )}
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {currentViewingUser?.role === 'admin' ? 'Admin' : 'Sales'} Analytics Dashboard
          </h1>
        </div>
        <p className="text-xl text-slate-600 dark:text-slate-400 mb-4">
          {currentViewingUser?.role === 'admin' 
            ? `Viewing: ${currentViewingUser?.name} Dashboard` 
            : `Welcome back, ${currentViewingUser?.name}!`}
        </p>
        {currentViewingUser?.role === 'salesman' && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-blue-800 dark:text-blue-300">
              This dashboard shows your personal sales performance and analytics.
            </p>
          </div>
        )}
      </motion.div>

      {/* Enhanced Filters */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-700"
      >
        <div className="flex items-center space-x-3 mb-6">
          <Filter className="w-6 h-6 text-blue-600" />
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Advanced Filters</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Date Range Filters */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              From Date
            </label>
            <input
              type="date"
              value={filters.date_from}
              onChange={(e) => handleFilterChange('date_from', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              To Date
            </label>
            <input
              type="date"
              value={filters.date_to}
              onChange={(e) => handleFilterChange('date_to', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Amount Range Filters */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Min Amount ($)
            </label>
            <input
              type="number"
              value={filters.amount_min}
              onChange={(e) => handleFilterChange('amount_min', e.target.value)}
              placeholder="0"
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Max Amount ($)
            </label>
            <input
              type="number"
              value={filters.amount_max}
              onChange={(e) => handleFilterChange('amount_max', e.target.value)}
              placeholder="999999"
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Dropdown Filters */}
          {Object.entries(filters).filter(([key]) => !key.startsWith('date_') && !key.startsWith('amount_')).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 capitalize">
                {key.replace(/_/g, ' ')}
              </label>
              <select
                value={value}
                onChange={(e) => handleFilterChange(key, e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All {key.replace(/_/g, ' ')}</option>
                {getUniqueValues(key as keyof SalesRow).map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            title: 'Total Revenue', 
            value: `$${(totalAmount / 1000).toFixed(1)}K`, 
            fullValue: `$${totalAmount.toLocaleString()}`, 
            icon: DollarSign, 
            color: 'blue', 
            trend: '+12%' 
          },
          { 
            title: 'Total Deals', 
            value: totalDeals, 
            fullValue: `${totalDeals} deals`, 
            icon: Award, 
            color: 'green', 
            trend: '+8%' 
          },
          { 
            title: 'Avg Deal Size', 
            value: `$${(avgDealSize / 1000).toFixed(1)}K`, 
            fullValue: `$${Math.round(avgDealSize).toLocaleString()}`, 
            icon: Target, 
            color: 'purple', 
            trend: '+5%' 
          },
          { 
            title: 'Commission', 
            value: `$${(totalCommission / 1000).toFixed(1)}K`, 
            fullValue: `$${totalCommission.toLocaleString()}`, 
            icon: Star, 
            color: 'orange', 
            trend: '+15%' 
          }
        ].map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-700 hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-4 rounded-2xl bg-${metric.color}-100 dark:bg-${metric.color}-900/30`}>
                <metric.icon className={`w-8 h-8 text-${metric.color}-600 dark:text-${metric.color}-400`} />
              </div>
              <span className="text-sm font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                {metric.trend}
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-2">{metric.title}</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{metric.value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
              {metric.fullValue}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Agent Performance */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-700"
        >
          <div className="flex items-center space-x-3 mb-6">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {currentViewingUser?.role === 'salesman' ? 'Your Performance' : 'Agent Performance'}
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={agentPerformance} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis 
                dataKey="name" 
                stroke="#6B7280" 
                fontSize={10} 
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis yAxisId="left" stroke="#6B7280" />
              <YAxis yAxisId="right" orientation="right" stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: 'none', 
                  borderRadius: '12px',
                  color: '#F9FAFB'
                }} 
              />
              <Legend />
              <Bar yAxisId="left" dataKey="amount" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Revenue ($)" />
              <Line yAxisId="right" type="monotone" dataKey="deals" stroke="#10B981" strokeWidth={3} name="Deals Count" />
            </ComposedChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Product Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-700"
        >
          <div className="flex items-center space-x-3 mb-6">
            <Activity className="w-6 h-6 text-purple-600" />
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Product Revenue</h3>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={productData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
              >
                {productData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: 'none', 
                  borderRadius: '12px',
                  color: '#F9FAFB'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Monthly Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-700"
        >
          <div className="flex items-center space-x-3 mb-6">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Monthly Revenue Trend</h3>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: 'none', 
                  borderRadius: '12px',
                  color: '#F9FAFB'
                }} 
              />
              <Area type="monotone" dataKey="amount" stroke="#10B981" fill="url(#colorRevenue)" strokeWidth={3} />
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">
          {currentViewingUser?.role === 'salesman' ? 'Your Performance Summary' : 'Performance Summary'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <Building2 className="w-12 h-12 mx-auto mb-4 text-blue-200" />
            <h3 className="text-xl font-bold mb-2">Total Records</h3>
            <p className="text-3xl font-bold">{filteredData.length}</p>
          </div>
          <div className="text-center">
            <Users className="w-12 h-12 mx-auto mb-4 text-purple-200" />
            <h3 className="text-xl font-bold mb-2">Unique Agents</h3>
            <p className="text-3xl font-bold">{new Set(filteredData.map(d => d.sales_agent)).size}</p>
          </div>
          <div className="text-center">
            <Target className="w-12 h-12 mx-auto mb-4 text-green-200" />
            <h3 className="text-xl font-bold mb-2">Products</h3>
            <p className="text-3xl font-bold">{new Set(filteredData.map(d => d.product_type)).size}</p>
          </div>
          <div className="text-center">
            <Activity className="w-12 h-12 mx-auto mb-4 text-yellow-200" />
            <h3 className="text-xl font-bold mb-2">Countries</h3>
            <p className="text-3xl font-bold">{new Set(filteredData.map(d => d.country)).size}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};