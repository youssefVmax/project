import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, BarChart, Bar, ComposedChart, ScatterChart, Scatter, PieChart, Pie, Cell
} from 'recharts';
import { 
  TrendingUp, Brain, Target, Calendar, DollarSign, BarChart3, 
  Zap, AlertCircle, CheckCircle, ArrowUp, ArrowDown, Users, Clock, Shield, Award, Star,
  Crown, Activity, Package, Globe
} from 'lucide-react';

const CSV_PATH = '/data/Three-month-dashboard-R.csv';

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

function parseNumber(val: string | number): number {
  const num = Number(val);
  return isNaN(num) ? 0 : num;
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

interface MonthlyData {
  month: string;
  year: string;
  total_customers: number;
  total_revenue: number;
  avg_amount_paid: number;
  avg_duration_months: number;
  long_term_customers: number;
  ibo_players: number;
  bob_players: number;
  smarters: number;
  ibo_pro: number;
  service_premium: number;
  service_standard: number;
  service_basic: number;
  avg_customer_age_days: number;
  total_commission: number;
  unique_agents: number;
  unique_closers: number;
  countries_count: number;
}

interface PredictionData extends MonthlyData {
  confidence: number;
  type: 'historical' | 'prediction';
}

// Generate predictions based on historical trends
const generatePredictions = (historicalData: MonthlyData[], months: number): PredictionData[] => {
  if (historicalData.length === 0) return [];
  
  const predictions: PredictionData[] = [];
  const recentData = historicalData.slice(-3); // Use last 3 months for trend analysis
  
  // Calculate growth rates
  const customerGrowth = recentData.length >= 2 ? 
    (recentData[recentData.length - 1].total_customers - recentData[0].total_customers) / recentData[0].total_customers / (recentData.length - 1) : 0.05;
  const revenueGrowth = recentData.length >= 2 ? 
    (recentData[recentData.length - 1].total_revenue - recentData[0].total_revenue) / recentData[0].total_revenue / (recentData.length - 1) : 0.08;
  
  const lastMonth = historicalData[historicalData.length - 1];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  // Start predictions from July 2025 (after June 2025)
  let currentYear = 2025;
  let currentMonthIndex = 6; // July = index 6
  
  for (let i = 1; i <= months; i++) {
    // Seasonal factors - higher growth in Q4 and Q1, moderate in Q2/Q3
    const seasonalFactor = currentMonthIndex >= 9 || currentMonthIndex <= 2 ? 1.15 : 
                          currentMonthIndex >= 3 && currentMonthIndex <= 5 ? 1.05 : 0.95;
    
    const predictedCustomers = Math.round(lastMonth.total_customers * (1 + customerGrowth * i) * seasonalFactor);
    const predictedRevenue = Math.round(lastMonth.total_revenue * (1 + revenueGrowth * i) * seasonalFactor);
    const predictedAvgPaid = Math.round(predictedRevenue / predictedCustomers);
    
    // Product distribution based on historical ratios
    const iboRatio = lastMonth.ibo_players / lastMonth.total_customers;
    const bobRatio = lastMonth.bob_players / lastMonth.total_customers;
    const smartersRatio = lastMonth.smarters / lastMonth.total_customers;
    const iboProRatio = lastMonth.ibo_pro / lastMonth.total_customers;
    
    // Service tier distribution
    const premiumRatio = lastMonth.service_premium / lastMonth.total_customers;
    const standardRatio = lastMonth.service_standard / lastMonth.total_customers;
    const basicRatio = lastMonth.service_basic / lastMonth.total_customers;
    
    predictions.push({
      month: monthNames[currentMonthIndex],
      year: currentYear.toString(),
      total_customers: predictedCustomers,
      total_revenue: predictedRevenue,
      avg_amount_paid: predictedAvgPaid,
      avg_duration_months: Math.round((lastMonth.avg_duration_months + i * 0.1) * 10) / 10,
      long_term_customers: Math.round(predictedCustomers * 0.6), // Assume 60% long-term
      ibo_players: Math.round(predictedCustomers * iboRatio),
      bob_players: Math.round(predictedCustomers * bobRatio),
      smarters: Math.round(predictedCustomers * smartersRatio),
      ibo_pro: Math.round(predictedCustomers * iboProRatio),
      service_premium: Math.round(predictedCustomers * premiumRatio),
      service_standard: Math.round(predictedCustomers * standardRatio),
      service_basic: Math.round(predictedCustomers * basicRatio),
      avg_customer_age_days: Math.round(lastMonth.avg_customer_age_days + i * 3),
      total_commission: Math.round(predictedRevenue * 0.12), // Assume 12% commission rate
      unique_agents: lastMonth.unique_agents + Math.floor(i / 3), // Add agents gradually
      unique_closers: lastMonth.unique_closers + Math.floor(i / 4), // Add closers gradually
      countries_count: lastMonth.countries_count + Math.floor(i / 6), // Expand to new countries
      confidence: Math.max(0.5, 0.95 - i * 0.08), // Decreasing confidence over time
      type: 'prediction' as const
    });
    
    // Move to next month
    currentMonthIndex++;
    if (currentMonthIndex > 11) {
      currentMonthIndex = 0;
      currentYear++;
    }
  }
  
  return predictions;
};

const CustomerPrediction: React.FC = () => {
  const [salesData, setSalesData] = useState<SalesRow[]>([]);
  const [historicalData, setHistoricalData] = useState<MonthlyData[]>([]);
  const [predictionMonths, setPredictionMonths] = useState(6);
  const [selectedMetric, setSelectedMetric] = useState('total_revenue');
  const [predictions, setPredictions] = useState<PredictionData[]>([]);
  const [combinedData, setCombinedData] = useState<PredictionData[]>([]);
  const [loading, setLoading] = useState(true);

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
              .map((row: any) => transformRow(row))
              .filter((row: SalesRow) => row.sales_agent && row.amount_paid > 0 && row.data_month);
            setSalesData(rows);
            setLoading(false);
          },
          error: () => {
            setSalesData([]);
            setLoading(false);
          }
        });
      })
      .catch(() => {
        setSalesData([]);
        setLoading(false);
      });
  }, []);

  // Process historical data from CSV
  useEffect(() => {
    if (salesData.length === 0) return;

    const monthlyStats: Record<string, MonthlyData> = {};

    salesData.forEach(row => {
      const key = `${row.data_month}-${row.data_year}`;
      
      if (!monthlyStats[key]) {
        monthlyStats[key] = {
          month: row.data_month,
          year: row.data_year,
          total_customers: 0,
          total_revenue: 0,
          avg_amount_paid: 0,
          avg_duration_months: 0,
          long_term_customers: 0,
          ibo_players: 0,
          bob_players: 0,
          smarters: 0,
          ibo_pro: 0,
          service_premium: 0,
          service_standard: 0,
          service_basic: 0,
          avg_customer_age_days: 0,
          total_commission: 0,
          unique_agents: 0,
          unique_closers: 0,
          countries_count: 0
        };
      }

      const stats = monthlyStats[key];
      stats.total_customers += 1;
      stats.total_revenue += row.amount_paid;
      stats.total_commission += row.paid_per_month;
      stats.avg_duration_months += row.duration_months_cleaned;
      stats.avg_customer_age_days += row.customer_age_days;
      
      if (row.is_long_term) stats.long_term_customers += 1;
      if (row.is_ibo_player) stats.ibo_players += 1;
      if (row.is_bob_player) stats.bob_players += 1;
      if (row.is_smarters) stats.smarters += 1;
      if (row.is_ibo_pro) stats.ibo_pro += 1;
      
      // Service tier classification
      if (row.service_tier.toLowerCase().includes('premium')) stats.service_premium += 1;
      else if (row.service_tier.toLowerCase().includes('standard')) stats.service_standard += 1;
      else stats.service_basic += 1;
    });

    // Calculate averages and unique counts
    const processedData: MonthlyData[] = Object.values(monthlyStats).map(stats => {
      const monthData = salesData.filter(row => `${row.data_month}-${row.data_year}` === `${stats.month}-${stats.year}`);
      
      return {
        ...stats,
        avg_amount_paid: Math.round(stats.total_revenue / stats.total_customers),
        avg_duration_months: Math.round((stats.avg_duration_months / stats.total_customers) * 10) / 10,
        avg_customer_age_days: Math.round(stats.avg_customer_age_days / stats.total_customers),
        unique_agents: new Set(monthData.map(row => row.sales_agent)).size,
        unique_closers: new Set(monthData.map(row => row.closing_agent)).size,
        countries_count: new Set(monthData.map(row => row.country)).size
      };
    });

    // Sort by month order
    const monthOrder = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    processedData.sort((a, b) => {
      const yearDiff = parseInt(a.year) - parseInt(b.year);
      if (yearDiff !== 0) return yearDiff;
      return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
    });

    setHistoricalData(processedData);
  }, [salesData]);

  // Generate predictions when historical data or settings change
  useEffect(() => {
    if (historicalData.length === 0) return;
    
    const newPredictions = generatePredictions(historicalData, predictionMonths);
    setPredictions(newPredictions);
    
    const historicalWithType: PredictionData[] = historicalData.map(data => ({
      ...data,
      confidence: 1.0,
      type: 'historical' as const
    }));
    
    setCombinedData([...historicalWithType, ...newPredictions]);
  }, [historicalData, predictionMonths]);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-xl text-slate-600 dark:text-slate-400">Loading customer data...</p>
        </div>
      </div>
    );
  }

  // Calculate KPIs from actual data
  const totalCustomers = salesData.length;
  const totalRevenue = salesData.reduce((sum, row) => sum + row.amount_paid, 0);
  const totalCommission = salesData.reduce((sum, row) => sum + row.paid_per_month, 0);
  const avgDealSize = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;
  const closedDeals = salesData.filter(row => row.is_long_term).length; // All deals are closed as per your note
  
  // Prediction insights
  const lastActual = historicalData[historicalData.length - 1];
  const lastPrediction = predictions[predictions.length - 1];
  const totalPredictedRevenue = predictions.reduce((sum, p) => sum + p.total_revenue, 0);
  const totalPredictedCustomers = predictions.reduce((sum, p) => sum + p.total_customers, 0);
  const avgConfidence = predictions.length > 0 ? predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length : 0;

  // Top performers from actual data
  const agentStats = salesData.reduce((acc: Record<string, {revenue: number, deals: number}>, row) => {
    if (!acc[row.sales_agent]) {
      acc[row.sales_agent] = { revenue: 0, deals: 0 };
    }
    acc[row.sales_agent].revenue += row.amount_paid;
    acc[row.sales_agent].deals += 1;
    return acc;
  }, {});

  const topAgents = Object.entries(agentStats)
    .map(([name, stats]) => ({ name, ...stats, avgDeal: stats.revenue / stats.deals }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const closerStats = salesData.reduce((acc: Record<string, {revenue: number, deals: number}>, row) => {
    if (!acc[row.closing_agent]) {
      acc[row.closing_agent] = { revenue: 0, deals: 0 };
    }
    acc[row.closing_agent].revenue += row.amount_paid;
    acc[row.closing_agent].deals += 1;
    return acc;
  }, {});

  const topClosers = Object.entries(closerStats)
    .map(([name, stats]) => ({ name, ...stats, avgDeal: stats.revenue / stats.deals }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const insights = [
    {
      title: 'Revenue Growth',
      value: lastPrediction && lastActual ? `${(((lastPrediction.total_revenue - lastActual.total_revenue) / lastActual.total_revenue) * 100).toFixed(1)}%` : '0%',
      icon: TrendingUp,
      color: 'green',
      description: 'Expected revenue growth over prediction period'
    },
    {
      title: 'New Customers',
      value: totalPredictedCustomers.toLocaleString(),
      icon: Users,
      color: 'blue',
      description: 'Total predicted new customers'
    },
    {
      title: 'Predicted Revenue',
      value: `$${(totalPredictedRevenue / 1000).toFixed(0)}K`,
      icon: DollarSign,
      color: 'purple',
      description: 'Total predicted revenue'
    },
    {
      title: 'Confidence Level',
      value: `${(avgConfidence * 100).toFixed(0)}%`,
      icon: CheckCircle,
      color: 'orange',
      description: 'Average prediction confidence'
    }
  ];

  // Product distribution for pie chart
  const productDistribution = React.useMemo(() => {
    const distribution = [
      { 
        name: 'IBO Players', 
        value: salesData.filter(row => row.is_ibo_player).length, 
        revenue: salesData.filter(row => row.is_ibo_player).reduce((sum, row) => sum + row.amount_paid, 0),
        color: '#8B5CF6' 
      },
      { 
        name: 'BOB Players', 
        value: salesData.filter(row => row.is_bob_player).length, 
        revenue: salesData.filter(row => row.is_bob_player).reduce((sum, row) => sum + row.amount_paid, 0),
        color: '#EC4899' 
      },
      { 
        name: 'Smarters', 
        value: salesData.filter(row => row.is_smarters).length, 
        revenue: salesData.filter(row => row.is_smarters).reduce((sum, row) => sum + row.amount_paid, 0),
        color: '#10B981' 
      },
      { 
        name: 'IBO Pro', 
        value: salesData.filter(row => row.is_ibo_pro).length, 
        revenue: salesData.filter(row => row.is_ibo_pro).reduce((sum, row) => sum + row.amount_paid, 0),
        color: '#F59E0B' 
      }
    ].filter(item => item.value > 0);
    
    return distribution.map(item => ({
      ...item,
      percentage: totalCustomers > 0 ? (item.value / totalCustomers) * 100 : 0,
      avgRevenue: item.value > 0 ? item.revenue / item.value : 0
    }));
  }, [salesData, totalCustomers]);

  // Service tier distribution
  const serviceTierDistribution = React.useMemo(() => {
    const tiers: Record<string, {count: number, revenue: number}> = {};
    
    salesData.forEach(row => {
      const tier = row.service_tier || 'Unknown';
      if (!tiers[tier]) {
        tiers[tier] = { count: 0, revenue: 0 };
      }
      tiers[tier].count += 1;
      tiers[tier].revenue += row.amount_paid;
    });
    
    return Object.entries(tiers).map(([name, data], index) => ({
      name,
      value: data.count,
      revenue: data.revenue,
      percentage: totalCustomers > 0 ? (data.count / totalCustomers) * 100 : 0,
      avgRevenue: data.count > 0 ? data.revenue / data.count : 0,
      color: ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#6366F1'][index % 6]
    })).sort((a, b) => b.value - a.value);
  }, [salesData, totalCustomers]);

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          Customer Analytics & Forecasting
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400">
          Advanced forecasting from July 2025 onwards based on real sales data
        </p>
      </motion.div>

      {/* Current Performance KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {[
          { title: 'Total Customers', value: totalCustomers.toLocaleString(), icon: Users, color: 'blue', description: 'All customers in database' },
          { title: 'Total Revenue', value: `$${(totalRevenue / 1000).toFixed(0)}K`, icon: DollarSign, color: 'green', description: 'Total revenue generated' },
          { title: 'Closed Deals', value: totalCustomers.toLocaleString(), icon: Target, color: 'purple', description: 'All deals are closed' },
          { title: 'Avg Deal Size', value: `$${Math.round(avgDealSize).toLocaleString()}`, icon: Award, color: 'orange', description: 'Average revenue per customer' },
          { title: 'Total Commission', value: `$${(totalCommission / 1000).toFixed(0)}K`, icon: Crown, color: 'pink', description: 'Total commission earned' }
        ].map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.1 }}
            className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-700 hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-4 rounded-2xl bg-${metric.color}-100 dark:bg-${metric.color}-900/30`}>
                <metric.icon className={`w-8 h-8 text-${metric.color}-600 dark:text-${metric.color}-400`} />
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-2">{metric.title}</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{metric.value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{metric.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-2xl border border-slate-200 dark:border-slate-700 mb-8"
      >
        <div className="flex items-center space-x-3 mb-6">
          <Brain className="w-6 h-6 text-purple-600" />
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Forecasting Settings</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              Prediction Period (Months)
            </label>
            <select
              value={predictionMonths}
              onChange={(e) => setPredictionMonths(Number(e.target.value))}
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value={3}>3 Months</option>
              <option value={6}>6 Months</option>
              <option value={9}>9 Months</option>
              <option value={12}>12 Months</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              Focus Metric
            </label>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="total_revenue">Total Revenue</option>
              <option value="total_customers">New Customers</option>
              <option value="avg_amount_paid">Average Amount Paid</option>
              <option value="total_commission">Commission</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg"
            >
              Update Forecast
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Prediction Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {insights.map((insight, index) => (
          <motion.div
            key={insight.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-700 hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-4 rounded-2xl bg-${insight.color}-100 dark:bg-${insight.color}-900/30`}>
                <insight.icon className={`w-8 h-8 text-${insight.color}-600 dark:text-${insight.color}-400`} />
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-2">{insight.title}</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{insight.value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{insight.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Prediction Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-2xl border border-slate-200 dark:border-slate-700 mb-8"
      >
        <div className="flex items-center space-x-3 mb-6">
          <BarChart3 className="w-6 h-6 text-purple-600" />
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Revenue & Customer Growth Forecast</h3>
        </div>
        
        <ResponsiveContainer width="100%" height={450}>
          <ComposedChart data={combinedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis 
              dataKey={(data) => `${data.month} ${data.year}`} 
              stroke="#6B7280" 
              fontSize={11}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis yAxisId="revenue" orientation="left" stroke="#6B7280" />
            <YAxis yAxisId="customers" orientation="right" stroke="#6B7280" />
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
            <Area 
              yAxisId="revenue"
              type="monotone" 
              dataKey="total_revenue" 
              stroke="#8B5CF6" 
              fill="url(#colorRevenue)" 
              strokeWidth={3}
              name="Revenue ($)"
            />
            <Bar
              yAxisId="customers"
              dataKey="total_customers"
              fill="#EC4899"
              name="Customers"
              opacity={0.7}
            />
            <Line 
              yAxisId="revenue"
              type="monotone" 
              dataKey="total_commission" 
              stroke="#10B981" 
              strokeWidth={3}
              name="Commission ($)"
            />
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
          </ComposedChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Detailed Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Product Distribution */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-700"
        >
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
            <Package className="w-5 h-5 text-blue-500 mr-2" />
            Product Distribution
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={productDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
                  labelLine={false}
                >
                  {productDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: 'none', 
                    borderRadius: '12px',
                    color: '#F9FAFB'
                  }} 
                  formatter={(value, name, props) => [
                    `${value} customers (${props.payload.percentage.toFixed(1)}%)`,
                    name
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Product Details */}
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-900 dark:text-white">Product Details</h4>
              {productDistribution.map((product, index) => (
                <div key={product.name} className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: product.color }}
                      />
                      <span className="font-medium text-slate-900 dark:text-white">{product.name}</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {product.value} customers
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <div>Revenue: ${(product.revenue / 1000).toFixed(1)}K</div>
                    <div>Avg: ${Math.round(product.avgRevenue).toLocaleString()}</div>
                    <div>Share: {product.percentage.toFixed(1)}%</div>
                    <div>Market Position: #{index + 1}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Service Tier Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-700"
        >
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
            <Star className="w-5 h-5 text-purple-500 mr-2" />
            Service Tier Analysis
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={serviceTierDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percentage }) => `${percentage.toFixed(1)}%`}
                  labelLine={false}
                >
                  {serviceTierDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: 'none', 
                    borderRadius: '12px',
                    color: '#F9FAFB'
                  }} 
                  formatter={(value, name, props) => [
                    `${value} customers (${props.payload.percentage.toFixed(1)}%)`,
                    name
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Service Tier Details */}
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-900 dark:text-white">Service Tier Breakdown</h4>
              {serviceTierDistribution.map((tier, index) => (
                <div key={tier.name} className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: tier.color }}
                      />
                      <span className="font-medium text-slate-900 dark:text-white">{tier.name}</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {tier.value} customers
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <div>Revenue: ${(tier.revenue / 1000).toFixed(1)}K</div>
                    <div>Avg: ${Math.round(tier.avgRevenue).toLocaleString()}</div>
                    <div>Share: {tier.percentage.toFixed(1)}%</div>
                    <div>Tier Rank: #{index + 1}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Additional Analysis Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Monthly Trend */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-700"
        >
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
            <Activity className="w-5 h-5 text-green-500 mr-2" />
            Average Deal Size Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={combinedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis 
                dataKey={(data) => data.month.substring(0, 3)} 
                stroke="#6B7280" 
                fontSize={10} 
              />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: 'none', 
                  borderRadius: '12px',
                  color: '#F9FAFB'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="avg_amount_paid" 
                stroke="#10B981" 
                fill="#10B981" 
                fillOpacity={0.3}
                name="Avg Amount ($)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Confidence Analysis */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-700"
        >
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
            <Shield className="w-5 h-5 text-purple-500 mr-2" />
            Prediction Confidence
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={predictions}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis 
                dataKey={(data) => data.month.substring(0, 3)} 
                stroke="#6B7280" 
                fontSize={10}
              />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: 'none', 
                  borderRadius: '12px',
                  color: '#F9FAFB'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="confidence" 
                stroke="#8B5CF6" 
                fill="#8B5CF6" 
                fillOpacity={0.3}
                name="Confidence Level"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Top Performers Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Top Sales Agents */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.1 }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-2xl border border-slate-200 dark:border-slate-700"
        >
          <div className="flex items-center space-x-3 mb-6">
            <Award className="w-6 h-6 text-blue-600" />
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Top Sales Agents</h3>
          </div>
          
          <div className="space-y-4">
            {topAgents.slice(0, 3).map((agent, index) => (
              <motion.div
                key={agent.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.1 }}
                className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-700"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white">{agent.name}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Sales Agent</p>
                    </div>
                  </div>
                  <Star className="w-6 h-6 text-yellow-500" fill="currentColor" />
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{agent.deals}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Deals</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">${(agent.revenue / 1000).toFixed(1)}K</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Revenue</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-600">${Math.round(agent.avgDeal)}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Avg Deal</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Top Closers */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.1 }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-2xl border border-slate-200 dark:border-slate-700"
        >
          <div className="flex items-center space-x-3 mb-6">
            <Target className="w-6 h-6 text-green-600" />
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Top Closers</h3>
          </div>
          
          <div className="space-y-4">
            {topClosers.slice(0, 3).map((closer, index) => (
              <motion.div
                key={closer.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.1 }}
                className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl p-6 border border-green-200 dark:border-green-700"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white">{closer.name}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Closer</p>
                    </div>
                  </div>
                  <Star className="w-6 h-6 text-yellow-500" fill="currentColor" />
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-green-600">{closer.deals}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Deals</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">${(closer.revenue / 1000).toFixed(1)}K</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Revenue</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-600">${Math.round(closer.avgDeal)}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Avg Deal</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Agent Performance Comparison Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3 }}
        className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-2xl border border-slate-200 dark:border-slate-700 mb-8"
      >
        <div className="flex items-center space-x-3 mb-6">
          <BarChart3 className="w-6 h-6 text-orange-600" />
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Top 10 Agent Performance Analysis</h3>
        </div>
        
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={topAgents.slice(0, 10)}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis 
              dataKey="name" 
              stroke="#6B7280" 
              fontSize={10}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis yAxisId="revenue" orientation="left" stroke="#6B7280" />
            <YAxis yAxisId="deals" orientation="right" stroke="#6B7280" />
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
            <Bar
              yAxisId="revenue"
              dataKey="revenue"
              fill="#8B5CF6"
              name="Revenue ($)"
              radius={[4, 4, 0, 0]}
            />
            <Line 
              yAxisId="deals"
              type="monotone" 
              dataKey="deals" 
              stroke="#EC4899" 
              strokeWidth={3}
              name="Deals Count"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Summary Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
        className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">🔮 Customer Analytics Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <Users className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
            <h3 className="text-xl font-bold mb-2">Customer Insights</h3>
            <p className="text-lg opacity-90">
              Based on {totalCustomers} customers, expecting {totalPredictedCustomers} new customers 
              over the next {predictionMonths} months starting July 2025.
            </p>
          </div>
          <div className="text-center">
            <Shield className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
            <h3 className="text-xl font-bold mb-2">Revenue Forecast</h3>
            <p className="text-lg opacity-90">
              Projected revenue of ${(totalPredictedRevenue / 1000).toFixed(0)}K with 
              {avgConfidence > 0.8 ? ' high' : avgConfidence > 0.6 ? ' medium' : ' moderate'} confidence levels.
            </p>
          </div>
          <div className="text-center">
            <Clock className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
            <h3 className="text-xl font-bold mb-2">Performance Outlook</h3>
            <p className="text-lg opacity-90">
              Top agents and closers show consistent performance. 
              {productDistribution[0]?.name} leads product adoption.
            </p>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-white/20">
          <div className="text-center">
            <h4 className="text-lg font-semibold mb-4">Key Performance Indicators</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-2xl font-bold">${(totalPredictedRevenue / 1000).toFixed(0)}K</p>
                <p className="text-sm opacity-75">Predicted Revenue</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{totalPredictedCustomers}</p>
                <p className="text-sm opacity-75">New Customers</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{(avgConfidence * 100).toFixed(0)}%</p>
                <p className="text-sm opacity-75">Confidence</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{new Set(salesData.map(row => row.country)).size}</p>
                <p className="text-sm opacity-75">Countries</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CustomerPrediction;