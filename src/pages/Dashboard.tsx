import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Papa from 'papaparse';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Radar, ComposedChart, Scatter, ScatterChart, LabelList
} from 'recharts';
import { 
  TrendingUp, Users, DollarSign, Award, Filter, Calendar, Target, 
  BarChart2, BarChart3, PieChart as PieChartIcon, Activity, Zap, Star, Crown,
  TrendingDown, ArrowUp, ArrowDown, Equal
} from 'lucide-react';

const CSV_PATH = '/data/Three-month-dashboard-R.csv';
function parseNumber(val: string | number): number {
  const num = Number(val);
  return isNaN(num) ? 0 : num;
}


interface SalesRow {
  signup_date: string;
  end_date: string;
  customer_name: string;
  email: string;
  phone_clean: string;
  country: string;
  amount_paid: number;
  paid_per_month: number;
  duration_months_cleaned: number;
  is_long_term: boolean;
  days_used_estimated: number;
  customer_age_days: number;
  sales_agent: string;
  closing_agent: string;
  sales_team: string;
  product_type: string;
  service_tier: string;
  subscription_duration: string;
  data_month: string;
  data_year: string;
  invoice_link: string;
  is_ibo_player: boolean;
  is_bob_player: boolean;
  is_smarters: boolean;
  is_ibo_pro: boolean;
  on_end_date: boolean;
  days_remaining: number;
  paid_per_day: number;
  duration_mean_paid: number;
  agent_avg_paid: number;
  is_above_avg: boolean;
  paid_rank: number;
}

function transformRow(row: any): SalesRow {
  return {
    signup_date: row.signup_date || '',
    end_date: row.end_date || '',
    customer_name: row.customer_name || '',
    email: row.email || '',
    phone_clean: row.phone_clean || '',
    country: row.country || '',
    amount_paid: parseNumber(row.amount_paid),
    paid_per_month: parseNumber(row.paid_per_month),
    duration_months_cleaned: parseNumber(row.duration_months_cleaned),
    is_long_term: row.is_long_term === 'true',
    days_used_estimated: parseNumber(row.days_used_estimated),
    customer_age_days: parseNumber(row.customer_age_days),
    sales_agent: row.sales_agent || '',
    closing_agent: row.closing_agent || '',
    sales_team: row.sales_team || '',
    product_type: row.product_type || '',
    service_tier: row.service_tier || '',
    subscription_duration: row.subscription_duration || '',
    data_month: row.data_month || '',
    data_year: row.data_year || '',
    invoice_link: row.invoice_link || '',
    is_ibo_player: row.is_ibo_player === 'true',
    is_bob_player: row.is_bob_player === 'true',
    is_smarters: row.is_smarters === 'true',
    is_ibo_pro: row.is_ibo_pro === 'true',
    on_end_date: row.on_end_date === 'true',
    days_remaining: parseNumber(row.days_remaining),
    paid_per_day: parseNumber(row.paid_per_day),
    duration_mean_paid: parseNumber(row.duration_mean_paid),
    agent_avg_paid: parseNumber(row.agent_avg_paid),
    is_above_avg: row.is_above_avg === 'true',
    paid_rank: parseNumber(row.paid_rank)
  };
}
const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#6366F1', '#EC4899', '#14B8A6'];

export const Dashboard: React.FC = () => {
  const [salesData, setSalesData] = useState<SalesRow[]>([]);
  const [filteredData, setFilteredData] = useState<SalesRow[]>([]);
  const [filters, setFilters] = useState({
    sales_agent: '',
    closing_agent: '',
    product_type: '',
    service_tier: '',
    sales_team: '',
    data_month: '',
    country: ''
  });

  // Load CSV data on mount
  useEffect(() => {
    fetch(CSV_PATH)
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results: Papa.ParseResult<any>) => {
            const rows: SalesRow[] = results.data
              .map((row: any) => transformRow(row))
              .filter((row: SalesRow) => row.sales_agent && row.amount_paid > 0 && row.data_month);
            setSalesData(rows);
            setFilteredData(rows);
          },
          error: () => {
            setSalesData([]);
            setFilteredData([]);
          }
        });
      })
      .catch(() => {
        setSalesData([]);
        setFilteredData([]);
      });
  }, []);

  // Get unique values for dropdown options
  const getUniqueValues = (field: keyof SalesRow): string[] => {
    if (!salesData || salesData.length === 0) return [];
    const values: string[] = salesData.map((item: SalesRow) => item[field]?.toString()).filter((v: string | undefined): v is string => !!v);
    return [...new Set(values)].sort();
  };

  const filterOptions = {
    sales_agent: getUniqueValues('sales_agent'),
    closing_agent: getUniqueValues('closing_agent'),
    product_type: getUniqueValues('product_type'),
    service_tier: getUniqueValues('service_tier'),
    sales_team: getUniqueValues('sales_team'),
    data_month: getUniqueValues('data_month'),
    country: getUniqueValues('country')
  };
  // Calculate comprehensive metrics
  const totalAmount = filteredData.reduce((sum: number, item: SalesRow) => sum + (item.amount_paid || 0), 0);
  const totalDeals = filteredData.length;
  const avgDealSize = filteredData.length > 0 ? totalAmount / filteredData.length : 0;
  const topAgent = filteredData.length > 0 ? filteredData.reduce((prev: SalesRow, current: SalesRow) => prev.amount_paid > current.amount_paid ? prev : current) : undefined;
  const topCloser = filteredData.length > 0 ? [...filteredData].sort((a, b) => b.amount_paid - a.amount_paid)[0] : undefined;
  const totalCommission = filteredData.reduce((sum: number, item: SalesRow) => sum + (item.paid_per_month || 0), 0);
  const closedDeals = filteredData.filter((item: SalesRow) => item.is_long_term).length;
  const pendingDeals = totalDeals - closedDeals;
  const avgCommission = totalDeals > 0 ? totalCommission / totalDeals : 0;
  const avgDealDuration = filteredData.reduce((sum: number, item: SalesRow) => sum + (item.duration_months_cleaned || 0), 0) / totalDeals || 0;
  const avgDaysUsed = filteredData.reduce((sum: number, item: SalesRow) => sum + (item.days_used_estimated || 0), 0) / totalDeals || 0;


  // Prepare enhanced chart data
 interface AgentPerformance {
    name: string;
    amount: number;
    deals: number;
    avgDeal: number;
  }
  const agentPerformance: AgentPerformance[] = filteredData.reduce((acc: AgentPerformance[], item: SalesRow) => {
    const existing = acc.find(a => a.name === item.sales_agent);
    if (existing) {
      existing.amount += item.amount_paid;
      existing.deals += 1;
    } else {
      acc.push({ 
        name: item.sales_agent, 
        amount: item.amount_paid, 
        deals: 1,
        avgDeal: item.amount_paid
      });
    }
    return acc;
  }, []).map((agent: AgentPerformance) => ({
    ...agent,
    avgDeal: agent.amount / agent.deals
  })).sort((a: AgentPerformance, b: AgentPerformance) => b.amount - a.amount);
  const topAgentPerformance = agentPerformance[0] || { name: 'N/A', amount: 0, deals: 0, avgDeal: 0 };
  const totalAgentPerformance = agentPerformance.reduce((sum, agent) => sum + agent.amount, 0);
  const agentPerformanceByTeam: Record<string, AgentPerformance[]> = filteredData.reduce((acc: Record<string, AgentPerformance[]>, item: SalesRow) => {
    const team = item.sales_team || 'Unknown';
    if (!acc[team]) {
      acc[team] = [];
    }
    const existing = acc[team].find(a => a.name === item.sales_agent);
    if (existing) {
      existing.amount += item.amount_paid;
      existing.deals += 1;
    } else {
      acc[team].push({ 
        name: item.sales_agent, 
        amount: item.amount_paid, 
        deals: 1,
        avgDeal: item.amount_paid
      });
    }
    return acc;
  }, {});

  interface CloserPerformance {
    name: string;
    amount: number;
    deals: number;
    avgDeal: number;

  }

  const closerPerformance: CloserPerformance[] = filteredData.reduce((acc: CloserPerformance[], item: SalesRow) => {
    const existing = acc.find(c => c.name === item.closing_agent);
    if (existing) {
      existing.amount += item.amount_paid;
      existing.deals += 1;
    } else {
      acc.push({ 
        name: item.closing_agent, 
        amount: item.amount_paid, 
        deals: 1,
        avgDeal: item.amount_paid
      });
    }
    return acc;
  }, []).map((closer: CloserPerformance) => ({
    ...closer,
    avgDeal: closer.amount / closer.deals
  })).sort((a: CloserPerformance, b: CloserPerformance) => b.amount - a.amount);
  const topCloserPerformance = closerPerformance[0] || { name: 'N/A', amount: 0, deals: 0, avgDeal: 0 };
  interface ProductTypeData {
    name: string;
    value: number;
    deals: number;
  }
  const productTypeData: ProductTypeData[] = filteredData.reduce((acc: ProductTypeData[], item: SalesRow) => {
    const existing = acc.find((p: ProductTypeData) => p.name === item.product_type);
    if (existing) {
      existing.value += item.amount_paid;
      existing.deals += 1;
    } else {
      acc.push({ name: item.product_type, value: item.amount_paid, deals: 1 });
    }
    return acc;
  }, []);

  interface ProgramData {
    name: string;
    value: number;
  }
  const programData: ProgramData[] = filteredData.reduce((acc: ProgramData[], item: SalesRow) => {
    const existing = acc.find((p: ProgramData) => p.name === item.product_type);
    if (existing) {
      existing.value += item.amount_paid;
    } else {
      acc.push({ name: item.product_type, value: item.amount_paid });
    }
    return acc;
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = salesData;
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter((item: SalesRow) => 
          String(item[key as keyof SalesRow]) === value
        );
      }
    });
    setFilteredData(filtered);
  }, [filters, salesData]);

  interface MonthlyTrend {
    month: string;
    amount: number;
    deals: number;
    commission: number;
  }
  const monthlyTrend: MonthlyTrend[] = filteredData.reduce((acc: MonthlyTrend[], item: SalesRow) => {
    const existing = acc.find((m: MonthlyTrend) => m.month === item.data_month);
    if (existing) {
      existing.amount += item.amount_paid;
      existing.deals += 1;
      existing.commission += item.paid_per_month;
    } else {
      acc.push({ 
        month: item.data_month, 
        amount: item.amount_paid, 
        deals: 1, 
        commission: item.paid_per_month 
      });
    }
    return acc;
  }, []).sort((a: MonthlyTrend, b: MonthlyTrend) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months.indexOf(a.month) - months.indexOf(b.month);
  });

  interface RegionData {
    region: string;
    amount: number;
    deals: number;
  }
  const regionData: RegionData[] = filteredData.reduce((acc: RegionData[], item: SalesRow) => {
    const region = item.country || 'Unknown';
    const existing = acc.find((r: RegionData) => r.region === region);
    if (existing) {
      existing.amount += item.amount_paid;
      existing.deals += 1;
    } else {
      acc.push({ region, amount: item.amount_paid, deals: 1 });
    }
    return acc;
  }, []);

  interface CustomerTypeData {
    type: string;
    amount: number;
    deals: number;
  }
  const customerTypeData: CustomerTypeData[] = filteredData.reduce((acc: CustomerTypeData[], item: SalesRow) => {
    const type = item.service_tier || 'Unknown';
    const existing = acc.find((c: CustomerTypeData) => c.type === type);
    if (existing) {
      existing.amount += item.amount_paid;
      existing.deals += 1;
    } else {
      acc.push({ type, amount: item.amount_paid, deals: 1 });
    }
    return acc;
  }, []);

  // Performance comparison data
  const performanceComparison = agentPerformance.map(agent => ({
    agent: agent.name,
    Revenue: agent.amount,
    Deals: agent.deals * 1000, // Scale for visualization
    AvgDeal: agent.avgDeal
  }));

  // Apply filters
  useEffect(() => {
    let filtered = salesData;
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter((item: SalesRow) => 
          String(item[key as keyof SalesRow]) === value
        );
      }
    });
    
    setFilteredData(filtered);
  }, [filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev: typeof filters) => ({ ...prev, [key]: value }));
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const chartVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Deals Analytics Dashboard
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400">
          Comprehensive analysis of sales performance, trends, and insights
        </p>
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
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {Object.entries(filters).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 capitalize">
                {key.replace(/([A-Z])/g, ' $1')}
              </label>
              <select
                value={value}
                onChange={(e) => handleFilterChange(key, e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">All {key.replace(/([A-Z])/g, ' $1')}</option>
                {filterOptions[key as keyof typeof filterOptions].map((option: string) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Enhanced Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {[
          { title: 'Total Revenue', value: `$${(totalAmount / 1000).toFixed(1)}K`, fullValue: `$${totalAmount.toLocaleString()}`, icon: DollarSign, color: 'blue', trend: '+12%', deals: `${totalDeals} deals` },
          { title: 'Total Commission', value: `$${(totalCommission / 1000).toFixed(1)}K`, fullValue: `$${totalCommission.toLocaleString()}`, icon: Award, color: 'green', trend: '+8%', deals: `${Math.round((totalCommission/totalAmount)*100)}% rate` },
          { title: 'Average Deal Size', value: `$${(avgDealSize / 1000).toFixed(1)}K`, fullValue: `$${Math.round(avgDealSize).toLocaleString()}`, icon: Target, color: 'purple', trend: '+5%', deals: `per deal` },
          { title: 'Total Deals', value: totalDeals, fullValue: `${closedDeals} closed, ${pendingDeals} pending`, icon: TrendingUp, color: 'orange', trend: '+15%', deals: `${Math.round((closedDeals/totalDeals)*100)}% closed` },
          { title: 'Top Agent', value: topAgent?.agent || 'N/A', fullValue: `$${topAgent?.amount?.toLocaleString() || '0'}`, icon: Crown, color: 'pink', trend: 'Leader', deals: `${agentPerformance[0]?.deals || 0} deals` }
        ].map((metric, index) => (
          <motion.div
            key={metric.title}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 + index * 0.1 }}
            className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-700 hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-4 rounded-2xl bg-${metric.color}-100 dark:bg-${metric.color}-900/30`}>
                <metric.icon className={`w-8 h-8 text-${metric.color}-600 dark:text-${metric.color}-400`} />
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                  {metric.trend}
                </span>
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-2">{metric.title}</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{metric.value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
              {metric.deals}
            </p>
            <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-sm text-slate-600 dark:text-slate-400">{metric.fullValue}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Agent Performance - Enhanced Bar Chart */}
        <motion.div
          variants={chartVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-700"
        >
          <div className="flex items-center space-x-3 mb-6">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Agent Performance</h3>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={agentPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
              <YAxis yAxisId="left" stroke="#6B7280" />
              <YAxis yAxisId="right" orientation="right" stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: 'none', 
                  borderRadius: '12px',
                  color: '#F9FAFB',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                }} 
              />
              <Legend />
              <Bar yAxisId="left" dataKey="amount" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Revenue ($)" />
              <Line yAxisId="right" type="monotone" dataKey="deals" stroke="#10B981" strokeWidth={3} name="Deals Count" />
            </ComposedChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Programs Distribution - Enhanced Pie Chart */}
        <motion.div
          variants={chartVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-700"
        >
          <div className="flex items-center space-x-3 mb-6">
            <PieChartIcon className="w-6 h-6 text-purple-600" />
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Program Revenue Distribution</h3>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={programData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent, value }) => `${name}: $${value.toLocaleString()} (${(percent * 100).toFixed(1)}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {programData.map((entry, index) => (
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

        {/* Monthly Trend - Area Chart */}
        <motion.div
          variants={chartVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.7 }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-700"
        >
          <div className="flex items-center space-x-3 mb-6">
            <Activity className="w-6 h-6 text-green-600" />
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

        {/* Performance Radar Chart */}
        <motion.div
          variants={chartVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.8 }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-700"
        >
          <div className="flex items-center space-x-3 mb-6">
            <Zap className="w-6 h-6 text-yellow-600" />
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Multi-Metric Performance</h3>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart data={performanceComparison.slice(0, 5)}>
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis dataKey="agent" tick={{ fontSize: 12, fill: '#6B7280' }} />
              <PolarRadiusAxis tick={{ fontSize: 10, fill: '#6B7280' }} />
              <Radar name="Revenue" dataKey="Revenue" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} strokeWidth={2} />
              <Radar name="Commission" dataKey="Commission" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} strokeWidth={2} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: 'none', 
                  borderRadius: '12px',
                  color: '#F9FAFB'
                }} 
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Additional Analysis Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Regional Performance */}
        <motion.div
          variants={chartVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.9 }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-700"
        >
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Regional Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={regionData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis type="number" stroke="#6B7280" />
              <YAxis dataKey="region" type="category" stroke="#6B7280" width={100} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: 'none', 
                  borderRadius: '12px',
                  color: '#F9FAFB'
                }} 
              />
              <Bar dataKey="amount" fill="#EC4899" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Customer Type Analysis */}
        <motion.div
          variants={chartVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 1.0 }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-700"
        >
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Customer Type Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={customerTypeData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="amount"
              >
                {customerTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
                <LabelList dataKey="type" position="outside" />
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

        {/* Server Performance Comparison */}
        <motion.div
          variants={chartVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 1.1 }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-700"
        >
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Server Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={serverData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="name" stroke="#6B7280" />
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
              <Bar yAxisId="left" dataKey="amount" fill="#14B8A6" radius={[8, 8, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="deals" stroke="#F59E0B" strokeWidth={4} />
            </ComposedChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Top Performers Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white"
      >
        <h2 className="text-3xl font-bold mb-8 text-center">🏆 Top Performers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <Star className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
            <h3 className="text-xl font-bold mb-2">Top Agent</h3>
            <p className="text-2xl font-bold">{agentPerformance[0]?.name || 'N/A'}</p>
            <p className="text-lg opacity-90">${agentPerformance[0]?.amount.toLocaleString() || '0'}</p>
          </div>
          <div className="text-center">
            <Crown className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
            <h3 className="text-xl font-bold mb-2">Top Closer</h3>
            <p className="text-2xl font-bold">{closerPerformance[0]?.name || 'N/A'}</p>
            <p className="text-lg opacity-90">${closerPerformance[0]?.amount.toLocaleString() || '0'}</p>
          </div>
          <div className="text-center">
            <Award className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
            <h3 className="text-xl font-bold mb-2">Best Program</h3>
            <p className="text-2xl font-bold">{programData[0]?.name || 'N/A'}</p>
            <p className="text-lg opacity-90">${programData[0]?.value.toLocaleString() || '0'}</p>
          </div>
        </div>
      </motion.div>

      {/* Summary Statistics */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
        className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-700"
      >
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">📊 Summary Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {[
            { label: 'Total Records', value: filteredData.length, icon: BarChart },
            { label: 'Unique Agents', value: new Set(filteredData.map((d: SalesRow) => d.sales_agent)).size, icon: Users },
            { label: 'Unique Closers', value: new Set(filteredData.map((d: SalesRow) => d.closing_agent)).size, icon: Users },
            { label: 'Programs', value: new Set(filteredData.map((d: SalesRow) => d.product_type)).size, icon: Target },
            { label: 'Regions', value: new Set(filteredData.map((d: SalesRow) => d.country)).size, icon: Activity },
            { label: 'Avg Commission', value: `$${Math.round(totalCommission / filteredData.length || 0)}`, icon: DollarSign }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.4 + index * 0.1 }}
              className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-2xl"
            >
              <stat.icon className="w-8 h-8 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};