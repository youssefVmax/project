import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, BarChart, Bar, ComposedChart, ScatterChart, Scatter
} from 'recharts';
import { 
  TrendingUp, Brain, Target, Calendar, DollarSign, BarChart3, 
  Zap, AlertCircle, CheckCircle, ArrowUp, ArrowDown
} from 'lucide-react';

// Sample historical data for prediction
const historicalData = [
  { month: 'Jan 2023', revenue: 89000, deals: 6, avgDeal: 14833 },
  { month: 'Feb 2023', revenue: 95000, deals: 7, avgDeal: 13571 },
  { month: 'Mar 2023', revenue: 102000, deals: 8, avgDeal: 12750 },
  { month: 'Apr 2023', revenue: 87000, deals: 5, avgDeal: 17400 },
  { month: 'May 2023', revenue: 118000, deals: 9, avgDeal: 13111 },
  { month: 'Jun 2023', revenue: 125000, deals: 8, avgDeal: 15625 },
  { month: 'Jul 2023', revenue: 134000, deals: 10, avgDeal: 13400 },
  { month: 'Aug 2023', revenue: 98000, deals: 6, avgDeal: 16333 },
  { month: 'Sep 2023', revenue: 142000, deals: 11, avgDeal: 12909 },
  { month: 'Oct 2023', revenue: 156000, deals: 12, avgDeal: 13000 },
  { month: 'Nov 2023', revenue: 148000, deals: 9, avgDeal: 16444 },
  { month: 'Dec 2023', revenue: 167000, deals: 13, avgDeal: 12846 },
  { month: 'Jan 2024', revenue: 120300, deals: 8, avgDeal: 15038 },
  { month: 'Feb 2024', revenue: 109700, deals: 8, avgDeal: 13713 },
  { month: 'Mar 2024', revenue: 20500, deals: 1, avgDeal: 20500 }
];

// Generate predictions using simple linear regression and seasonal adjustments
const generatePredictions = (data: any[], months: number) => {
  const predictions = [];
  const recentData = data.slice(-6); // Use last 6 months for trend
  
  // Calculate growth rates
  const revenueGrowth = (recentData[recentData.length - 1].revenue - recentData[0].revenue) / recentData[0].revenue / 6;
  const dealsGrowth = (recentData[recentData.length - 1].deals - recentData[0].deals) / recentData[0].deals / 6;
  
  const lastMonth = data[data.length - 1];
  const monthNames = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  for (let i = 1; i <= months; i++) {
    const seasonalFactor = 1 + Math.sin((i * Math.PI) / 6) * 0.1; // Seasonal variation
    const predictedRevenue = Math.round(lastMonth.revenue * (1 + revenueGrowth * i) * seasonalFactor);
    const predictedDeals = Math.round(lastMonth.deals * (1 + dealsGrowth * i) * seasonalFactor);
    const predictedAvgDeal = Math.round(predictedRevenue / predictedDeals);
    
    predictions.push({
      month: `${monthNames[i - 1]} 2024`,
      revenue: predictedRevenue,
      deals: predictedDeals,
      avgDeal: predictedAvgDeal,
      confidence: Math.max(0.6, 0.95 - i * 0.05), // Decreasing confidence over time
      type: 'prediction'
    });
  }
  
  return predictions;
};

export const Prediction: React.FC = () => {
  const [predictionMonths, setPredictionMonths] = useState(6);
  const [selectedMetric, setSelectedMetric] = useState('revenue');
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
  const totalPredictedRevenue = predictions.reduce((sum, p) => sum + p.revenue, 0);
  const avgConfidence = predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length;

  const insights = [
    {
      title: 'Revenue Growth',
      value: lastPrediction ? `${(((lastPrediction.revenue - lastActual.revenue) / lastActual.revenue) * 100).toFixed(1)}%` : '0%',
      icon: TrendingUp,
      color: 'green',
      description: 'Expected revenue growth over prediction period'
    },
    {
      title: 'Predicted Revenue',
      value: `$${(totalPredictedRevenue / 1000).toFixed(0)}K`,
      icon: DollarSign,
      color: 'blue',
      description: 'Total predicted revenue for selected period'
    },
    {
      title: 'Confidence Level',
      value: `${(avgConfidence * 100).toFixed(0)}%`,
      icon: CheckCircle,
      color: 'purple',
      description: 'Average prediction confidence'
    },
    {
      title: 'Deals Forecast',
      value: predictions.reduce((sum, p) => sum + p.deals, 0),
      icon: Target,
      color: 'orange',
      description: 'Total predicted deals'
    }
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          Sales Prediction & Forecasting
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400">
          AI-powered sales forecasting and trend analysis
        </p>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-700 mb-8"
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
              <option value="revenue">Revenue</option>
              <option value="deals">Deals Count</option>
              <option value="avgDeal">Average Deal Size</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200"
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
        className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-700 mb-8"
      >
        <div className="flex items-center space-x-3 mb-6">
          <BarChart3 className="w-6 h-6 text-purple-600" />
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Revenue Prediction Timeline</h3>
        </div>
        
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={combinedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
            <YAxis stroke="#6B7280" />
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
              type="monotone" 
              dataKey="revenue" 
              stroke="#8B5CF6" 
              fill="url(#colorRevenue)" 
              strokeWidth={3}
              name="Historical Revenue"
            />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#EC4899" 
              strokeWidth={4} 
              strokeDasharray="5 5"
              name="Predicted Revenue"
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

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Confidence Analysis */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-700"
        >
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Prediction Confidence</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={predictions}>
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
              <Area 
                type="monotone" 
                dataKey="confidence" 
                stroke="#10B981" 
                fill="#10B981" 
                fillOpacity={0.3}
                name="Confidence Level"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Deals vs Revenue Correlation */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-700"
        >
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Deals vs Revenue Forecast</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart data={predictions}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="deals" stroke="#6B7280" name="Deals" />
              <YAxis dataKey="revenue" stroke="#6B7280" name="Revenue" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: 'none', 
                  borderRadius: '12px',
                  color: '#F9FAFB'
                }} 
                cursor={{ strokeDasharray: '3 3' }}
              />
              <Scatter dataKey="revenue" fill="#F59E0B" />
            </ScatterChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Prediction Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 text-white"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">🔮 Prediction Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
            <h3 className="text-xl font-bold mb-2">Key Insights</h3>
            <p className="text-lg opacity-90">
              Revenue is expected to {lastPrediction && lastPrediction.revenue > lastActual.revenue ? 'grow' : 'decline'} 
              over the next {predictionMonths} months with seasonal variations.
            </p>
          </div>
          <div className="text-center">
            <Target className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
            <h3 className="text-xl font-bold mb-2">Recommendations</h3>
            <p className="text-lg opacity-90">
              Focus on maintaining deal quality and consider seasonal marketing strategies 
              to optimize performance.
            </p>
          </div>
          <div className="text-center">
            <Zap className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
            <h3 className="text-xl font-bold mb-2">Action Items</h3>
            <p className="text-lg opacity-90">
              Monitor actual vs predicted performance monthly and adjust strategies 
              based on confidence levels.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};