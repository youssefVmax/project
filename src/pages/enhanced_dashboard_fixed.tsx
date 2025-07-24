import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Papa from 'papaparse';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar, ComposedChart, Scatter, ScatterChart, LabelList,
  Treemap, FunnelChart, Funnel, LabelList as FunnelLabelList
} from 'recharts';
import {
  TrendingUp, Users, DollarSign, Award, Filter, Calendar, Target,
  BarChart2, BarChart3, PieChart as PieChartIcon, Activity, Zap, Star, Crown,
  TrendingDown, ArrowUp, ArrowDown, Equal, Save, Plus, Edit, Eye,
  Sparkles, Trophy, Medal, Flame, Rocket, Diamond, Heart, ThumbsUp,
  Brain, AlertCircle, CheckCircle, Clock, Shield, User, CreditCard
} from 'lucide-react';

const CSV_PATH = '/data/Three-month-dashboard-R.csv';

function parseNumber(val: string | number): number {
  const num = Number(val);
  return isNaN(num) ? 0 : num;
}

interface SalesRow {
  signup_date: string;
  end_date: string;
  Customer_Name: string;
  email: string;
  phone_clean: string;
  country: string;
  amount_paid: number;
  paid_per_month: number;
  duration_months: number;
  is_long_term: boolean;
  days_used_estimated: number;
  Customer_Age_Days: number;
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
  Payment: string;
}

function transformRow(row: any): SalesRow {
  // Payment method logic: if invoice_link starts with 'w' or 'W', keep same value, otherwise set to 'paypal'
  const invoiceLink = row.invoice_link || '';
  const paymentMethod = invoiceLink.toLowerCase().startsWith('w') ? invoiceLink : 'paypal';

  return {
    signup_date: row.signup_date || '',
    end_date: row.end_date || '',
    Customer_Name: row.Customer_Name || '',
    email: row.email || '',
    phone_clean: row.phone_clean || '',
    country: row.country || '',
    amount_paid: parseNumber(row.amount_paid),
    paid_per_month: parseNumber(row.paid_per_month),
    duration_months: parseNumber(row.duration_months),
    is_long_term: true, // Force all deals to be closed as requested
    days_used_estimated: parseNumber(row.days_used_estimated),
    Customer_Age_Days: parseNumber(row.Customer_Age_Days),
    sales_agent: row.sales_agent || '',
    closing_agent: row.closing_agent || '',
    sales_team: row.sales_team || '',
    product_type: row.product_type || '',
    service_tier: row.service_tier || '',
    subscription_duration: row.subscription_duration || '',
    data_month: row.data_month || '',
    data_year: row.data_year || '',
    invoice_link: invoiceLink,
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
    paid_rank: parseNumber(row.paid_rank),
    Payment: paymentMethod
  };
}

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#6366F1', '#EC4899', '#14B8A6', '#F97316', '#84CC16'];

export const EnhancedDashboard: React.FC = () => {
  const [salesData, setSalesData] = useState<SalesRow[]>([]);
  const [filteredData, setFilteredData] = useState<SalesRow[]>([]);
  const [filters, setFilters] = useState({
    Customer_Name: '',
    amount_paid: '',
    sales_agent: '',
    closing_agent: '',
    product_type: '',
    service_tier: '',
    sales_team: '',
    data_month: '',
    country: '',
    Payment: ''
  });

  // Compute programData for PieChart and legend
  const programData = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return [];
    // Aggregate by product_type
    const stats: Record<string, { value: number; deals: number }> = {};
    let total = 0;
    filteredData.forEach(item => {
      const program = item.product_type?.trim() || 'Other';
      if (!stats[program]) stats[program] = { value: 0, deals: 0 };
      stats[program].value += item.amount_paid || 0;
      stats[program].deals += 1;
      total += item.amount_paid || 0;
    });
    return Object.entries(stats).map(([name, { value, deals }]) => ({
      name,
      value,
      deals,
      percentage: total > 0 ? (value / total) * 100 : 0
    }));
  }, [filteredData]);

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

  // Get unique values for dropdown options with improved filtering - ensuring distinct names
  const getUniqueValues = (field: keyof SalesRow, topN?: number): string[] => {
    if (!salesData || salesData.length === 0) return [];
    
    // Get all values, remove duplicates, and filter out empty/null values
    const values: string[] = [...new Set(
      salesData
        .map((item: SalesRow) => item[field]?.toString().trim())
        .filter((v: string | undefined): v is string => !!v && v !== '' && v !== 'undefined' && v !== 'null')
    )].sort();
    
    if (topN && field === 'product_type') {
      // Get top N product types by revenue, group others as 'Other'
      const productRevenue: Record<string, number> = {};
      salesData.forEach(item => {
        const product = item.product_type?.trim();
        if (product && product !== '' && product !== 'undefined') {
          productRevenue[product] = (productRevenue[product] || 0) + item.amount_paid;
        }
      });
      
      const sorted = Object.entries(productRevenue)
        .sort((a, b) => b[1] - a[1])
        .slice(0, topN)
        .map(([name]) => name);
      
      return [...sorted, 'Other'];
    }
    
    return values;
  };

  const filterOptions = {
    Customer_Name: getUniqueValues('Customer_Name'),
    amount_paid: getUniqueValues('amount_paid'),
    sales_agent: getUniqueValues('sales_agent'),
    closing_agent: getUniqueValues('closing_agent'),
    product_type: getUniqueValues('product_type', 5),
    service_tier: getUniqueValues('service_tier'),
    sales_team: getUniqueValues('sales_team'),
    data_month: getUniqueValues('data_month'),
    country: getUniqueValues('country'),
    Payment: getUniqueValues('Payment')
  };

  // Apply filters with unique value handling
  useEffect(() => {
    let filtered = salesData;
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        if (key === 'Customer_Name') {
          // For customer name, use contains search (typing filter)
          filtered = filtered.filter((item: SalesRow) => 
            item.Customer_Name?.toLowerCase().includes(value.toLowerCase())
          );
        } else if (key === 'product_type' && value === 'Other') {
          const topProducts = getUniqueValues('product_type', 5).filter(p => p !== 'Other');
          filtered = filtered.filter((item: SalesRow) => 
            !topProducts.includes(item.product_type?.trim() || '')
          );
        } else {
          filtered = filtered.filter((item: SalesRow) => 
            String(item[key as keyof SalesRow])?.trim() === value
          );
        }
      }
    });
    
    setFilteredData(filtered);
  }, [filters, salesData]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev: typeof filters) => ({ ...prev, [key]: value }));
  };

  // Enhanced KPI calculations - all deals are closed
  const totalAmount = filteredData.reduce((sum: number, item: SalesRow) => sum + (item.amount_paid || 0), 0);
  const totalDeals = filteredData.length; // All deals are closed
  const avgDealSize = totalDeals > 0 ? totalAmount / totalDeals : 0;
  
  // Top agent calculation with distinct names
  const agentStats = filteredData.reduce((acc: Record<string, {amount: number, deals: number}>, item: SalesRow) => {
    const agent = item.sales_agent?.trim();
    if (agent && agent !== '') {
      if (!acc[agent]) {
        acc[agent] = { amount: 0, deals: 0 };
      }
      acc[agent].amount += item.amount_paid;
      acc[agent].deals += 1;
    }
    return acc;
  }, {});
  
  const topAgentData = Object.entries(agentStats)
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => b.amount - a.amount)[0];
  
  const topAgent = topAgentData || { name: 'N/A', amount: 0, deals: 0 };

  // Top closer calculation with distinct names
  const closerStats = filteredData.reduce((acc: Record<string, {amount: number, deals: number}>, item: SalesRow) => {
    const closer = item.closing_agent?.trim();
    if (closer && closer !== '') {
      if (!acc[closer]) {
        acc[closer] = { amount: 0, deals: 0 };
      }
      acc[closer].amount += item.amount_paid;
      acc[closer].deals += 1;
    }
    return acc;
  }, {});
  
  const topCloserData = Object.entries(closerStats)
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => b.amount - a.amount)[0];
  
  const topCloser = topCloserData || { name: 'N/A', amount: 0, deals: 0 };

  // Customer statistics calculation - FIXED
  const customerStats = filteredData.reduce((acc: Record<string, {amount: number, deals: number, duration: number}>, item: SalesRow) => {
    const customer = item.Customer_Name?.trim();
    if (customer && customer !== '') {
      if (!acc[customer]) {
        acc[customer] = { amount: 0, deals: 0, duration: 0 };
      }
      acc[customer].amount += item.amount_paid;
      acc[customer].deals += 1;
      acc[customer].duration += item.duration_months || 0;
    }
    return acc;
  }, {});

  const topCustomerData = Object.entries(customerStats)
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => b.amount - a.amount)[0];
  
  const topCustomer = topCustomerData || { name: 'N/A', amount: 0, deals: 0, duration: 0 };

  // KPI Logic: Show count if multiple records, show name if single record
  const getKpiDisplay = () => {
    if (filteredData.length > 1) {
      return {
        type: 'count',
        value: filteredData.length,
        label: 'Records Found'
      };
    } else if (filteredData.length === 1) {
      return {
        type: 'name',
        value: filteredData[0].Customer_Name || 'Unknown',
        label: 'Customer Name'
      };
    } else {
      return {
        type: 'none',
        value: 0,
        label: 'No Records'
      };
    }
  };

  const kpiDisplay = getKpiDisplay();

  // Advanced Analytics: Top Customer by Duration and Amount
  const topCustomerByDuration = Object.entries(customerStats)
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => b.duration - a.duration)[0] || { name: 'N/A', duration: 0, amount: 0, deals: 0 };

  const topCustomerByAmount = Object.entries(customerStats)
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => b.amount - a.amount)[0] || { name: 'N/A', amount: 0, duration: 0, deals: 0 };

  // Enhanced chart data with unique values
  interface AgentPerformance {
    name: string;
    amount: number;
    deals: number;
    avgDeal: number;
  }

  const agentPerformance: AgentPerformance[] = Object.entries(agentStats)
    .map(([name, stats]) => ({
      name,
      amount: stats.amount,
      deals: stats.deals,
      avgDeal: stats.amount / stats.deals
    }))
    .sort((a: AgentPerformance, b: AgentPerformance) => b.amount - a.amount)
    .slice(0, 15);

  interface CloserPerformance {
    name: string;
    amount: number;
    deals: number;
    avgDeal: number;
  }

  // Closer Performance with distinct names and top 15
  const closerPerformance: CloserPerformance[] = Object.entries(closerStats)
    .map(([name, stats]) => ({
      name,
      amount: stats.amount,
      deals: stats.deals,
      avgDeal: stats.amount / stats.deals
    }))
    .sort((a: CloserPerformance, b: CloserPerformance) => b.amount - a.amount)
    .slice(0, 15); // Top 15 as requested

  // Enhanced Date-based analysis with proper date parsing and sorting
  interface DailyData {
    date: string;
    amount: number;
    deals: number;
    formattedDate: string;
    sortDate: Date;
    cumulativeAmount: number;
    avgDealSize: number;
    weekday: string;
    monthName: string;
  }

  const dailyData: DailyData[] = useMemo(() => {
    const dailyStats: Record<string, {amount: number, deals: number, dates: Date[]}> = {};
    
    // Process each record and group by date
    filteredData.forEach(item => {
      if (item.signup_date) {
        try {
          // Parse the date properly - handle various date formats
          let parsedDate: Date;
          
          // Try different date parsing approaches
          if (item.signup_date.includes('/')) {
            // Handle MM/DD/YYYY or DD/MM/YYYY format
            const parts = item.signup_date.split('/');
            if (parts.length === 3) {
              // Assume DD/MM/YYYY format based on your data
              parsedDate = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
            } else {
              parsedDate = new Date(item.signup_date);
            }
          } else if (item.signup_date.includes('-')) {
            // Handle YYYY-MM-DD format
            parsedDate = new Date(item.signup_date);
          } else {
            // Try direct parsing
            parsedDate = new Date(item.signup_date);
          }

          // Validate the parsed date
          if (isNaN(parsedDate.getTime())) {
            console.warn(`Invalid date: ${item.signup_date}`);
            return;
          }

          // Format as DD/MM/YYYY for display
          const formattedDate = `${parsedDate.getDate().toString().padStart(2, '0')}/${(parsedDate.getMonth() + 1).toString().padStart(2, '0')}/${parsedDate.getFullYear()}`;
          
          if (!dailyStats[formattedDate]) {
            dailyStats[formattedDate] = { amount: 0, deals: 0, dates: [] };
          }
          
          dailyStats[formattedDate].amount += item.amount_paid;
          dailyStats[formattedDate].deals += 1;
          dailyStats[formattedDate].dates.push(parsedDate);
        } catch (error) {
          console.warn(`Error parsing date: ${item.signup_date}`, error);
        }
      }
    });

    // Convert to array and sort by actual date
    const sortedData = Object.entries(dailyStats)
      .map(([formattedDate, stats]) => {
        const sortDate = stats.dates[0]; // Use the first date for sorting
        return {
          date: formattedDate,
          amount: stats.amount,
          deals: stats.deals,
          formattedDate,
          sortDate,
          cumulativeAmount: 0, // Will be calculated below
          avgDealSize: stats.amount / stats.deals,
          weekday: sortDate.toLocaleDateString('en-US', { weekday: 'short' }),
          monthName: sortDate.toLocaleDateString('en-US', { month: 'short' })
        };
      })
      .sort((a, b) => a.sortDate.getTime() - b.sortDate.getTime());

    // Calculate cumulative amounts
    let cumulative = 0;
    sortedData.forEach(item => {
      cumulative += item.amount;
      item.cumulativeAmount = cumulative;
    });

    return sortedData;
  }, [filteredData]);

  const monthlyTrend = useMemo(() => {
    const monthlyStats: Record<string, { amount: number; deals: number; sortDate: Date }> = {};
    filteredData.forEach(item => {
      if (item.signup_date) {
        try {
          const parsedDate = new Date(item.signup_date);
          if (isNaN(parsedDate.getTime())) return;
          const monthKey = `${parsedDate.getFullYear()}-${(parsedDate.getMonth() + 1).toString().padStart(2, '0')}`;
          if (!monthlyStats[monthKey]) {
            monthlyStats[monthKey] = { amount: 0, deals: 0, sortDate: new Date(parsedDate.getFullYear(), parsedDate.getMonth(), 1) };
          }
          monthlyStats[monthKey].amount += item.amount_paid;
          monthlyStats[monthKey].deals += 1;
        } catch (error) {
          // ignore parse error
        }
      }
    });
    return Object.entries(monthlyStats)
      .map(([key, data]) => ({ month: data.sortDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }), amount: data.amount, deals: data.deals, sortDate: data.sortDate }))
      .sort((a, b) => a.sortDate.getTime() - b.sortDate.getTime());
  }, [filteredData]);

  const weeklyData = useMemo(() => {
    const weeklyStats: Record<string, {amount: number, deals: number, week: string}> = {};
    
    dailyData.forEach(day => {
      const weekStart = new Date(day.sortDate);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Start of week (Sunday)
      const weekKey = `${weekStart.getDate().toString().padStart(2, '0')}/${(weekStart.getMonth() + 1).toString().padStart(2, '0')}/${weekStart.getFullYear()}`;
      
      if (!weeklyStats[weekKey]) {
        weeklyStats[weekKey] = { amount: 0, deals: 0, week: weekKey };
      }
      
      weeklyStats[weekKey].amount += day.amount;
      weeklyStats[weekKey].deals += day.deals;
    });
    
    return Object.values(weeklyStats).sort((a, b) => {
      const [dayA, monthA, yearA] = a.week.split('/').map(Number);
      const [dayB, monthB, yearB] = b.week.split('/').map(Number);
      const dateA = new Date(yearA, monthA - 1, dayA);
      const dateB = new Date(yearB, monthB - 1, dayB);
      return dateA.getTime() - dateB.getTime();
    });
  }, [dailyData]);

  // Monthly Revenue Data for Growth Chart
  const monthlyRevenueData = useMemo(() => {
    const monthlyStats: Record<string, { amount: number, deals: number, sortDate: Date }> = {};

    filteredData.forEach(item => {
      if (item.signup_date) {
        try {
          const parsedDate = new Date(item.signup_date);
          if (isNaN(parsedDate.getTime())) return;

          const monthKey = `${parsedDate.getFullYear()}-${(parsedDate.getMonth() + 1).toString().padStart(2, '0')}`;
          if (!monthlyStats[monthKey]) {
            monthlyStats[monthKey] = { amount: 0, deals: 0, sortDate: new Date(parsedDate.getFullYear(), parsedDate.getMonth(), 1) };
          }
          monthlyStats[monthKey].amount += item.amount_paid;
          monthlyStats[monthKey].deals += 1;
        } catch (error) {
          console.warn(`Error parsing date for monthly data: ${item.signup_date}`, error);
        }
      }
    });

    const sortedMonthlyData = Object.values(monthlyStats).sort((a, b) => a.sortDate.getTime() - b.sortDate.getTime());

    return sortedMonthlyData.map((data, index) => {
      const prevMonthData = sortedMonthlyData[index - 1];
      const revenueGrowth = prevMonthData ? ((data.amount - prevMonthData.amount) / prevMonthData.amount) * 100 : 0;
      return {
        month: data.sortDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        amount: data.amount,
        deals: data.deals,
        revenueGrowth: revenueGrowth.toFixed(2)
      };
    });
  }, [filteredData]);

  // Top Program and Service Tier
  const programStats = useMemo(() => {
    const stats: Record<string, { amount: number, deals: number }> = {};
    filteredData.forEach(item => {
      if (item.product_type) {
        if (!stats[item.product_type]) stats[item.product_type] = { amount: 0, deals: 0 };
        stats[item.product_type].amount += item.amount_paid;
        stats[item.product_type].deals += 1;
      }
    });
    return Object.entries(stats).map(([name, data]) => ({ name, ...data })).sort((a, b) => b.amount - a.amount);
  }, [filteredData]);

  const serviceTierStats = useMemo(() => {
    const stats: Record<string, { amount: number, deals: number }> = {};
    filteredData.forEach(item => {
      if (item.service_tier) {
        if (!stats[item.service_tier]) stats[item.service_tier] = { amount: 0, deals: 0 };
        stats[item.service_tier].amount += item.amount_paid;
        stats[item.service_tier].deals += 1;
      }
    });
    return Object.entries(stats).map(([name, data]) => ({ name, ...data })).sort((a, b) => b.amount - a.amount);
  }, [filteredData]);

  const topProgram = programStats[0] || { name: 'N/A', amount: 0, deals: 0 };
  const topServiceTier = serviceTierStats[0] || { name: 'N/A', amount: 0, deals: 0 };

  // Summary Statistics and Deep Insights
  const summaryStatistics = useMemo(() => {
    const totalRevenue = filteredData.reduce((sum, item) => sum + item.amount_paid, 0);
    const totalDeals = filteredData.length;
    const avgDailyRevenue = dailyData.length > 0 ? totalRevenue / dailyData.length : 0;
    const avgWeeklyRevenue = weeklyData.length > 0 ? totalRevenue / weeklyData.length : 0;
    const highestSingleDeal = filteredData.reduce((max, item) => Math.max(max, item.amount_paid), 0);

    const monthlyRevenueMap = new Map<string, number>();
    filteredData.forEach(item => {
      const monthKey = new Date(item.signup_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      monthlyRevenueMap.set(monthKey, (monthlyRevenueMap.get(monthKey) || 0) + item.amount_paid);
    });
    const topMonth = Array.from(monthlyRevenueMap.entries()).sort((a, b) => b[1] - a[1])[0] || ['N/A', 0];

    const dailyRevenueMap = new Map<string, number>();
    filteredData.forEach(item => {
      const dayKey = new Date(item.signup_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' });
      dailyRevenueMap.set(dayKey, (dailyRevenueMap.get(dayKey) || 0) + item.amount_paid);
    });
    const topDay = Array.from(dailyRevenueMap.entries()).sort((a, b) => b[1] - a[1])[0] || ['N/A', 0];
    
    return {
      totalRevenue,
      totalDeals,
      avgDailyRevenue,
      avgWeeklyRevenue,
      highestSingleDeal,
      topMonth,
      topDay,
      revenueGrowthTrend: monthlyRevenueData.length > 1 ? (monthlyRevenueData[monthlyRevenueData.length - 1].amount > monthlyRevenueData[0].amount ? 'Increasing' : 'Decreasing') : 'Stable'
    };
  }, [filteredData, dailyData, weeklyData, monthlyRevenueData]);
   

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    hover: {
      scale: 1.05,
      y: -5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  const chartVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 20
      }
    }
  };

  const sparkleVariants = {
    animate: {
      scale: [1, 1.2, 1],
      rotate: [0, 180, 360],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Custom label for pie chart with better visibility
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name, value }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  // Custom tooltip for daily chart
  const CustomDailyTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-800 text-white p-4 rounded-lg shadow-lg border border-slate-600">
          <p className="font-semibold text-blue-300">{`Date: ${label}`}</p>
          <p className="text-green-300">{`Revenue: $${data.amount.toLocaleString()}`}</p>
          <p className="text-yellow-300">{`Deals: ${data.deals}`}</p>
          <p className="text-purple-300">{`Avg Deal: $${Math.round(data.avgDealSize).toLocaleString()}`}</p>
          <p className="text-orange-300">{`Day: ${data.weekday}`}</p>
          <p className="text-pink-300">{`Cumulative: $${data.cumulativeAmount.toLocaleString()}`}</p>
        </div>
      );
    }
    return null;
  };

  const insights = useMemo(() => {
    const avgDealsByAgent = Object.values(agentStats).map(s => s.deals);
    const avgAmountByAgent = Object.values(agentStats).map(s => s.amount);
    
    // Find best performing day
    const bestDay = dailyData.reduce((max, day) => day.amount > max.amount ? day : max, dailyData[0] || { amount: 0, formattedDate: 'N/A', deals: 0 });
    
    // Calculate growth trends
    const firstHalf = dailyData.slice(0, Math.floor(dailyData.length / 2));
    const secondHalf = dailyData.slice(Math.floor(dailyData.length / 2));
    
    const firstHalfAvg = firstHalf.reduce((sum, day) => sum + day.amount, 0) / firstHalf.length || 0;
    const secondHalfAvg = secondHalf.reduce((sum, day) => sum + day.amount, 0) / secondHalf.length || 0;
    const growthTrend = secondHalfAvg > firstHalfAvg ? 'Increasing' : secondHalfAvg < firstHalfAvg ? 'Decreasing' : 'Stable';
    const growthPercentage = firstHalfAvg > 0 ? ((secondHalfAvg - firstHalfAvg) / firstHalfAvg * 100) : 0;
    
    return {
      topPerformingMonth: monthlyTrend.reduce((max, month) => month.amount > max.amount ? month : max, monthlyTrend[0] || { month: 'N/A', amount: 0 }),
      averageDealsPerAgent: avgDealsByAgent.length > 0 ? avgDealsByAgent.reduce((a, b) => a + b, 0) / avgDealsByAgent.length : 0,
      highestSingleDeal: Math.max(...filteredData.map(d => d.amount_paid)),
      totalAgents: Object.keys(agentStats).length,
      totalClosers: Object.keys(closerStats).length,
      conversionRate: 100, // All deals are closed
      avgDaysToClose: filteredData.reduce((sum, item) => sum + (item.Customer_Age_Days || 0), 0) / filteredData.length || 0,
      bestPerformingDay: bestDay,
      dailyAverage: dailyData.reduce((sum, day) => sum + day.amount, 0) / dailyData.length || 0,
      totalDays: dailyData.length,
      growthTrend,
      growthPercentage: Math.abs(growthPercentage),
      weeklyAverage: weeklyData.reduce((sum, week) => sum + week.amount, 0) / weeklyData.length || 0
    };
  }, [filteredData, agentStats, closerStats, monthlyTrend, dailyData, weeklyData]);

  return (
    <div className="p-6 space-y-8 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 min-h-screen">
      {/* Header with Navigation */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center space-x-2 mb-4">
          <motion.div variants={sparkleVariants} animate="animate">
            <Sparkles className="w-8 h-8 text-yellow-500" />
          </motion.div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Enhanced Sales Analytics Dashboard
          </h1>
          <motion.div variants={sparkleVariants} animate="animate">
            <Diamond className="w-8 h-8 text-purple-500" />
          </motion.div>
        </div>
        <p className="text-xl text-slate-600 dark:text-slate-400 mb-6">
          Real-time analysis with advanced insights and enhanced visualizations
        </p>
      </motion.div>

      {/* Dashboard Content */}
      <>
        {/* Enhanced Filters with Customer Name Typing */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-700"
        >
          <div className="flex items-center space-x-3 mb-6">
            <Filter className="w-6 h-6 text-blue-600" />
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Smart Filters</h3>
            <span className="text-sm text-slate-500 dark:text-slate-400">Best way to search</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {Object.entries(filters).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 capitalize">
                  {key.replace(/([A-Z])/g, ' $1')}
                </label>
                {key === 'Customer_Name' ? (
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleFilterChange(key, e.target.value)}
                    placeholder="Type customer name..."
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                ) : (
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
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Enhanced Animated KPI Cards with New KPI Logic */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          {[
            { 
              title: 'Total Revenue', 
              value: `$${(totalAmount / 1000).toFixed(1)}K`, 
              fullValue: `$${totalAmount.toLocaleString()}`, 
              icon: DollarSign, 
              color: 'blue', 
              trend: '+12%', 
              deals: `${totalDeals} closed deals`,
              gradient: 'from-blue-500 to-blue-600'
            },
            { 
              title: 'Closed Deals', 
              value: totalDeals, 
              fullValue: `All deals are closed`, 
              icon: TrendingUp, 
              color: 'orange', 
              trend: '100%', 
              deals: `conversion rate`,
              gradient: 'from-orange-500 to-red-500'
            },
            { 
              title: 'Top Agent', 
              value: topAgent.name.length > 10 ? topAgent.name.substring(0, 10) + '...' : topAgent.name, 
              fullValue: `$${topAgent.amount.toLocaleString()} • ${topAgent.deals} deals`, 
              icon: Crown, 
              color: 'pink', 
              trend: 'Leader', 
              deals: `${topAgent.deals} deals`,
              gradient: 'from-pink-500 to-rose-600'
            },
            { 
              title: 'Top Closer', 
              value: topCloser.name.length > 10 ? topCloser.name.substring(0, 10) + '...' : topCloser.name, 
              fullValue: `$${topCloser.amount.toLocaleString()} • ${topCloser.deals} deals`, 
              icon: Trophy, 
              color: 'yellow', 
              trend: 'Champion', 
              deals: `${topCloser.deals} deals`,
              gradient: 'from-yellow-500 to-amber-600'
            },
            {
              title: 'Top Customer Amount',
              value: topCustomerByAmount.name.length > 10 ? topCustomerByAmount.name.substring(0, 10) + '...' : topCustomerByAmount.name,
              fullValue: `$${topCustomerByAmount.amount.toLocaleString()} • ${topCustomerByAmount.deals} deals`,
              icon: DollarSign,
              color: 'purple',
              trend: 'Highest',
              deals: `$${topCustomerByAmount.amount.toLocaleString()}`,
              gradient: 'from-purple-500 to-purple-600'
            },
            {
              title: 'Top Customer Duration',
              value: topCustomerByDuration.name.length > 10 ? topCustomerByDuration.name.substring(0, 10) + '...' : topCustomerByDuration.name,
              fullValue: `${topCustomerByDuration.duration} months • $${topCustomerByDuration.amount.toLocaleString()}`,
              icon: Clock,
              color: 'indigo',
              trend: 'Longest',
              deals: `${topCustomerByDuration.duration} months`,
              gradient: 'from-indigo-500 to-indigo-600'
            }
          ].map((metric, index) => (
            <motion.div
              key={metric.title}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              transition={{ delay: 0.3 + index * 0.1 }}
              className="relative overflow-hidden bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-700 group"
            >
              {/* Animated background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${metric.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              {/* Floating particles effect */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-white rounded-full opacity-20"
                    animate={{
                      x: [0, 100, 0],
                      y: [0, -50, 0],
                      scale: [0, 1, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.5,
                    }}
                    style={{
                      left: `${20 + i * 30}%`,
                      top: `${50 + i * 10}%`,
                    }}
                  />
                ))}
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <motion.div 
                    className={`p-4 rounded-2xl bg-gradient-to-br ${metric.gradient}`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <metric.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <div className="text-right">
                    <motion.span 
                      className="text-sm font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {metric.trend}
                    </motion.span>
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-2">{metric.title}</p>
                <motion.p 
                  className="text-3xl font-bold text-slate-900 dark:text-white mb-1"
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {metric.value}
                </motion.p>
                <p className="text-xs text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                  {metric.deals}
                </p>
                <motion.div 
                  className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ y: 10 }}
                  whileHover={{ y: 0 }}
                >
                  <p className="text-sm text-slate-600 dark:text-slate-400">{metric.fullValue}</p>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>


        {/* Payment Methods Analysis */}
        <motion.div
          variants={chartVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-700"
        >
          <div className="flex items-center space-x-3 mb-6">
            <CreditCard className="w-6 h-6 text-green-600" />
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Payment Methods Analysis</h3>
            <span className="text-sm text-slate-500 dark:text-slate-400">Based on invoice_link processing</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(() => {
              const paymentStats: Record<string, { count: number, amount: number }> = {};
              filteredData.forEach(item => {
                const payment = item.Payment || 'Unknown';
                if (!paymentStats[payment]) {
                  paymentStats[payment] = { count: 0, amount: 0 };
                }
                paymentStats[payment].count += 1;
                paymentStats[payment].amount += item.amount_paid;
              });
              
              return Object.entries(paymentStats)
                .sort((a, b) => b[1].amount - a[1].amount)
                .slice(0, 3)
                .map(([method, stats], index) => (
                  <div key={method} className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4">
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                      {method === 'paypal' ? '💳 PayPal' : `🔗 ${method}`}
                    </h4>
                    <p className="text-2xl font-bold text-green-600">${stats.amount.toLocaleString()}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{stats.count} transactions</p>
                  </div>
                ));
            })()}
          </div>
        </motion.div>

        {/* Revenue Growth Chart */}
        <motion.div
          variants={chartVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.7 }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-700"
        >
          <div className="flex items-center space-x-3 mb-6">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Monthly Revenue Growth</h3>
            <span className="text-sm text-slate-500 dark:text-slate-400">Month-over-Month Percentage Change</span>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={monthlyRevenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
              <YAxis stroke="#6B7280" domain={['auto', 'auto']} />
              <Tooltip 
                formatter={(value: number, name: string) => name === 'revenueGrowth' ? `${value}%` : `$${value.toLocaleString()}`}
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: 'none', 
                  borderRadius: '12px',
                  color: '#F9FAFB',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                }} 
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="#8B5CF6" 
                strokeWidth={3}
                name="Monthly Revenue ($)"
              />
              <Line 
                type="monotone" 
                dataKey="revenueGrowth" 
                stroke="#10B981" 
                strokeWidth={3}
                name="Revenue Growth (%)"
                yAxisId="right"
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Enhanced Daily Revenue Analysis with Bigger Chart */}
        <motion.div
          variants={chartVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.8 }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-700"
        >
          <div className="flex items-center space-x-3 mb-6">
            <Activity className="w-6 h-6 text-blue-600" />
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Daily Revenue Analysis - Enhanced & Bigger</h3>
            <span className="text-sm text-slate-500 dark:text-slate-400">Amount-Paid by Date</span>
          </div>
          <ResponsiveContainer width="100%" height={600}>
            <ComposedChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis 
                dataKey="formattedDate" 
                stroke="#6B7280" 
                fontSize={10}
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis yAxisId="left" stroke="#6B7280" />
              <YAxis yAxisId="right" orientation="right" stroke="#6B7280" />
              <Tooltip content={<CustomDailyTooltip />} />
              <Legend />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="amount" 
                stroke="#3B82F6" 
                fill="url(#colorRevenue)" 
                strokeWidth={3}
                name="Daily Revenue ($)"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="deals" 
                stroke="#10B981" 
                strokeWidth={4}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 5 }}
                name="Daily Deals"
              />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="cumulativeAmount" 
                stroke="#EC4899" 
                strokeWidth={3}
                strokeDasharray="5 5"
                name="Cumulative Revenue"
              />
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
            </ComposedChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Enhanced Weekly Analysis - Well and Strong */}
        <motion.div
          variants={chartVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.9 }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-700"
        >
          <div className="flex items-center space-x-3 mb-6">
            <Calendar className="w-6 h-6 text-purple-600" />
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Weekly Revenue Analysis - Well & Strong</h3>
            <span className="text-sm text-slate-500 dark:text-slate-400">Week starting dates with trend analysis</span>
          </div>
          <ResponsiveContainer width="100%" height={450}>
            <ComposedChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis 
                dataKey="week" 
                stroke="#6B7280" 
                fontSize={11}
                angle={-45}
                textAnchor="end"
                height={100}
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
              <Bar 
                yAxisId="left"
                dataKey="amount" 
                fill="#8B5CF6" 
                radius={[4, 4, 0, 0]} 
                name="Weekly Revenue ($)"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="deals" 
                stroke="#10B981" 
                strokeWidth={4}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
                name="Weekly Deals"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Top Performers Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Agent Performance - Full Width, Bigger Chart */}
          <motion.div
            variants={chartVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 1.0 }}
            className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center space-x-3 mb-6">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Agent Performance (Top 15 - Real-Time Data)</h3>
            </div>
            <ResponsiveContainer width="100%" height={600}>
              <ComposedChart data={agentPerformance} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis 
                  dataKey="name" 
                  stroke="#6B7280" 
                  fontSize={10} 
                  angle={-45}
                  textAnchor="end"
                  height={120}
                />
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
                <Line yAxisId="right" type="monotone" dataKey="deals" stroke="#10B981" strokeWidth={4} name="Deals Count" />
                <Line yAxisId="left" type="monotone" dataKey="avgDeal" stroke="#EC4899" strokeWidth={3} strokeDasharray="5 5" name="Avg Deal Size ($)" />
              </ComposedChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Closer Performance - Under Agent Performance (Top 15) */}
          <motion.div
            variants={chartVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 1.1 }}
            className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Award className="w-6 h-6 text-purple-600" />
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Closer Performance (Top 15 - Real-Time Data)</h3>
            </div>
            <ResponsiveContainer width="100%" height={600}>
              <ComposedChart data={closerPerformance} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis 
                  dataKey="name" 
                  stroke="#6B7280" 
                  fontSize={10} 
                  angle={-45}
                  textAnchor="end"
                  height={120}
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
                <Bar yAxisId="left" dataKey="amount" fill="#8B5CF6" radius={[4, 4, 0, 0]} name="Revenue ($)" />
                <Line yAxisId="right" type="monotone" dataKey="deals" stroke="#10B981" strokeWidth={4} name="Deals Count" />
                <Line yAxisId="left" type="monotone" dataKey="avgDeal" stroke="#EC4899" strokeWidth={3} strokeDasharray="5 5" name="Avg Deal Size ($)" />
              </ComposedChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Top Program and Service Tier Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            variants={chartVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 1.2 }}
            className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Trophy className="w-6 h-6 text-orange-600" />
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Top Program Performance</h3>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:space-x-8">
              <ResponsiveContainer width={320} height={320}>
                <PieChart>
                  <Pie
                    data={programStats.slice(0, 5)}
                    dataKey="amount"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    labelLine={false}
                    label={renderCustomLabel}
                    isAnimationActive={true}
                  >
                    {programStats.slice(0, 5).map((entry, idx) => (
                      <Cell key={`cell-p-${entry.name}`} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number, name: string) => [`$${value.toLocaleString()}`, name]} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 mt-6 md:mt-0 space-y-2">
                {programStats.slice(0, 5).map((program, index) => (
                  <div key={program.name} className="flex justify-between items-center bg-slate-50 dark:bg-slate-700 p-2 rounded-xl">
                    <span className="font-semibold text-slate-900 dark:text-white">{index + 1}. {program.name}</span>
                    <span className="text-green-600 font-bold">${program.amount.toLocaleString()} ({program.deals} deals)</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={chartVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 1.3 }}
            className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Star className="w-6 h-6 text-yellow-600" />
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Top Service Tier Performance</h3>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:space-x-8">
              <ResponsiveContainer width={320} height={320}>
                <PieChart>
                  <Pie
                    data={serviceTierStats.slice(0, 5)}
                    dataKey="amount"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    labelLine={false}
                    label={renderCustomLabel}
                    isAnimationActive={true}
                  >
                    {serviceTierStats.slice(0, 5).map((entry, idx) => (
                      <Cell key={`cell-s-${entry.name}`} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number, name: string) => [`$${value.toLocaleString()}`, name]} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 mt-6 md:mt-0 space-y-2">
                {serviceTierStats.slice(0, 5).map((tier, index) => (
                  <div key={tier.name} className="flex justify-between items-center bg-slate-50 dark:bg-slate-700 p-2 rounded-xl">
                    <span className="font-semibold text-slate-900 dark:text-white">{index + 1}. {tier.name}</span>
                    <span className="text-green-600 font-bold">${tier.amount.toLocaleString()} ({tier.deals} deals)</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Enhanced Deep Insights Panel with Date Analysis */}
          <motion.div
            variants={chartVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 1.4 }}
            className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 text-white shadow-xl"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Eye className="w-6 h-6" />
              <h3 className="text-2xl font-bold">Enhanced Deep Insights</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white/10 rounded-xl p-4">
                <h4 className="font-semibold mb-2">🏆 Top Performing Month</h4>
                <p className="text-lg">{insights.topPerformingMonth?.month || 'N/A'}</p>
                <p className="text-sm opacity-80">${insights.topPerformingMonth?.amount.toLocaleString() || '0'}</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <h4 className="font-semibold mb-2">🎯 Best Performing Day</h4>
                <p className="text-lg">{insights.bestPerformingDay?.formattedDate || 'N/A'}</p>
                <p className="text-sm opacity-80">${insights.bestPerformingDay?.amount.toLocaleString() || '0'} • {insights.bestPerformingDay?.deals || 0} deals</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <h4 className="font-semibold mb-2">📊 Daily Average</h4>
                <p className="text-lg">${Math.round(insights.dailyAverage).toLocaleString()}</p>
                <p className="text-sm opacity-80">Over {insights.totalDays} days</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <h4 className="font-semibold mb-2">📈 Growth Trend</h4>
                <p className="text-lg">{insights.growthTrend}</p>
                <p className="text-sm opacity-80">{insights.growthPercentage.toFixed(1)}% change</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <h4 className="font-semibold mb-2">📅 Weekly Average</h4>
                <p className="text-lg">${Math.round(insights.weeklyAverage).toLocaleString()}</p>
                <p className="text-sm opacity-80">Per week</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <h4 className="font-semibold mb-2">💎 Highest Single Deal</h4>
                <p className="text-lg">${insights.highestSingleDeal.toLocaleString()}</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <h4 className="font-semibold mb-2">👥 Total Agents</h4>
                <p className="text-lg">{insights.totalAgents}</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <h4 className="font-semibold mb-2">🎯 Total Closers</h4>
                <p className="text-lg">{insights.totalClosers}</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
              <h4 className="font-semibold mb-2">
                <Clock className="w-5 h-5 mr-2" />
                Top Customer by Duration
              </h4>
              <p className="text-2xl font-bold">{topCustomerByDuration.name}</p>
              <p className="text-lg opacity-90">{topCustomerByDuration.duration} months</p>
              <p className="text-sm opacity-75">${topCustomerByDuration.amount.toLocaleString()} total amount</p>
            </div>
            <div className="bg-white/10 rounded-xl p-6">
              <h4 className="text-xl font-semibold mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Top Customer by Amount
              </h4>
              <p className="text-2xl font-bold">{topCustomerByAmount.name}</p>
              <p className="text-lg opacity-90">${topCustomerByAmount.amount.toLocaleString()}</p>
              <p className="text-sm opacity-75">{topCustomerByAmount.duration} months duration</p>
            </div>
            </div>
          </motion.div>
        </div>
        {/* Top Performers Section with Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white relative overflow-hidden"
        >
          <div className="relative z-10">
            <motion.h2 
              className="text-3xl font-bold mb-8 text-center"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🏆 Top Performers Hall of Fame
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div 
                className="text-center"
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Star className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
                </motion.div>
                <h3 className="text-xl font-bold mb-2">Top Agent</h3>
                <p className="text-2xl font-bold">{topAgent.name}</p>
                <p className="text-lg opacity-90">${topAgent.amount.toLocaleString()}</p>
                <p className="text-sm opacity-75">{topAgent.deals} deals</p>
              </motion.div>
              <motion.div 
                className="text-center"
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                >
                  <Crown className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
                </motion.div>
                <h3 className="text-xl font-bold mb-2">Top Closer</h3>
                <p className="text-2xl font-bold">{topCloser.name}</p>
                <p className="text-lg opacity-90">${topCloser.amount.toLocaleString()}</p>
                <p className="text-sm opacity-75">{topCloser.deals} deals</p>
              </motion.div>
              <motion.div 
                className="text-center"
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
                >
                  <Award className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
                </motion.div>
                <h3 className="text-xl font-bold mb-2">Best Program</h3>
                <p className="text-2xl font-bold">{programData[0]?.name || 'N/A'}</p>
                <p className="text-lg opacity-90">${programData[0]?.value.toLocaleString() || '0'}</p>
                <p className="text-sm opacity-75">{programData[0]?.deals || 0} deals</p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Summary Statistics */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-700"
        >
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">📊 Summary Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              { label: 'Total Records', value: filteredData.length, icon: BarChart },
              { label: 'Unique Agents', value: new Set(filteredData.map((d: SalesRow) => d.sales_agent?.trim()).filter(Boolean)).size, icon: Users },
              { label: 'Unique Closers', value: new Set(filteredData.map((d: SalesRow) => d.closing_agent?.trim()).filter(Boolean)).size, icon: Users },
              { label: 'Programs', value: new Set(filteredData.map((d: SalesRow) => d.product_type?.trim()).filter(Boolean)).size, icon: Target },
              { label: 'Countries', value: new Set(filteredData.map((d: SalesRow) => d.country?.trim()).filter(Boolean)).size, icon: Activity },
              { label: 'Active Days', value: dailyData.length, icon: Calendar }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                transition={{ delay: 1.7 + index * 0.1 }}
                className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-2xl hover:shadow-lg transition-all duration-200"
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <stat.icon className="w-8 h-8 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
                </motion.div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>  
      </>
    </div>
  );
};

export default EnhancedDashboard;

