"use client"

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
  Filter,
  Calendar,
  Target,
  BarChart3,
  Activity,
  Star,
  Crown,
  Eye,
  Sparkles,
  Trophy,
  Diamond,
  Clock,
  CreditCard,
} from "lucide-react"

const CSV_PATH = 'public/data/Three-month-dashboard-R.csv';

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
  // Payment method logic: if invoice_link starts with 'http', then it's 'PayPal', else it's 'Website'
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

// Month ordering for proper arrangement
const MONTH_ORDER = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

export default function EnhancedDashboard() {
  const [salesData, setSalesData] = useState<SalesRow[]>([])
  const [filteredData, setFilteredData] = useState<SalesRow[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    Customer_Name: "",
    amount_paid: "",
    sales_agent: "",
    closing_agent: "",
    product_type: "",
    service_tier: "",
    sales_team: "",
    data_month: "",
    country: "",
    Payment: "",
    duration_months: "",
    end_year: "",
  })

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

            console.log("Loaded data sample:", rows.slice(0, 3))
            console.log("Total rows:", rows.length)

            setSalesData(rows)
            setFilteredData(rows)
            setLoading(false)

            console.log("Sample agent stats:", Object.entries(agentStats).slice(0, 3))
            console.log("Sample closer stats:", Object.entries(closerStats).slice(0, 3))
            console.log("Sample country stats:", countryStats.slice(0, 3))
            console.log("Sample sales team stats:", salesTeamStats.slice(0, 3))
            console.log("Monthly revenue data:", monthlyRevenueData.slice(0, 3))
          },
          error: (error: any) => {
            console.error("CSV parsing error:", error)
            setSalesData([])
            setFilteredData([])
            setLoading(false)
          },
        })
      })
      .catch((error) => {
        console.error("Fetch error:", error)
        setSalesData([])
        setFilteredData([])
        setLoading(false)
      })
  }, [])

  // Compute paymentData for Payment Methods PieChart
  const paymentData = useMemo(() => {
    if (!filteredData || filteredData.length === 0)
      return [
        { name: "PayPal", value: 0, deals: 0, percentage: 0 },
        { name: "Website", value: 0, deals: 0, percentage: 0 },
      ]

    const totals: Record<string, { value: number; deals: number }> = {}
    let totalAmount = 0

    filteredData.forEach((item) => {
      const method = item.Payment
      if (!totals[method]) totals[method] = { value: 0, deals: 0 }
      totals[method].value += item.amount_paid || 0
      totals[method].deals += 1
      totalAmount += item.amount_paid || 0
    })

    return ["PayPal", "Website"].map((name) => ({
      name,
      value: totals[name]?.value || 0,
      deals: totals[name]?.deals || 0,
      percentage: totalAmount > 0 ? ((totals[name]?.value || 0) / totalAmount) * 100 : 0,
    }))
  }, [filteredData])

  // Compute programData for PieChart and legend with "Other" aggregation
  const programData = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return []

    const stats: Record<string, { value: number; deals: number }> = {}
    let total = 0

    // Get top 5 products by revenue
    const productRevenue: Record<string, number> = {}
    filteredData.forEach((item) => {
      const product = item.product_type?.trim() || "Unknown"
      productRevenue[product] = (productRevenue[product] || 0) + item.amount_paid
    })

    const topProducts = Object.entries(productRevenue)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name]) => name)

    filteredData.forEach((item) => {
      const product = item.product_type?.trim() || "Unknown"
      const displayProduct = topProducts.includes(product) ? product : "Other"

      if (!stats[displayProduct]) stats[displayProduct] = { value: 0, deals: 0 }
      stats[displayProduct].value += item.amount_paid || 0
      stats[displayProduct].deals += 1
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
  }, [filteredData])

  // Get unique values for dropdown options with proper month ordering
  const getUniqueValues = (field: keyof SalesRow): string[] => {
    if (!salesData || salesData.length === 0) return []

    let values: string[] = [
      ...new Set(
        salesData
          .map((item: SalesRow) => item[field]?.toString().trim())
          .filter((v: string | undefined): v is string => !!v && v !== "" && v !== "undefined" && v !== "null"),
      ),
    ]

    // Special handling for months - sort by actual month order
    if (field === "data_month") {
      values = values.sort((a, b) => {
        const indexA = MONTH_ORDER.indexOf(a)
        const indexB = MONTH_ORDER.indexOf(b)
        return indexA - indexB
      })
    } else {
      values = values.sort()
    }

    return values
  }

  const filterOptions = {
    Customer_Name: getUniqueValues("Customer_Name"),
    amount_paid: getUniqueValues("amount_paid"),
    sales_agent: getUniqueValues("sales_agent"),
    closing_agent: getUniqueValues("closing_agent"),
    product_type: [...getUniqueValues("product_type").slice(0, 5), "Other"], // Top 5 + Other
    service_tier: getUniqueValues("service_tier"),
    sales_team: getUniqueValues("sales_team"),
    data_month: getUniqueValues("data_month"),
    country: getUniqueValues("country"),
    Payment: ["PayPal", "Website"], // Fixed payment options
    duration_months: getUniqueValues("duration_months"),
    end_year: getUniqueValues("end_year"),
  }

  // Apply filters
  useEffect(() => {
    let filtered = salesData

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        if (key === "Customer_Name") {
          filtered = filtered.filter((item: SalesRow) =>
            item.Customer_Name?.toLowerCase().includes(value.toLowerCase()),
          )
        } else if (key === "product_type" && value === "Other") {
          // Get top 5 products
          const productRevenue: Record<string, number> = {}
          salesData.forEach((item) => {
            const product = item.product_type?.trim() || "Unknown"
            productRevenue[product] = (productRevenue[product] || 0) + item.amount_paid
          })
          const topProducts = Object.entries(productRevenue)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name]) => name)

          filtered = filtered.filter((item: SalesRow) => !topProducts.includes(item.product_type?.trim() || "Unknown"))
        } else if (key === "Payment") {
          // Filter by payment method
          filtered = filtered.filter((item: SalesRow) => item.Payment === value)
        } else {
          filtered = filtered.filter((item: SalesRow) => String(item[key as keyof SalesRow])?.trim() === value)
        }
      }
    })

    setFilteredData(filtered)
  }, [filters, salesData])

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev: typeof filters) => ({ ...prev, [key]: value }))
  }

  // KPI calculations
  const totalAmount = filteredData.reduce((sum: number, item: SalesRow) => sum + (item.amount_paid || 0), 0)
  const totalDeals = filteredData.length

  // Top team calculation
  const teamStats = filteredData.reduce((acc: Record<string, { amount: number; deals: number }>, item: SalesRow) => {
    const team = item.sales_team?.trim()
    if (team && team !== "") {
      if (!acc[team]) {
        acc[team] = { amount: 0, deals: 0 }
      }
      acc[team].amount += item.amount_paid
      acc[team].deals += 1
    }
    return acc
  }, {})

  const topTeamData = Object.entries(teamStats)
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => b.amount - a.amount)[0]

  const topTeam = topTeamData || { name: "N/A", amount: 0, deals: 0 }

  // Top agent calculation
  const agentStats = filteredData.reduce((acc: Record<string, { amount: number; deals: number }>, item: SalesRow) => {
    const agent = item.sales_agent?.trim()
    if (agent && agent !== "") {
      if (!acc[agent]) {
        acc[agent] = { amount: 0, deals: 0 }
      }
      acc[agent].amount += item.amount_paid
      acc[agent].deals += 1
    }
    return acc
  }, {})

  const topAgentData = Object.entries(agentStats)
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => b.amount - a.amount)[0]

  const topAgent = topAgentData || { name: "N/A", amount: 0, deals: 0 }

  // Top closer calculation
  const closerStats = filteredData.reduce((acc: Record<string, { amount: number; deals: number }>, item: SalesRow) => {
    const closer = item.closing_agent?.trim()
    if (closer && closer !== "") {
      if (!acc[closer]) {
        acc[closer] = { amount: 0, deals: 0 }
      }
      acc[closer].amount += item.amount_paid
      acc[closer].deals += 1
    }
    return acc
  }, {})

  const topCloserData = Object.entries(closerStats)
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => b.amount - a.amount)[0]

  const topCloser = topCloserData || { name: "N/A", amount: 0, deals: 0 }

  // Customer statistics calculation
  const customerStats = filteredData.reduce(
    (acc: Record<string, { amount: number; deals: number; duration: number }>, item: SalesRow) => {
      const customer = item.Customer_Name?.trim()
      if (customer && customer !== "") {
        if (!acc[customer]) {
          acc[customer] = { amount: 0, deals: 0, duration: 0 }
        }
        acc[customer].amount += item.amount_paid
        acc[customer].deals += 1
        acc[customer].duration += item.duration_months || 0
      }
      return acc
    },
    {},
  )

  const topCustomerByDuration = Object.entries(customerStats)
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => b.duration - a.duration)[0] || { name: "N/A", duration: 0, amount: 0, deals: 0 }

  const topCustomerByAmount = Object.entries(customerStats)
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => b.amount - a.amount)[0] || { name: "N/A", amount: 0, duration: 0, deals: 0 }

  // Enhanced chart data
  interface AgentPerformance {
    name: string
    amount: number
    deals: number
    avgDeal: number
  }

  const agentPerformance: AgentPerformance[] = Object.entries(agentStats)
    .map(([name, stats]) => ({
      name: name.length > 15 ? name.substring(0, 15) + "..." : name,
      amount: stats.amount,
      deals: stats.deals,
      avgDeal: Math.round(stats.amount / stats.deals),
    }))
    .sort((a: AgentPerformance, b: AgentPerformance) => b.amount - a.amount)
    .slice(0, 15)

  interface CloserPerformance {
    name: string
    amount: number
    deals: number
    avgDeal: number
  }

  const closerPerformance: CloserPerformance[] = Object.entries(closerStats)
    .map(([name, stats]) => ({
      name: name.length > 15 ? name.substring(0, 15) + "..." : name,
      amount: stats.amount,
      deals: stats.deals,
      avgDeal: Math.round(stats.amount / stats.deals),
    }))
    .sort((a: CloserPerformance, b: CloserPerformance) => b.amount - a.amount)
    .slice(0, 15)

  // Country Performance Data
  const countryStats = useMemo(() => {
    const stats: Record<string, { amount: number; deals: number }> = {}
    filteredData.forEach((item) => {
      if (item.country) {
        if (!stats[item.country]) stats[item.country] = { amount: 0, deals: 0 }
        stats[item.country].amount += item.amount_paid
        stats[item.country].deals += 1
      }
    })
    return Object.entries(stats)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10)
  }, [filteredData])

  // Sales Team Performance Data
  const salesTeamStats = useMemo(() => {
    const stats: Record<string, { amount: number; deals: number }> = {}
    filteredData.forEach((item) => {
      if (item.sales_team) {
        if (!stats[item.sales_team]) stats[item.sales_team] = { amount: 0, deals: 0 }
        stats[item.sales_team].amount += item.amount_paid
        stats[item.sales_team].deals += 1
      }
    })
    return Object.entries(stats)
      .map(([name, data]) => ({ name, ...data, avgDeal: data.amount / data.deals }))
      .sort((a, b) => b.amount - a.amount)
  }, [filteredData])

  // Enhanced Date-based analysis
  interface DailyData {
    date: string
    amount: number
    deals: number
    formattedDate: string
    sortDate: Date
    cumulativeAmount: number
    avgDealSize: number
    weekday: string
    monthName: string
  }

  const dailyData: DailyData[] = useMemo(() => {
    const dailyStats: Record<string, { amount: number; deals: number; dates: Date[] }> = {}

    filteredData.forEach((item) => {
      if (item.signup_date) {
        try {
          let parsedDate: Date

          if (item.signup_date.includes("/")) {
            const parts = item.signup_date.split("/")
            if (parts.length === 3) {
              parsedDate = new Date(Number.parseInt(parts[2]), Number.parseInt(parts[1]) - 1, Number.parseInt(parts[0]))
            } else {
              parsedDate = new Date(item.signup_date)
            }
          } else if (item.signup_date.includes("-")) {
            parsedDate = new Date(item.signup_date)
          } else {
            parsedDate = new Date(item.signup_date)
          }

          if (isNaN(parsedDate.getTime())) {
            return
          }

          const formattedDate = `${parsedDate.getDate().toString().padStart(2, "0")}/${(parsedDate.getMonth() + 1).toString().padStart(2, "0")}/${parsedDate.getFullYear()}`

          if (!dailyStats[formattedDate]) {
            dailyStats[formattedDate] = { amount: 0, deals: 0, dates: [] }
          }

          dailyStats[formattedDate].amount += item.amount_paid
          dailyStats[formattedDate].deals += 1
          dailyStats[formattedDate].dates.push(parsedDate)
        } catch (error) {
          console.warn(`Error parsing date: ${item.signup_date}`, error)
        }
      }
    })

    const sortedData = Object.entries(dailyStats)
      .map(([formattedDate, stats]) => {
        const sortDate = stats.dates[0]
        return {
          date: formattedDate,
          amount: stats.amount,
          deals: stats.deals,
          formattedDate,
          sortDate,
          cumulativeAmount: 0,
          avgDealSize: stats.amount / stats.deals,
          weekday: sortDate.toLocaleDateString("en-US", { weekday: "short" }),
          monthName: sortDate.toLocaleDateString("en-US", { month: "short" }),
        }
      })
      .sort((a, b) => a.sortDate.getTime() - b.sortDate.getTime())

    let cumulative = 0
    sortedData.forEach((item) => {
      cumulative += item.amount
      item.cumulativeAmount = cumulative
    })

    return sortedData
  }, [filteredData])

  const monthlyTrend = useMemo(() => {
    const monthlyStats: Record<string, { amount: number; deals: number; sortDate: Date }> = {}
    filteredData.forEach((item) => {
      if (item.signup_date) {
        try {
          const parsedDate = new Date(item.signup_date)
          if (isNaN(parsedDate.getTime())) return
          const monthKey = `${parsedDate.getFullYear()}-${(parsedDate.getMonth() + 1).toString().padStart(2, "0")}`
          if (!monthlyStats[monthKey]) {
            monthlyStats[monthKey] = {
              amount: 0,
              deals: 0,
              sortDate: new Date(parsedDate.getFullYear(), parsedDate.getMonth(), 1),
            }
          }
          monthlyStats[monthKey].amount += item.amount_paid
          monthlyStats[monthKey].deals += 1
        } catch (error) {
          // ignore parse error
        }
      }
    })
    return Object.entries(monthlyStats)
      .map(([key, data]) => ({
        month: data.sortDate.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
        amount: data.amount,
        deals: data.deals,
        sortDate: data.sortDate,
      }))
      .sort((a, b) => a.sortDate.getTime() - b.sortDate.getTime())
  }, [filteredData])

  const weeklyData = useMemo(() => {
    const weeklyStats: Record<string, { amount: number; deals: number; week: string }> = {}

    dailyData.forEach((day) => {
      const weekStart = new Date(day.sortDate)
      weekStart.setDate(weekStart.getDate() - weekStart.getDay())
      const weekKey = `${weekStart.getDate().toString().padStart(2, "0")}/${(weekStart.getMonth() + 1).toString().padStart(2, "0")}/${weekStart.getFullYear()}`

      if (!weeklyStats[weekKey]) {
        weeklyStats[weekKey] = { amount: 0, deals: 0, week: weekKey }
      }

      weeklyStats[weekKey].amount += day.amount
      weeklyStats[weekKey].deals += day.deals
    })

    return Object.values(weeklyStats).sort((a, b) => {
      const [dayA, monthA, yearA] = a.week.split("/").map(Number)
      const [dayB, monthB, yearB] = b.week.split("/").map(Number)
      const dateA = new Date(yearA, monthA - 1, dayA)
      const dateB = new Date(yearB, monthB - 1, dayB)
      return dateA.getTime() - dateB.getTime()
    })
  }, [dailyData])

  // Monthly Revenue Data for Growth Chart
  const monthlyRevenueData = useMemo(() => {
    const monthlyStats: Record<string, { amount: number; deals: number; sortDate: Date }> = {}
    filteredData.forEach((item) => {
      if (item.signup_date) {
        try {
          const parsedDate = new Date(item.signup_date)
          if (isNaN(parsedDate.getTime())) return
          const monthKey = `${parsedDate.getFullYear()}-${(parsedDate.getMonth() + 1).toString().padStart(2, "0")}`
          if (!monthlyStats[monthKey]) {
            monthlyStats[monthKey] = {
              amount: 0,
              deals: 0,
              sortDate: new Date(parsedDate.getFullYear(), parsedDate.getMonth(), 1),
            }
          }
          monthlyStats[monthKey].amount += item.amount_paid
          monthlyStats[monthKey].deals += 1
        } catch (error) {
          console.warn(`Error parsing date for monthly data: ${item.signup_date}`, error)
        }
      }
    })
    const sortedMonthlyData = Object.values(monthlyStats).sort((a, b) => a.sortDate.getTime() - b.sortDate.getTime())
    return sortedMonthlyData.map((data, index) => {
      const prevMonthData = sortedMonthlyData[index - 1]
      const revenueGrowth = prevMonthData ? ((data.amount - prevMonthData.amount) / prevMonthData.amount) * 100 : 0
      return {
        month: data.sortDate.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
        amount: data.amount,
        deals: data.deals,
        revenueGrowth: revenueGrowth.toFixed(2),
      }
    })
  }, [filteredData])

  // Top Program and Service Tier
  const programStats = useMemo(() => {
    const stats: Record<string, { amount: number; deals: number }> = {}
    filteredData.forEach((item) => {
      if (item.product_type) {
        if (!stats[item.product_type]) stats[item.product_type] = { amount: 0, deals: 0 }
        stats[item.product_type].amount += item.amount_paid
        stats[item.product_type].deals += 1
      }
    })
    return Object.entries(stats)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.amount - a.amount)
  }, [filteredData])

  const serviceTierStats = useMemo(() => {
    const stats: Record<string, { amount: number; deals: number }> = {}
    filteredData.forEach((item) => {
      if (item.service_tier) {
        if (!stats[item.service_tier]) stats[item.service_tier] = { amount: 0, deals: 0 }
        stats[item.service_tier].amount += item.amount_paid
        stats[item.service_tier].deals += 1
      }
    })
    return Object.entries(stats)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.amount - a.amount)
  }, [filteredData])

  const topProgram = programStats[0] || { name: "N/A", amount: 0, deals: 0 }
  const topServiceTier = serviceTierStats[0] || { name: "N/A", amount: 0, deals: 0 }

  const insights = useMemo(() => {
    const bestDay = dailyData.reduce(
      (max, day) => (day.amount > max.amount ? day : max),
      dailyData[0] || { amount: 0, formattedDate: "N/A", deals: 0 },
    )

    const firstHalf = dailyData.slice(0, Math.floor(dailyData.length / 2))
    const secondHalf = dailyData.slice(Math.floor(dailyData.length / 2))

    const firstHalfAvg = firstHalf.reduce((sum, day) => sum + day.amount, 0) / firstHalf.length || 0
    const secondHalfAvg = secondHalf.reduce((sum, day) => sum + day.amount, 0) / secondHalf.length || 0
    const growthTrend =
      secondHalfAvg > firstHalfAvg ? "Increasing" : secondHalfAvg < firstHalfAvg ? "Decreasing" : "Stable"
    const growthPercentage = firstHalfAvg > 0 ? ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100 : 0

    return {
      topPerformingMonth: monthlyTrend.reduce(
        (max, month) => (month.amount > max.amount ? month : max),
        monthlyTrend[0] || { month: "N/A", amount: 0 },
      ),
      bestPerformingDay: bestDay,
      dailyAverage: dailyData.reduce((sum, day) => sum + day.amount, 0) / dailyData.length || 0,
      totalDays: dailyData.length,
      growthTrend,
      growthPercentage: Math.abs(growthPercentage),
      weeklyAverage: weeklyData.reduce((sum, week) => sum + week.amount, 0) / weeklyData.length || 0,
    }
  }, [monthlyTrend, dailyData, weeklyData])

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

  const chartVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 20,
      },
    },
  }

  const sparkleVariants = {
    animate: {
      scale: [1, 1.2, 1],
      rotate: [0, 180, 360],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  // Custom label for pie chart
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name, value }: any) => {
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

  // Custom tooltip for daily chart
  const CustomDailyTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-slate-800 text-white p-4 rounded-lg shadow-lg border border-slate-600">
          <p className="font-semibold text-blue-300">{`Date: ${label}`}</p>
          <p className="text-green-300">{`Revenue: $${data.amount.toLocaleString()}`}</p>
          <p className="text-yellow-300">{`Deals: ${data.deals}`}</p>
          <p className="text-purple-300">{`Avg Deal: $${Math.round(data.avgDealSize).toLocaleString()}`}</p>
          <p className="text-orange-300">{`Day: ${data.weekday}`}</p>
          <p className="text-pink-300">{`Cumulative: $${data.cumulativeAmount.toLocaleString()}`}</p>
        </div>
      )
    }
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-xl font-semibold text-slate-700 dark:text-slate-300">Loading Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 min-h-screen">
      {/* Header with Navigation */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <motion.div variants={sparkleVariants} animate="animate">
            <Sparkles className="w-8 h-8 text-yellow-500" />
          </motion.div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            FlashX Analytics Dashboard 
          </h1>
          <motion.div variants={sparkleVariants} animate="animate">
            <Diamond className="w-8 h-8 text-purple-500" />
          </motion.div>
        </div>
        <p className="text-xl text-slate-600 dark:text-slate-400 mb-6">
          Real-time analysis with advanced insights and enhanced visualizations
        </p>
      </motion.div>

      {/* Enhanced Filters with Better Grid Layout */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-700"
      >
        <div className="flex items-center space-x-3 mb-6">
          <Filter className="w-6 h-6 text-blue-600" />
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Smart Filters</h3>
          <span className="text-sm text-slate-500 dark:text-slate-400">Perfect insight filtering system</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {Object.entries(filters).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 capitalize">
                {key.replace(/([A-Z])/g, " $1").replace(/_/g, " ")}
              </label>
              {key === "Customer_Name" ? (
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleFilterChange(key, e.target.value)}
                  placeholder="Type customer name..."
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
                />
              ) : (
                <select
                  value={value}
                  onChange={(e) => handleFilterChange(key, e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <option value="">All {key.replace(/([A-Z])/g, " $1").replace(/_/g, " ")}</option>
                  {filterOptions[key as keyof typeof filterOptions].map((option: string) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Enhanced Animated KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        {[
          {
            title: "Total Revenue",
            value: `$${(totalAmount / 1000).toFixed(1)}K`,
            fullValue: `$${totalAmount.toLocaleString()}`,
            fullName: null,
            icon: DollarSign,
            color: "blue",
            trend: "+12%",
            deals: `${totalDeals} closed deals`,
            gradient: "from-blue-500 to-blue-600",
          },
          {
            title: "Closed Deals",
            value: totalDeals,
            fullValue: `All deals are closed`,
            fullName: null,
            icon: TrendingUp,
            color: "orange",
            trend: "100%",
            deals: `conversion rate`,
            gradient: "from-orange-500 to-red-500",
          },
          {
            title: "Top Agent",
            value: topAgent.name.length > 10 ? topAgent.name.substring(0, 10) + "..." : topAgent.name,
            fullValue: `$${topAgent.amount.toLocaleString()} • ${topAgent.deals} deals`,
            fullName: topAgent.name,
            icon: Crown,
            color: "pink",
            trend: "Leader",
            deals: `${topAgent.deals} deals`,
            gradient: "from-pink-400 to-rose-500",
          },
          {
            title: "Top Closer",
            value: topCloser.name.length > 10 ? topCloser.name.substring(0, 10) + "..." : topCloser.name,
            fullValue: `$${topCloser.amount.toLocaleString()} • ${topCloser.deals} deals`,
            fullName: topCloser.name,
            icon: Trophy,
            color: "yellow",
            trend: "Champion",
            deals: `${topCloser.deals} deals`,
            gradient: "from-yellow-500 to-amber-600",
          },
          {
            title: "Top Customer Amount",
            value:
              topCustomerByAmount.name.length > 10
                ? topCustomerByAmount.name.substring(0, 10) + "..."
                : topCustomerByAmount.name,
            fullValue: `$${topCustomerByAmount.amount.toLocaleString()} • ${topCustomerByAmount.deals} deals`,
            fullName: topCustomerByAmount.name,
            icon: DollarSign,
            color: "purple",
            trend: "Highest",
            deals: `$${topCustomerByAmount.amount.toLocaleString()}`,
            gradient: "from-purple-500 to-purple-600",
          },
          {
            title: "Top Team by Amount",
            value: topTeam.name.length > 10 ? topTeam.name.substring(0, 10) + "..." : topTeam.name,
            fullValue: `$${topTeam.amount.toLocaleString()} • ${topTeam.deals} deals`,
            fullName: topTeam.name,
            icon: Users,
            color: "indigo",
            trend: "Leading",
            deals: `${topTeam.deals} deals`,
            gradient: "from-indigo-500 to-indigo-600",
          },
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
            <div
              className={`absolute inset-0 bg-gradient-to-br ${metric.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
            />

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
                    repeat: Number.POSITIVE_INFINITY,
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
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  >
                    {metric.trend}
                  </motion.span>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-2">{metric.title}</p>
              <motion.p
                className="text-3xl font-bold text-slate-900 dark:text-white mb-1"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                title={metric.fullName || undefined}
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
                {metric.fullName && metric.fullName.length > 10 && (
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-lg">
                    Full Name: {metric.fullName}
                  </p>
                )}
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

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
          <ComposedChart data={monthlyRevenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
            <YAxis yAxisId="left" stroke="#6B7280" />
            <YAxis yAxisId="right" orientation="right" stroke="#6B7280" />
            <Tooltip
              formatter={(value: number, name: string) =>
                name === "revenueGrowth" ? `${value}%` : `$${value.toLocaleString()}`
              }
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "none",
                borderRadius: "12px",
                color: "#F9FAFB",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              }}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="amount" fill="#8B5CF6" radius={[4, 4, 0, 0]} name="Monthly Revenue ($)" />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="revenueGrowth"
              stroke="#10B981"
              strokeWidth={3}
              name="Revenue Growth (%)"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Enhanced Daily Revenue Analysis */}
      <motion.div
        variants={chartVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.8 }}
        className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-700"
      >
        <div className="flex items-center space-x-3 mb-6">
          <Activity className="w-6 h-6 text-blue-600" />
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
            Daily Revenue Analysis - Enhanced & Bigger
          </h3>
          <span className="text-sm text-slate-500 dark:text-slate-400">Amount-Paid by Date</span>
        </div>
        <ResponsiveContainer width="100%" height={600}>
          <ComposedChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis dataKey="formattedDate" stroke="#6B7280" fontSize={10} angle={-45} textAnchor="end" height={100} />
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
              dot={{ fill: "#10B981", strokeWidth: 2, r: 5 }}
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
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
              </linearGradient>
            </defs>
          </ComposedChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Enhanced Weekly Analysis */}
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
            <XAxis dataKey="week" stroke="#6B7280" fontSize={11} angle={-45} textAnchor="end" height={100} />
            <YAxis yAxisId="left" stroke="#6B7280" />
            <YAxis yAxisId="right" orientation="right" stroke="#6B7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "none",
                borderRadius: "12px",
                color: "#F9FAFB",
              }}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="amount" fill="#8B5CF6" radius={[4, 4, 0, 0]} name="Weekly Revenue ($)" />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="deals"
              stroke="#10B981"
              strokeWidth={4}
              dot={{ fill: "#10B981", strokeWidth: 2, r: 6 }}
              name="Weekly Deals"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Top Performers Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Agent Performance */}
        <motion.div
          variants={chartVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 1.0 }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-700"
        >
          <div className="flex items-center space-x-3 mb-6">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              Agent Performance (Top 15 - Real-Time Data)
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={600}>
            <ComposedChart data={agentPerformance} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="name" stroke="#6B7280" fontSize={10} angle={-45} textAnchor="end" height={120} />
              <YAxis yAxisId="left" stroke="#6B7280" />
              <YAxis yAxisId="right" orientation="right" stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "none",
                  borderRadius: "12px",
                  color: "#F9FAFB",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="amount" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Revenue ($)" />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="deals"
                stroke="#10B981"
                strokeWidth={4}
                name="Deals Count"
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="avgDeal"
                stroke="#EC4899"
                strokeWidth={3}
                strokeDasharray="5 5"
                name="Avg Deal Size ($)"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Closer Performance */}
        <motion.div
          variants={chartVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 1.1 }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-700"
        >
          <div className="flex items-center space-x-3 mb-6">
            <Award className="w-6 h-6 text-purple-600" />
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              Closer Performance (Top 15 - Real-Time Data)
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={600}>
            <ComposedChart data={closerPerformance} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="name" stroke="#6B7280" fontSize={10} angle={-45} textAnchor="end" height={120} />
              <YAxis yAxisId="left" stroke="#6B7280" />
              <YAxis yAxisId="right" orientation="right" stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "none",
                  borderRadius: "12px",
                  color: "#F9FAFB",
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="amount" fill="#8B5CF6" radius={[4, 4, 0, 0]} name="Revenue ($)" />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="deals"
                stroke="#10B981"
                strokeWidth={4}
                name="Deals Count"
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="avgDeal"
                stroke="#EC4899"
                strokeWidth={3}
                strokeDasharray="5 5"
                name="Avg Deal Size ($)"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Country Performance and Sales Team Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          variants={chartVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 1.15 }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-700"
        >
          <div className="flex items-center space-x-3 mb-6">
            <Activity className="w-6 h-6 text-green-600" />
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Top Country Performance</h3>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={countryStats} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis
                dataKey="name"
                stroke="#6B7280"
                fontSize={11}
                angle={-45}
                textAnchor="end"
                height={100}
                interval={0}
              />
              <YAxis stroke="#6B7280" />
              <Tooltip
                formatter={(value: number) => [`$${value.toLocaleString()}`, "Revenue"]}
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "none",
                  borderRadius: "12px",
                  color: "#F9FAFB",
                }}
              />
              <Legend />
              <Bar dataKey="amount" fill="#10B981" radius={[4, 4, 0, 0]} name="Revenue ($)" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          variants={chartVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 1.2 }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-700"
        >
          <div className="flex items-center space-x-3 mb-6">
            <Users className="w-6 h-6 text-orange-600" />
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Sales Team Performance</h3>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={salesTeamStats} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis
                dataKey="name"
                stroke="#6B7280"
                fontSize={11}
                angle={-45}
                textAnchor="end"
                height={100}
                interval={0}
              />
              <YAxis yAxisId="left" stroke="#6B7280" />
              <YAxis yAxisId="right" orientation="right" stroke="#6B7280" />
              <Tooltip
                formatter={(value: number, name: string) => [
                  name === "deals" ? value : `$${value.toLocaleString()}`,
                  name === "deals" ? "Deals" : name === "amount" ? "Revenue" : "Avg Deal",
                ]}
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "none",
                  borderRadius: "12px",
                  color: "#F9FAFB",
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="amount" fill="#F59E0B" radius={[4, 4, 0, 0]} name="Revenue ($)" />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="deals"
                stroke="#EF4444"
                strokeWidth={3}
                dot={{ fill: "#EF4444", strokeWidth: 2, r: 4 }}
                name="Deals Count"
              />
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
          transition={{ delay: 1.25 }}
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
                  data={programData.slice(0, 6)}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  labelLine={false}
                  label={renderCustomLabel}
                  isAnimationActive={true}
                >
                  {programData.slice(0, 6).map((entry, idx) => (
                    <Cell key={`cell-p-${entry.name}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number, name: string) => [`$${value.toLocaleString()}`, name]} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 mt-6 md:mt-0 space-y-2">
              {programData.slice(0, 6).map((program, index) => (
                <div
                  key={program.name}
                  className="flex justify-between items-center bg-slate-50 dark:bg-slate-700 p-2 rounded-xl"
                >
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {index + 1}. {program.name}
                  </span>
                  <span className="text-green-600 font-bold">
                    ${program.value.toLocaleString()} ({program.deals} deals)
                  </span>
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
                <div
                  key={tier.name}
                  className="flex justify-between items-center bg-slate-50 dark:bg-slate-700 p-2 rounded-xl"
                >
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {index + 1}. {tier.name}
                  </span>
                  <span className="text-green-600 font-bold">
                    ${tier.amount.toLocaleString()} ({tier.deals} deals)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Payment Methods Distribution - Fixed with Same Color and Shape */}
      <motion.div
        variants={chartVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.6 }}
        className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-700"
      >
        <div className="flex items-center space-x-3 mb-6">
          <CreditCard className="w-6 h-6 text-green-600" />
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Payment Methods Distribution</h3>
          <span className="text-sm text-slate-500 dark:text-slate-400">PayPal vs Website payments</span>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-8">
          <ResponsiveContainer width={400} height={400}>
            <PieChart>
              <Pie
                data={paymentData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={140}
                labelLine={false}
                label={renderCustomLabel}
                isAnimationActive={true}
              >
                {paymentData.map((entry, idx) => (
                  <Cell key={`cell-payment-${entry.name}`} fill={entry.name === "PayPal" ? "#0070BA" : "#FF6B35"} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string) => [`$${value.toLocaleString()}`, name]}
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "none",
                  borderRadius: "12px",
                  color: "#F9FAFB",
                }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex-1 mt-6 lg:mt-0 space-y-4">
            {paymentData.map((payment, index) => (
              <div key={payment.name} className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-slate-900 dark:text-white flex items-center">
                    {payment.name === "PayPal" ? (
                      <>
                        <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: "#0070BA" }}></div>💳
                        PayPal
                      </>
                    ) : (
                      <>
                        <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: "#FF6B35" }}></div>🌐
                        Website
                      </>
                    )}
                  </h4>
                  <span className="text-sm text-slate-500 dark:text-slate-400">{payment.percentage.toFixed(1)}%</span>
                </div>
                <p className="text-2xl font-bold text-green-600 mb-1">${payment.value.toLocaleString()}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">{payment.deals} transactions</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Enhanced Deep Insights Panel - Removed Total Agents, Total Closers, Highest Single Deal */}
      <div className="grid grid-cols-1 gap-8">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/10 rounded-xl p-6">
              <h4 className="text-xl font-semibold mb-4 flex items-center">🏆 Top Performing Month</h4>
              <p className="text-2xl font-bold">{insights.topPerformingMonth?.month || "N/A"}</p>
              <p className="text-lg opacity-90">${insights.topPerformingMonth?.amount.toLocaleString() || "0"}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-6">
              <h4 className="text-xl font-semibold mb-4 flex items-center">🎯 Best Performing Day</h4>
              <p className="text-2xl font-bold">{insights.bestPerformingDay?.formattedDate || "N/A"}</p>
              <p className="text-lg opacity-90">
                ${insights.bestPerformingDay?.amount.toLocaleString() || "0"} • {insights.bestPerformingDay?.deals || 0}{" "}
                deals
              </p>
            </div>
            <div className="bg-white/10 rounded-xl p-6">
              <h4 className="text-xl font-semibold mb-4 flex items-center">📊 Daily Average</h4>
              <p className="text-2xl font-bold">${Math.round(insights.dailyAverage).toLocaleString()}</p>
              <p className="text-lg opacity-90">Over {insights.totalDays} days</p>
            </div>
            <div className="bg-white/10 rounded-xl p-6">
              <h4 className="text-xl font-semibold mb-4 flex items-center">📈 Growth Trend</h4>
              <p className="text-2xl font-bold">{insights.growthTrend}</p>
              <p className="text-lg opacity-90">{insights.growthPercentage.toFixed(1)}% change</p>
            </div>
            <div className="bg-white/10 rounded-xl p-6">
              <h4 className="text-xl font-semibold mb-4 flex items-center">📅 Weekly Average</h4>
              <p className="text-2xl font-bold">${Math.round(insights.weeklyAverage).toLocaleString()}</p>
              <p className="text-lg opacity-90">Per week</p>
            </div>
            <div className="bg-white/10 rounded-xl p-6">
              <h4 className="text-xl font-semibold mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Top Customer by Duration
              </h4>
              <p className="text-2xl font-bold">{topCustomerByDuration.name}</p>
              <p className="text-lg opacity-90">{topCustomerByDuration.duration} months</p>
              <p className="text-sm opacity-75">${topCustomerByDuration.amount.toLocaleString()} total amount</p>
            </div>
            <div className="bg-white/10 rounded-xl p-6">
              <h4 className="text-xl font-semibold mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Top Customer by Amount
              </h4>
              <p className="text-2xl font-bold">{topCustomerByAmount.name}</p>
              <p className="text-lg opacity-90">${topCustomerByAmount.amount.toLocaleString()}</p>
              <p className="text-sm opacity-75">{topCustomerByAmount.duration} months duration</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Top Performers Hall of Fame */}
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
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            🏆 Top Performers Hall of Fame
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div className="text-center" whileHover={{ scale: 1.05 }}>
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <Star className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
              </motion.div>
              <h3 className="text-xl font-bold mb-2">Top Agent</h3>
              <p className="text-2xl font-bold">{topAgent.name}</p>
              <p className="text-lg opacity-90">${topAgent.amount.toLocaleString()}</p>
              <p className="text-sm opacity-75">{topAgent.deals} deals</p>
            </motion.div>
            <motion.div className="text-center" whileHover={{ scale: 1.05 }}>
              <motion.div
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
              >
                <Crown className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
              </motion.div>
              <h3 className="text-xl font-bold mb-2">Top Closer</h3>
              <p className="text-2xl font-bold">{topCloser.name}</p>
              <p className="text-lg opacity-90">${topCloser.amount.toLocaleString()}</p>
              <p className="text-sm opacity-75">{topCloser.deals} deals</p>
            </motion.div>
            <motion.div className="text-center" whileHover={{ scale: 1.05 }}>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
              >
                <Award className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
              </motion.div>
              <h3 className="text-xl font-bold mb-2">Best Program</h3>
              <p className="text-2xl font-bold">{programData[0]?.name || "N/A"}</p>
              <p className="text-lg opacity-90">${programData[0]?.value.toLocaleString() || "0"}</p>
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
            { label: "Total Records", value: filteredData.length, icon: BarChart },
            {
              label: "Unique Customers",
              value: new Set(filteredData.map((d: SalesRow) => d.Customer_Name?.trim()).filter(Boolean)).size,
              icon: Users,
            },
            {
              label: "Programs",
              value: new Set(filteredData.map((d: SalesRow) => d.product_type?.trim()).filter(Boolean)).size,
              icon: Target,
            },
            {
              label: "Countries",
              value: new Set(filteredData.map((d: SalesRow) => d.country?.trim()).filter(Boolean)).size,
              icon: Activity,
            },
            { label: "Active Days", value: dailyData.length, icon: Calendar },
            {
              label: "Service Tiers",
              value: new Set(filteredData.map((d: SalesRow) => d.service_tier?.trim()).filter(Boolean)).size,
              icon: Star,
            },
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
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <stat.icon className="w-8 h-8 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
              </motion.div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
