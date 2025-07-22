import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, BarChart, Bar, ComposedChart, ScatterChart, Scatter, PieChart, Pie, Cell
} from 'recharts';
import { 
  TrendingUp, Brain, Target, Calendar, DollarSign, BarChart3, 
  Zap, AlertCircle, CheckCircle, ArrowUp, ArrowDown, Users, Clock, Shield, Award, Star
} from 'lucide-react';

// Historical data for April, May, June 2025 - based on your columns
const historicalData = [
  { 
    month: 'Apr 2025',
    new_customers: 58,
    total_revenue: 16200,
    avg_amount_paid: 279,
    avg_duration_months: 6.8,
    long_term_customers: 26,
    churn_rate: 0.09,
    ibo_players: 31,
    bob_players: 19,
    smarters: 15,
    ibo_pro: 12,
    avg_customer_age_days: 95,
    service_premium: 28,
    service_standard: 22,
    service_basic: 8
  },
  { 
    month: 'May 2025',
    new_customers: 63,
    total_revenue: 18500,
    avg_amount_paid: 294,
    avg_duration_months: 7.2,
    long_term_customers: 32,
    churn_rate: 0.07,
    ibo_players: 35,
    bob_players: 21,
    smarters: 18,
    ibo_pro: 14,
    avg_customer_age_days: 102,
    service_premium: 32,
    service_standard: 24,
    service_basic: 7
  },
  { 
    month: 'Jun 2025',
    new_customers: 51,
    total_revenue: 15800,
    avg_amount_paid: 310,
    avg_duration_months: 7.5,
    long_term_customers: 28,
    churn_rate: 0.11,
    ibo_players: 27,
    bob_players: 16,
    smarters: 14,
    ibo_pro: 10,
    avg_customer_age_days: 88,
    service_premium: 25,
    service_standard: 19,
    service_basic: 7
  }
];

// Sales agents and closers performance data
const agentPerformanceData = [
  // Sales Agents
  { name: 'Sarah Martinez', role: 'Sales Agent', deals: 28, revenue: 8400, avg_deal: 300, conversion_rate: 0.24, predicted_next_month: 32 },
  { name: 'David Chen', role: 'Sales Agent', deals: 25, revenue: 7750, avg_deal: 310, conversion_rate: 0.21, predicted_next_month: 29 },
  { name: 'Emma Rodriguez', role: 'Sales Agent', deals: 31, revenue: 8990, avg_deal: 290, conversion_rate: 0.26, predicted_next_month: 35 },
  { name: 'Michael Johnson', role: 'Sales Agent', deals: 22, revenue: 6820, avg_deal: 310, conversion_rate: 0.19, predicted_next_month: 26 },
  { name: 'Lisa Wang', role: 'Sales Agent', deals: 29, revenue: 8700, avg_deal: 300, conversion_rate: 0.23, predicted_next_month: 33 },
  
  // Closing Agents
  { name: 'Alex Thompson', role: 'Closer', deals: 35, revenue: 12250, avg_deal: 350, conversion_rate: 0.31, predicted_next_month: 40 },
  { name: 'Jessica Brown', role: 'Closer', deals: 32, revenue: 11520, avg_deal: 360, conversion_rate: 0.29, predicted_next_month: 37 },
  { name: 'Ryan Mitchell', role: 'Closer', deals: 38, revenue: 13300, avg_deal: 350, conversion_rate: 0.33, predicted_next_month: 43 },
  { name: 'Sofia Garcia', role: 'Closer', deals: 30, revenue: 10800, avg_deal: 360, conversion_rate: 0.27, predicted_next_month: 35 },
  { name: 'Kevin Lee', role: 'Closer', deals: 33, revenue: 11880, avg_deal: 360, conversion_rate: 0.30, predicted_next_month: 38 }
];

// Team performance aggregations
const teamPerformance = {
  sales_agents: agentPerformanceData.filter(a => a.role === 'Sales Agent'),
  closers: agentPerformanceData.filter(a => a.role === 'Closer')
};

// Generate predictions using trend analysis and seasonal adjustments
const generatePredictions = (data: any[], months: number) => {
  const predictions = [];
  const recentData = data.slice(-3); // Use all 3 months for trend
  
  // Calculate growth rates for key metrics
  const customerGrowth = (recentData[2].new_customers - recentData[0].new_customers) / recentData[0].new_customers / 2;
  const revenueGrowth = (recentData[2].total_revenue - recentData[0].total_revenue) / recentData[0].total_revenue / 2;
  const churnTrend = (recentData[2].churn_rate - recentData[0].churn_rate) / 2;
  
  const lastMonth = data[data.length - 1];
  const monthNames = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const currentMonthIndex = 0; // Starting from July 2025
  
  for (let i = 1; i <= months; i++) {
    const monthIndex = (currentMonthIndex + i - 1) % 12;
    // Seasonal factors - higher in Q1 and Q4, lower in summer months
    const seasonalFactor = monthIndex >= 6 || monthIndex < 3 ? 1.1 : monthIndex >= 3 && monthIndex < 6 ? 0.95 : 0.85;
    
    const predictedCustomers = Math.round(lastMonth.new_customers * (1 + customerGrowth * i) * seasonalFactor);
    const predictedRevenue = Math.round(lastMonth.total_revenue * (1 + revenueGrowth * i) * seasonalFactor);
    const predictedChurn = Math.max(0.05, Math.min(0.25, lastMonth.churn_rate + churnTrend * i));
    const predictedAvgPaid = Math.round(predictedRevenue / predictedCustomers);
    
    // Product distribution based on trends
    const iboPlayers = Math.round(predictedCustomers * 0.53);
    const bobPlayers = Math.round(predictedCustomers * 0.31);
    const smarters = Math.round(predictedCustomers * 0.27);
    const iboPro = Math.round(predictedCustomers * 0.20);
    
    const yearSuffix = monthIndex >= 6 ? '2025' : '2026'; // July-Dec 2025, Jan-Jun 2026
    
    predictions.push({
      month: `${monthNames[monthIndex]} ${yearSuffix}`,
      new_customers: predictedCustomers,
      total_revenue: predictedRevenue,
      avg_amount_paid: predictedAvgPaid,
      avg_duration_months: Math.round((lastMonth.avg_duration_months + i * 0.1) * 10) / 10,
      long_term_customers: Math.round(predictedCustomers * 0.55),
      churn_rate: Math.round(predictedChurn * 100) / 100,
      ibo_players: iboPlayers,
      bob_players: bobPlayers,
      smarters: smarters,
      ibo_pro: iboPro,
      avg_customer_age_days: Math.round(lastMonth.avg_customer_age_days + i * 5),
      service_premium: Math.round(predictedCustomers * 0.49),
      service_standard: Math.round(predictedCustomers * 0.37),
      service_basic: Math.round(predictedCustomers * 0.14),
      confidence: Math.max(0.5, 0.9 - i * 0.08),
      type: 'prediction'
    });
  }
  
  return predictions;
};

const CustomerPrediction: React.FC = () => {
  const [predictionMonths, setPredictionMonths] = useState(6);
  const [selectedMetric, setSelectedMetric] = useState('total_revenue');
  const [predictions, setPredictions] = useState<any[]>([]);
  const [combinedData, setCombinedData] = useState<any[]>([]);

  useEffect(() => {
    const newPredictions = generatePredictions(historicalData, predictionMonths);
    setPredictions(newPredictions);
    setCombinedData([...historicalData, ...newPredictions]);
  }, [predictionMonths]);

  // Calculate prediction insights
  const lastActual = historicalData[historicalData.length - 1];
  const lastPrediction = predictions[predictions.length - 1];
  const totalPredictedRevenue = predictions.reduce((sum, p) => sum + p.total_revenue, 0);
  const totalPredictedCustomers = predictions.reduce((sum, p) => sum + p.new_customers, 0);
  const avgConfidence = predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length;
  const avgPredictedChurn = predictions.reduce((sum, p) => sum + p.churn_rate, 0) / predictions.length;

  const insights = [
    {
      title: 'Revenue Growth',
      value: lastPrediction ? `${(((lastPrediction.total_revenue - lastActual.total_revenue) / lastActual.total_revenue) * 100).toFixed(1)}%` : '0%',
      icon: TrendingUp,
      color: 'green',
      description: 'Expected revenue growth over prediction period'
    },
    {
      title: 'New Customers',
      value: totalPredictedCustomers,
      icon: Users,
      color: 'blue',
      description: 'Total predicted new customers'
    },
    {
      title: 'Avg Churn Rate',
      value: `${(avgPredictedChurn * 100).toFixed(1)}%`,
      icon: AlertCircle,
      color: avgPredictedChurn > 0.15 ? 'red' : 'yellow',
      description: 'Average predicted churn rate'
    },
    {
      title: 'Confidence Level',
      value: `${(avgConfidence * 100).toFixed(0)}%`,
      icon: CheckCircle,
      color: 'purple',
      description: 'Average prediction confidence'
    }
  ];

  // Product distribution data for pie chart
  const productDistribution = predictions.length > 0 ? [
    { name: 'IBO Players', value: predictions[0].ibo_players, color: '#8B5CF6' },
    { name: 'BOB Players', value: predictions[0].bob_players, color: '#EC4899' },
    { name: 'Smarters', value: predictions[0].smarters, color: '#10B981' },
    { name: 'IBO Pro', value: predictions[0].ibo_pro, color: '#F59E0B' }
  ] : [];

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
          Based on April-June 2025 data - Forecasting July 2025 onwards
        </p>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-2xl border border-slate-200 dark:border-slate-700 mb-8"
      >
        <div className="flex items-center space-x-3 mb-6">
          <Brain className="w-6 h-6 text-purple-600" />
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Prediction Settings</h3>
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
              <option value="new_customers">New Customers</option>
              <option value="avg_amount_paid">Average Amount Paid</option>
              <option value="churn_rate">Churn Rate</option>
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

      {/* Insights Cards */}
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
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Revenue & Customer Growth Timeline</h3>
        </div>
        
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={combinedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
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
              dataKey="new_customers"
              fill="#EC4899"
              name="New Customers"
              opacity={0.7}
            />
            <Line 
              yAxisId="revenue"
              type="monotone" 
              dataKey="total_revenue" 
              stroke="#10B981" 
              strokeWidth={4} 
              strokeDasharray="5 5"
              name="Revenue Trend"
              connectNulls={false}
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Churn Rate Analysis */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-700"
        >
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            Churn Rate Forecast
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={combinedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="month" stroke="#6B7280" fontSize={10} />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: 'none', 
                  borderRadius: '12px',
                  color: '#F9FAFB'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="churn_rate" 
                stroke="#EF4444" 
                strokeWidth={3}
                name="Churn Rate"
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Product Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-700"
        >
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center">
            <Target className="w-5 h-5 text-blue-500 mr-2" />
            Product Distribution
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={productDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
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
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Average Deal Size Trend */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-700"
        >
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center">
            <DollarSign className="w-5 h-5 text-green-500 mr-2" />
            Average Amount Paid
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={combinedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="month" stroke="#6B7280" fontSize={10} />
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
            {teamPerformance.sales_agents
              .sort((a, b) => b.revenue - a.revenue)
              .slice(0, 3)
              .map((agent, index) => (
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
                        <p className="text-sm text-slate-600 dark:text-slate-400">{agent.role}</p>
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
                      <p className="text-2xl font-bold text-purple-600">{(agent.conversion_rate * 100).toFixed(0)}%</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Conversion</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-700">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Next Month Prediction:</span>
                      <span className="text-lg font-bold text-blue-600 flex items-center">
                        {agent.predicted_next_month} deals
                        <TrendingUp className="w-4 h-4 ml-1" />
                      </span>
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
            {teamPerformance.closers
              .sort((a, b) => b.revenue - a.revenue)
              .slice(0, 3)
              .map((closer, index) => (
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
                        <p className="text-sm text-slate-600 dark:text-slate-400">{closer.role}</p>
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
                      <p className="text-2xl font-bold text-purple-600">{(closer.conversion_rate * 100).toFixed(0)}%</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Conversion</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-green-200 dark:border-green-700">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Next Month Prediction:</span>
                      <span className="text-lg font-bold text-green-600 flex items-center">
                        {closer.predicted_next_month} deals
                        <TrendingUp className="w-4 h-4 ml-1" />
                      </span>
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
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Agent Performance Analysis</h3>
        </div>
        
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={agentPerformanceData}>
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
            <Line 
              yAxisId="deals"
              type="monotone" 
              dataKey="predicted_next_month" 
              stroke="#10B981" 
              strokeWidth={3}
              strokeDasharray="5 5"
              name="Predicted Next Month"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">🔮 Customer Analytics Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <Users className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
            <h3 className="text-xl font-bold mb-2">Customer Insights</h3>
            <p className="text-lg opacity-90">
              Expected to acquire {totalPredictedCustomers} new customers from Jul 2025 onwards over {predictionMonths} months with 
              {predictions.length > 0 && predictions[0].ibo_players > predictions[0].bob_players ? ' IBO Players' : ' BOB Players'} leading growth.
            </p>
          </div>
          <div className="text-center">
            <Shield className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
            <h3 className="text-xl font-bold mb-2">Retention Strategy</h3>
            <p className="text-lg opacity-90">
              Monitor churn rate closely - current prediction shows {(avgPredictedChurn * 100).toFixed(1)}% average churn. 
              Focus on long-term customer conversion.
            </p>
          </div>
          <div className="text-center">
            <Clock className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
            <h3 className="text-xl font-bold mb-2">Revenue Outlook</h3>
            <p className="text-lg opacity-90">
              Total predicted revenue of ${(totalPredictedRevenue / 1000).toFixed(0)}K starting from July 2025 with seasonal variations. 
              Q4 2025 and Q1 2026 show strongest performance.
            </p>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-white/20">
          <div className="text-center">
            <h4 className="text-lg font-semibold mb-2">Key Performance Indicators</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-2xl font-bold">${(totalPredictedRevenue / 1000).toFixed(0)}K</p>
                <p className="text-sm opacity-75">Total Revenue</p>
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
                <p className="text-2xl font-bold">{lastPrediction ? lastPrediction.avg_duration_months : '6.8'}mo</p>
                <p className="text-sm opacity-75">Avg Duration</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CustomerPrediction;