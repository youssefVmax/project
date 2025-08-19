'use client'

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import Papa from "papaparse"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Line,
  Area,
  ComposedChart,
} from "recharts"
import {
  TrendingUp,
  Users,
  DollarSign,
  Award,
  Calendar,
  Target,
  BarChart3,
  Activity,
  Star,
  Crown,
  ShoppingBag,
  Tag,
  Percent,
  ArrowUp,
  ArrowDown,
} from "lucide-react"

const CSV_URL = "./data/3,4,5,6,7-monthes.csv"

function parseNumber(val: string | number): number {
  const num = Number(val)
  return isNaN(num) ? 0 : num
}

interface SalesRow {
  signup_date: string
  end_Date: string
  Customer_Name: string
  email: string
  phone_Number: string
  country: string
  amount_paid: number
  paid_per_month: number
  duration_months: number
  days_used_estimated: number
  sales_agent: string
  closing_agent: string
  sales_team: string
  product_type: string
  service_tier: string
  subscription_duration: string
  data_month: string
  data_year: string
  invoice_link: string
  is_ibo_player: boolean
  is_bob_player: boolean
  is_smarters: boolean
  is_ibo_pro: boolean
  days_remaining: number
  paid_per_day: number
  duration_mean_paid: number
  agent_avg_paid: number
  is_above_avg: boolean
  paid_rank: number
  Payment: string
  end_year: string
}

function transformRow(row: any): SalesRow {
  const paymentMethod =
    row.invoice_link && row.invoice_link.toString().toLowerCase().startsWith("http") ? "PayPal" : "Website"

  return {
    signup_date: row.signup_date || "",
    end_Date: row.end_Date || "",
    Customer_Name: row.Customer_Name || "",
    email: row.email || "",
    phone_Number: row["phone Number"] || "",
    country: row.country || "",
    amount_paid: parseNumber(row.amount_paid),
    paid_per_month: parseNumber(row.paid_per_month),
    duration_months: parseNumber(row.duration_months),
    days_used_estimated: parseNumber(row.days_used_estimated),
    sales_agent: row.sales_agent || "",
    closing_agent: row.closing_agent || "",
    sales_team: row.sales_team || "",
    product_type: row.product_type || "",
    service_tier: row.service_tier || "",
    subscription_duration: row.subscription_duration || "",
    data_month: row.data_month || "",
    data_year: row.data_year || "",
    invoice_link: row.invoice_link || "",
    is_ibo_player: row.is_ibo_player === "TRUE",
    is_bob_player: row.is_bob_player === "TRUE",
    is_smarters: row.is_smarters === "TRUE",
    is_ibo_pro: row.is_ibo_pro === "TRUE",
    days_remaining: parseNumber(row.days_remaining),
    paid_per_day: parseNumber(row.paid_per_day),
    duration_mean_paid: parseNumber(row.duration_mean_paid),
    agent_avg_paid: parseNumber(row.agent_avg_paid),
    is_above_avg: row.is_above_avg === "TRUE",
    paid_rank: parseNumber(row.paid_rank),
    Payment: paymentMethod,
    end_year: row.end_year || "",
  }
}

const COLORS = [
  "#3B82F6",
  "#8B5CF6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#6366F1",
  "#EC4899",
  "#14B8A6",
  "#F97316",
  "#84CC16",
]

export default function AgentDashboard() {
  const [salesData, setSalesData] = useState<SalesRow[]>([])
  const [filteredData, setFilteredData] = useState<SalesRow[]>([])
  const [loading, setLoading] = useState(true)
  const [timeFrame, setTimeFrame] = useState<'daily' | 'weekly' | 'monthly'>('monthly')
  const [agentEmail, setAgentEmail] = useState('agent1@flashx.com') // Default agent email
  const [agentName, setAgentName] = useState('John Doe') // Default agent name
  const [profilePic, setProfilePic] = useState('/default-profile.jpg')
  const [targetProgress, setTargetProgress] = useState(0)

  // Simulated agent data mapping
  const AGENT_MAPPING = {
    'agent1@flashx.com': { name: 'John Doe', profilePic: '/agent1.jpg', salesTarget: 50000 },
    'agent2@flashx.com': { name: 'Jane Smith', profilePic: '/agent2.jpg', salesTarget: 45000 },
    'agent3@flashx.com': { name: 'Mike Johnson', profilePic: '/agent3.jpg', salesTarget: 60000 },
    'admin@flashx.com': { name: 'Admin User', profilePic: '/admin.jpg', salesTarget: 0 },
  }

  // Load CSV data from URL
  useEffect(() => {
    setLoading(true)
    fetch(CSV_URL)
      .then((response) => response.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results: Papa.ParseResult<any>) => {
            const rows: SalesRow[] = results.data
              .map((row: any) => transformRow(row))
              .filter((row: SalesRow) => row.sales_agent && row.amount_paid > 0)

            setSalesData(rows)
            setLoading(false)
          },
          error: (error: any) => {
            console.error("CSV parsing error:", error)
            setSalesData([])
            setLoading(false)
          },
        })
      })
      .catch((error) => {
        console.error("Fetch error:", error)
        setSalesData([])
        setLoading(false)
      })
  }, [])

  // Filter data by agent email
  useEffect(() => {
    if (!salesData || salesData.length === 0) return

    // Get agent name from email
    const agent = AGENT_MAPPING[agentEmail as keyof typeof AGENT_MAPPING]
    if (agent) {
      setAgentName(agent.name)
      setProfilePic(agent.profilePic)
      
      // Filter sales data for this agent
      const agentData = salesData.filter(
        (row) => row.sales_agent?.toLowerCase() === agent.name.toLowerCase()
      )
      
      setFilteredData(agentData)
      
      // Calculate sales target progress
      const totalSales = agentData.reduce((sum, item) => sum + (item.amount_paid || 0), 0)
      const progress = Math.min(100, (totalSales / agent.salesTarget) * 100)
      setTargetProgress(progress)
    }
  }, [salesData, agentEmail])

  // KPI calculations
  const totalAmount = filteredData.reduce((sum: number, item: SalesRow) => sum + (item.amount_paid || 0), 0)
  const totalDeals = filteredData.length
  const avgDealSize = totalDeals > 0 ? totalAmount / totalDeals : 0

  // Time-based sales data
  const timeBasedData = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return []

    // Group by time frame
    const groupedData: Record<string, { date: string; amount: number; deals: number }> = {}

    filteredData.forEach((item) => {
      let key = ''
      let display = ''
      
      try {
        const date = new Date(item.signup_date)
        
        if (timeFrame === 'daily') {
          key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
          display = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        } else if (timeFrame === 'weekly') {
          const weekStart = new Date(date)
          weekStart.setDate(date.getDate() - date.getDay())
          key = `${weekStart.getFullYear()}-${weekStart.getMonth() + 1}-${weekStart.getDate()}`
          display = `Wk ${Math.ceil((date.getDate() + 6 - date.getDay()) / 7)}`
        } else {
          key = `${date.getFullYear()}-${date.getMonth() + 1}`
          display = date.toLocaleDateString('en-US', { month: 'short' })
        }
        
        if (!groupedData[key]) {
          groupedData[key] = { date: display, amount: 0, deals: 0 }
        }
        
        groupedData[key].amount += item.amount_paid
        groupedData[key].deals += 1
      } catch (error) {
        console.warn('Error processing date:', item.signup_date, error)
      }
    })

    return Object.values(groupedData).sort((a, b) => a.date.localeCompare(b.date))
  }, [filteredData, timeFrame])

  // Product category data
  const productData = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return []

    const stats: Record<string, { value: number; deals: number }> = {}
    let total = 0

    filteredData.forEach((item) => {
      const product = item.product_type?.trim() || "Unknown"
      
      if (!stats[product]) stats[product] = { value: 0, deals: 0 }
      
      stats[product].value += item.amount_paid || 0
      stats[product].deals += 1
      total += item.amount_paid || 0
    })

    return Object.entries(stats)
      .map(([name, { value, deals }]) => ({
        name,
        value,
        deals,
        percentage: total > 0 ? (value / total) * 100 : 0,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5) // Top 5 products
  }, [filteredData])

  // Recent sales data
  const recentSales = useMemo(() => {
    return [...filteredData]
      .sort((a, b) => new Date(b.signup_date).getTime() - new Date(a.signup_date).getTime())
      .slice(0, 5)
  }, [filteredData])

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
        damping: 15,
      },
    },
    hover: {
      scale: 1.05,
      y: -5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
  }

  // Custom label for pie chart
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)
    
    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    )
  }

  // Simulate login redirect
  useEffect(() => {
    // In a real app, this would come from authentication context
    const userEmail = localStorage.getItem('userEmail') || 'agent1@flashx.com'
    
    if (userEmail === 'admin@flashx.com') {
      window.location.href = '/dashboard/admin'
    } else {
      setAgentEmail(userEmail)
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-xl font-semibold text-slate-700 dark:text-slate-300">Loading Agent Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 min-h-screen">
      {/* Agent Profile Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-700"
      >
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <div className="relative">
              <img 
                src={profilePic} 
                alt={agentName} 
                className="w-16 h-16 rounded-full border-4 border-white dark:border-slate-700 shadow-md"
              />
              <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{agentName}</h1>
              <p className="text-slate-600 dark:text-slate-400">{agentEmail}</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button 
              onClick={() => setTimeFrame('daily')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                timeFrame === 'daily' 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              Daily
            </button>
            <button 
              onClick={() => setTimeFrame('weekly')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                timeFrame === 'weekly' 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              Weekly
            </button>
            <button 
              onClick={() => setTimeFrame('monthly')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                timeFrame === 'monthly' 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              Monthly
            </button>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Total Sales",
            value: totalDeals,
            icon: ShoppingBag,
            color: "blue",
            description: "Closed deals this period",
            trend: "+12% from last month",
          },
          {
            title: "Total Revenue",
            value: `$${Math.round(totalAmount).toLocaleString()}`,
            icon: DollarSign,
            color: "green",
            description: "Revenue generated",
            trend: "+8% from last month",
          },
          {
            title: "Avg. Deal Size",
            value: `$${Math.round(avgDealSize).toLocaleString()}`,
            icon: Tag,
            color: "purple",
            description: "Average deal value",
            trend: "+5% from last month",
          },
          {
            title: "Conversion Rate",
            value: "78%",
            icon: Percent,
            color: "yellow",
            description: "Lead to customer ratio",
            trend: "+3% from last month",
          },
        ].map((metric, index) => (
          <motion.div
            key={metric.title}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            transition={{ delay: 0.1 + index * 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl bg-${metric.color}-100 dark:bg-${metric.color}-900/30`}>
                <metric.icon className={`w-6 h-6 text-${metric.color}-600 dark:text-${metric.color}-400`} />
              </div>
              <div className="flex items-center text-sm bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded-full">
                <ArrowUp className="w-4 h-4 mr-1" />
                <span>{metric.trend}</span>
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-2">{metric.title}</p>
            <motion.p 
              className="text-3xl font-bold text-slate-900 dark:text-white mb-1"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            >
              {metric.value}
            </motion.p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{metric.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Sales Target Progress */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-700"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Sales Target Progress</h3>
          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
            ${Math.round(totalAmount).toLocaleString()} / ${AGENT_MAPPING[agentEmail as keyof typeof AGENT_MAPPING]?.salesTarget.toLocaleString()}
          </span>
        </div>
        
        <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-4 mb-2">
          <motion.div 
            className="h-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${targetProgress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        
        <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
          <span>Start</span>
          <span className="font-bold">{Math.round(targetProgress)}%</span>
          <span>Target</span>
        </div>
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Over Time Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-700"
        >
          <div className="flex items-center space-x-3 mb-6">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Sales Performance ({timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1)})
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={timeBasedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="date" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                formatter={(value) => [`$${value}`, "Revenue"]}
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "none",
                  borderRadius: "12px",
                  color: "#F9FAFB",
                }}
              />
              <Legend />
              <Bar dataKey="amount" name="Revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Product Distribution Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-700"
        >
          <div className="flex items-center space-x-3 mb-6">
            <Tag className="w-6 h-6 text-purple-600" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Product Distribution</h3>
          </div>
          <div className="flex flex-col md:flex-row items-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={productData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  labelLine={false}
                  label={renderCustomLabel}
                >
                  {productData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number, name: string) => [`$${value}`, name]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="flex-1 mt-6 md:mt-0 space-y-2">
              {productData.map((product, index) => (
                <div
                  key={product.name}
                  className="flex justify-between items-center bg-slate-50 dark:bg-slate-700 p-3 rounded-xl"
                >
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-3" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {product.name}
                    </span>
                  </div>
                  <span className="text-green-600 font-bold">
                    ${product.value.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Sales Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-700"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <ShoppingBag className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Recent Sales</h3>
          </div>
          <span className="text-sm text-slate-500 dark:text-slate-400">Last 5 transactions</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700/50">
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Product</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {recentSales.map((sale, index) => (
                <motion.tr 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="hover:bg-slate-50 dark:hover:bg-slate-700/30"
                >
                  <td className="px-4 py-4 text-sm font-medium text-slate-900 dark:text-white">
                    {sale.Customer_Name}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300">
                    {sale.product_type}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300">
                    {new Date(sale.signup_date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4 text-sm font-semibold text-green-600">
                    ${sale.amount_paid.toFixed(2)}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {recentSales.length === 0 && (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            No recent sales data available
          </div>
        )}
      </motion.div>

      {/* Performance Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-6 text-white"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold">Performance Summary</h3>
            <p className="opacity-80">Your key performance indicators</p>
          </div>
          <div className="bg-white/20 p-2 rounded-xl">
            <Award className="w-8 h-8" />
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-xl p-4">
            <p className="text-sm opacity-80 mb-1">Conversion Rate</p>
            <p className="text-xl font-bold">78%</p>
            <div className="flex items-center mt-1 text-green-300">
              <ArrowUp className="w-4 h-4" />
              <span className="text-xs">+3.2%</span>
            </div>
          </div>
          
          <div className="bg-white/10 rounded-xl p-4">
            <p className="text-sm opacity-80 mb-1">Avg. Deal Size</p>
            <p className="text-xl font-bold">${Math.round(avgDealSize).toLocaleString()}</p>
            <div className="flex items-center mt-1 text-green-300">
              <ArrowUp className="w-4 h-4" />
              <span className="text-xs">+5.1%</span>
            </div>
          </div>
          
          <div className="bg-white/10 rounded-xl p-4">
            <p className="text-sm opacity-80 mb-1">Customer Satisfaction</p>
            <p className="text-xl font-bold">94%</p>
            <div className="flex items-center mt-1 text-green-300">
              <ArrowUp className="w-4 h-4" />
              <span className="text-xs">+2.7%</span>
            </div>
          </div>
          
          <div className="bg-white/10 rounded-xl p-4">
            <p className="text-sm opacity-80 mb-1">Repeat Customers</p>
            <p className="text-xl font-bold">42%</p>
            <div className="flex items-center mt-1 text-red-300">
              <ArrowDown className="w-4 h-4" />
              <span className="text-xs">-1.3%</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}