"use client"

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import Papa from 'papaparse';
// Chart components from recharts
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from 'recharts';

// Icons from lucide-react (only those actually used in the component)
import { 
  User, Mail, DollarSign, ShoppingBag, Target, TrendingUp, 
  ChevronDown, ChevronUp, ChevronRight, Eye, EyeOff, Clock,
  BarChart as BarChartIcon, PieChart as PieChartIcon, LineChart as LineChartIcon,
  ArrowUp, ArrowDown, Check as CheckIcon, MoreHorizontal, RefreshCw,
  Download, Settings, Bell, HelpCircle, LogOut, CreditCard, Users as UsersIcon,
  Home, FileText, Calendar as CalendarIcon, Clock as ClockIcon, Tag, CheckCircle,
  AlertCircle, Info, Star, Trophy, Gift, ShoppingCart, 
  Truck, Percent, TrendingDown, ThumbsUp,
  ThumbsDown, MessageSquare, Phone as PhoneIcon,
  MapPin, Globe, Flag, Briefcase, Building, Database, Cloud, Package, Activity
} from 'lucide-react';
import styled from 'styled-components';

// Type Definitions
type Timeframe = 'daily' | 'weekly' | 'monthly';

interface SalesRow {
  sales_agent: string;
  sales_team?: string;
  amount_paid: number;
  paid_rank: number;
  status: string;
  Customer_Name: string;
  product_type?: string;
  signup_date: string;
  end_Date?: string;
  email?: string;
  phone_Number?: string;
  country?: string;
  id?: string;
  is_long_term?: boolean | string;
  [key: string]: any; // For any additional dynamic properties
}

interface Agent {
  id: string;
  name: string;
  email: string;
  team: string;
  joinDate: string;
  avatar?: string;
  isActive?: boolean;
}

interface TimeframeData {
  name: string;
  value: number;
  date?: string;
  sales?: number;
  deals?: number;
  averageDeal?: number;
}

interface AgentData {
  agentInfo: {
    name: string;
    id: string;
    email: string;
    territory: string;
    joinDate: string;
  };
  currentMonth: {
    sales: number;
    deals: number;
    conversionRate: number;
    commission: number;
  };
  performance: {
    totalSales: number;
    totalDeals: number;
    averageDealSize: number;
    topProduct: string;
  };
  recentDeals: Array<{
    id: string;
    company: string;
    value: number;
    status: string;
    date: string;
  }>;
  targets: {
    monthly: number;
    quarterly: number;
    yearly: number;
  };
}

// Mock data for the dashboard
const mockAgentData: AgentData = {
  agentInfo: {
    name: 'John Doe',
    id: 'agent-1',
    email: 'john.doe@example.com',
    territory: 'North America',
    joinDate: '2022-01-15'
  },
  currentMonth: {
    sales: 12854,
    deals: 24,
    conversionRate: 42,
    commission: 2570.80
  },
  performance: {
    totalSales: 128540,
    totalDeals: 156,
    averageDealSize: 824,
    topProduct: 'Premium Package'
  },
  recentDeals: Array(5).fill(0).map((_, i) => ({
    id: `deal-${i + 1}`,
    company: `Company ${String.fromCharCode(65 + i)}`,
    value: Math.floor(Math.random() * 10000) + 1000,
    status: ['Completed', 'Pending', 'Failed'][i % 3],
    date: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]
  })),
  targets: {
    monthly: 15000,
    quarterly: 45000,
    yearly: 180000
  }
};

// Generate mock sales data for the selected timeframe
const generateTimeframeData = (timeframe: Timeframe) => {
  const now = new Date();
  const data = [];
  
  if (timeframe === 'monthly') {
    for (let i = 0; i < 6; i++) {
      const date = new Date(now);
      date.setMonth(now.getMonth() - (5 - i));
      data.push({
        name: date.toLocaleString('default', { month: 'short' }),
        value: Math.floor(Math.random() * 10000) + 5000,
        date: date.toISOString().split('T')[0]
      });
    }
  } else if (timeframe === 'weekly') {
    for (let i = 0; i < 4; i++) {
      data.push({
        name: `Week ${i + 1}`,
        value: Math.floor(Math.random() * 5000) + 2000,
        date: new Date(now.getTime() - ((3 - i) * 7 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]
      });
    }
  } else {
    // Daily
    for (let i = 0; i < 7; i++) {
      const date = new Date(now);
      date.setDate(now.getDate() - (6 - i));
      data.push({
        name: date.toLocaleString('default', { weekday: 'short' }),
        value: Math.floor(Math.random() * 2000) + 500,
        date: date.toISOString().split('T')[0]
      });
    }
  }
  
  return data;
};

// Generate mock product distribution data
const mockProductDistribution = [
  { name: 'Premium Package', value: 35 },
  { name: 'Starter Kit', value: 25 },
  { name: 'Business Suite', value: 20 },
  { name: 'Enterprise Solution', value: 15 },
  { name: 'Add-ons', value: 5 }
];

// Styled Components
const AgentSelector = styled.div`
  position: relative;
  display: inline-block;
  margin-bottom: 1.5rem;
`;

const AgentDropdown = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  z-index: 50;
  max-height: 300px;
  overflow-y: auto;
  display: ${props => props.isOpen ? 'block' : 'none'};
`;

const AgentOption = styled.div<{ isActive?: boolean }>`
  padding: 0.75rem 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: background-color 0.2s;
  background-color: ${({ isActive }) => (isActive ? '#f1f5f9' : 'transparent')};
  
  &:hover {
    background-color: #f8fafc;
  }
  
  &.active {
    background-color: #f1f5f9;
    font-weight: 500;
  }
`;

const AgentAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-weight: 600;
  font-size: 0.875rem;
`;

const AgentInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const AgentName = styled.div`
  font-weight: 500;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const AgentEmail = styled.div`
  font-size: 0.75rem;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];

const CSV_PATH = "./data/3,4,5,6,7-monthes.csv";

function parseNumber(val: string | number): number {
  const num = Number(val);
  return isNaN(num) ? 0 : num;
}

const AgentDashboard: React.FC = React.memo(() => {
  const { userEmail } = useAuth();
  const [showRevenue, setShowRevenue] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAgentDropdownOpen, setIsAgentDropdownOpen] = useState(false);
  const [timeframe, setTimeframe] = useState<Timeframe>('monthly');
  const [isLoading, setIsLoading] = useState(false); // Set to false since we're using mock data
  const [error, setError] = useState<string | null>(null);

  // Removed unused agentName
  const [timeframeData, setTimeframeData] = useState<TimeframeData[]>(generateTimeframeData('monthly'));
  const [productDistribution] = useState(mockProductDistribution);

  // Toggle revenue visibility
  const toggleRevenueVisibility = () => {
    setShowRevenue(!showRevenue);
  };

  // Generate mock data for recent sales (used in the component)
  const recentSales = Array(5).fill(0).map((_, index) => ({
    id: `sale-${index + 1}`,
    customer: `Customer ${index + 1}`,
    email: `customer${index + 1}@example.com`,
    product: `Product ${String.fromCharCode(65 + index)}`,
    category: `Category ${index % 3 + 1}`,
    amount: (Math.random() * 1000 + 100).toFixed(2),
    status: index % 3 === 0 ? 'Completed' : index % 3 === 1 ? 'Pending' : 'Failed',
    date: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)).toLocaleDateString(),
  }));

  // Use mockAgentData as the source of truth
  const agentData = mockAgentData;
  
  // Add missing properties to match the expected interface
  const enhancedAgentData = {
    ...agentData,
    currentMonth: {
      ...agentData.currentMonth,
      salesChange: 12, // Mock value
      dealsChange: 5,  // Mock value
      conversionChange: 2, // Mock value
      targetAchievement: 85 // Mock value
    }
  };

  // Get KPI data
  const kpiData = [
    {
      id: 'sales',
      label: 'Monthly Sales',
      value: showRevenue ? `$${enhancedAgentData.currentMonth.sales.toLocaleString()}` : '***',
      fullValue: `$${enhancedAgentData.currentMonth.sales.toLocaleString()}`,
      icon: DollarSign,
      change: enhancedAgentData.currentMonth.salesChange,
      changeType: enhancedAgentData.currentMonth.salesChange >= 0 ? 'increase' : 'decrease',
      changeLabel: 'vs last month',
      onClick: toggleRevenueVisibility,
    },
    {
      id: 'deals',
      label: 'Total Deals',
      value: enhancedAgentData.currentMonth.deals.toString(),
      icon: ShoppingBag,
      change: enhancedAgentData.currentMonth.dealsChange,
      changeType: enhancedAgentData.currentMonth.dealsChange >= 0 ? 'increase' : 'decrease',
      changeLabel: 'vs last month',
    },
    {
      id: 'conversion',
      label: 'Conversion Rate',
      value: `${enhancedAgentData.currentMonth.conversionRate}%`,
      icon: TrendingUp,
      change: enhancedAgentData.currentMonth.conversionChange,
      changeType: enhancedAgentData.currentMonth.conversionChange >= 0 ? 'increase' : 'decrease',
      changeLabel: 'vs last month',
    },
    {
      id: 'target',
      label: 'Target',
      value: `${enhancedAgentData.currentMonth.targetAchievement}%`,
      icon: Target,
      change: 0,
      changeType: 'neutral',
      changeLabel: 'of monthly target',
      progress: enhancedAgentData.currentMonth.targetAchievement,
    },
  ];

  // Update timeframe data when timeframe changes
  useEffect(() => {
    setTimeframeData(generateTimeframeData(timeframe));
  }, [timeframe]);

  // Extract agent name from email (e.g., alex.johnson@flashx.com -> Alex Johnson)
  // Commented out as it's not currently used
  // const agentName = useMemo(() => {
  //   if (!userEmail) return "Unknown Agent";
  //   
  //   const namePart = userEmail.split('@')[0];
  //   return namePart
  //     .split('.')
  //     .map(part => part.charAt(0).toUpperCase() + part.slice(1))
  //     .join(' ');
  // }, [userEmail]);

  // Handle agent selection
  const handleAgentSelect = (agent: Agent) => {
    setSelectedAgent(agent);
    setIsAgentDropdownOpen(false);
    setSearchTerm('');
  };

  // Extract unique agents from the data
  // Commented out as it's not currently used
  // const extractAgents = (data: SalesRow[]): Agent[] => {
  //   const agentMap = new Map<string, Agent>();
    
  //   data.forEach((row, index) => {
  //     if (row.sales_agent && !agentMap.has(row.sales_agent)) {
  //       agentMap.set(row.sales_agent, {
  //         id: `agent-${index + 1}`,
  //         name: row.sales_agent,
  //         email: row.sales_agent.toLowerCase().replace(/\s+/g, '.') + '@company.com',
  //         team: row.sales_team || 'Sales Team',
  //         joinDate: new Date(2023, 0, 1 + agentMap.size).toISOString().split('T')[0],
  //         avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(row.sales_agent)}&background=random`,
  //         isActive: true
  //       });
  //     }
  //   });
    
  //   return Array.from(agentMap.values());
  // };

  // Filter agents based on search term
  const filteredAgents = useMemo(() => {
    if (!searchTerm.trim()) return agents;
    const term = searchTerm.toLowerCase();
    return agents.filter(agent => 
      agent.name.toLowerCase().includes(term) || 
      agent.email.toLowerCase().includes(term)
    );
  }, [agents, searchTerm]);

  // Load data from CSV (commented out for now, using mock data)
  useEffect(() => {
    // Uncomment this when you want to load real data
    /*
    setIsLoading(true);
    fetch(CSV_PATH)
      .then(response => response.text())
      .then(csvText => {
        Papa.parse<SalesRow>(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const rows = results.data
              .filter((row: any) => row.sales_agent) // Filter out rows without agent
              .map((row: any) => ({
                ...row,
                amount_paid: parseNumber(row.amount_paid),
                paid_rank: parseNumber(row.paid_rank),
                status: row.status || 'Closed',
                Customer_Name: row.Customer_Name || row.customer_name || 'Unknown Customer'
              } as SalesRow));

            setRawData(rows);
            const agentsList = extractAgents(rows);
            setAgents(agentsList);
            if (agentsList.length > 0 && !selectedAgent) {
              setSelectedAgent(agentsList[0]);
            }
            setIsLoading(false);
          }
        });
      })
      .catch(error => {
        setError(error.message);
        setIsLoading(false);
      });
    */
    
    // For now, use mock data
    const mockAgents: Agent[] = [
      {
        id: 'agent-1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        team: 'Sales Team',
        joinDate: '2022-01-15',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        isActive: true
      },
      {
        id: 'agent-2',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        team: 'Sales Team',
        joinDate: '2022-02-20',
        avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
        isActive: true
      },
      // Add more mock agents as needed
    ];
    
    setAgents(mockAgents);
    if (mockAgents.length > 0 && !selectedAgent) {
      setSelectedAgent(mockAgents[0]);
    }
    
    // Set initial timeframe data
    setTimeframeData(generateTimeframeData(timeframe));
  }, [selectedAgent, timeframe]);

  // Render agent selector dropdown
  const renderAgentSelector = () => (
    <AgentSelector>
      <div className="relative">
        <button 
          onClick={() => setIsAgentDropdownOpen(!isAgentDropdownOpen)}
          className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <User className="h-5 w-5" />
          <span>{selectedAgent?.name || 'Select Agent'}</span>
          {isAgentDropdownOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        
        <AgentDropdown isOpen={isAgentDropdownOpen}>
          <div className="p-2">
            <input
              type="text"
              placeholder="Search agents..."
              className="w-full p-2 border rounded-md mb-2 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {filteredAgents.map((agent) => (
              <AgentOption
                key={agent.id}
                isActive={selectedAgent?.id === agent.id}
                onClick={() => handleAgentSelect(agent)}
              >
                <AgentAvatar>
                  {agent.avatar ? (
                    <img src={agent.avatar} alt={agent.name} className="w-full h-full rounded-full" />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </AgentAvatar>
                <AgentInfo>
                  <AgentName>{agent.name}</AgentName>
                  <AgentEmail>{agent.email}</AgentEmail>
                </AgentInfo>
                {selectedAgent?.id === agent.id && <CheckIcon className="h-4 w-4 text-blue-500" />}
              </AgentOption>
            ))}
            {filteredAgents.length === 0 && (
              <div className="p-2 text-sm text-gray-500">No agents found</div>
            )}
          </div>
        </AgentDropdown>
      </div>
    </AgentSelector>
  );

  // Main render
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Agent Dashboard</h1>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => window.location.reload()}
              className="p-2 text-gray-500 hover:text-gray-700"
              title="Refresh"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
              Export
            </button>
          </div>
        </div>
      </header>

      {/* Enhanced Animated KPI Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          {renderAgentSelector()}
        </div>
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpiData.map((metric, index) => (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 flex flex-col border border-slate-200 dark:border-slate-700"
              onClick={metric.onClick}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{metric.label}</h3>
                <div className={`p-2 rounded-full bg-${metric.changeType === 'increase' ? 'green' : metric.changeType === 'decrease' ? 'red' : 'yellow'}-100 dark:bg-opacity-20`}>
                  <metric.icon className={`h-5 w-5 text-${metric.changeType === 'increase' ? 'green' : metric.changeType === 'decrease' ? 'red' : 'yellow'}-600`} />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{metric.value}</p>
                  <div className={`flex items-center mt-1 text-sm ${metric.changeType === 'increase' ? 'text-green-600' : metric.changeType === 'decrease' ? 'text-red-600' : 'text-yellow-600'}`}>
                    {metric.changeType === 'increase' ? (
                      <ArrowUp className="h-4 w-4 mr-1" />
                    ) : metric.changeType === 'decrease' ? (
                      <ArrowDown className="h-4 w-4 mr-1" />
                    ) : (
                      <Minus className="h-4 w-4 mr-1" />
                    )}
                    {metric.changeType !== 'neutral' && `${metric.change}%`} {metric.changeLabel}
                  </div>
                </div>
              </div>
              {metric.progress !== undefined && (
                <div className="mt-4 w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${metric.progress}%` }}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sales Performance Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-lg shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Sales Performance</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setTimeframe('daily')}
                  className={`px-3 py-1 text-sm rounded-md ${timeframe === 'daily' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  Daily
                </button>
                <button
                  onClick={() => setTimeframe('weekly')}
                  className={`px-3 py-1 text-sm rounded-md ${timeframe === 'weekly' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  Weekly
                </button>
                <button
                  onClick={() => setTimeframe('monthly')}
                  className={`px-3 py-1 text-sm rounded-md ${timeframe === 'monthly' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  Monthly
                </button>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={[
                    { name: 'Jan', value: 4000 },
                    { name: 'Feb', value: 3000 },
                    { name: 'Mar', value: 5000 },
                    { name: 'Apr', value: 2780 },
                    { name: 'May', value: 1890 },
                    { name: 'Jun', value: 2390 },
                  ]}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Area type="monotone" dataKey="value" stroke="#3B82F6" fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Product Distribution Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Package className="w-6 h-6 text-purple-600" />
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Product Distribution</h3>
              </div>
              <button 
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                onClick={() => setTimeframe(timeframe === 'monthly' ? 'quarterly' : 'monthly')}
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  {productDistribution.length > 0 ? (
                    <>
                      <Pie
                        data={productDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name || 'Unknown'}: ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {productDistribution.map((_, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS[index % COLORS.length]} 
                            stroke="#fff"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [
                          `$${Number(value).toLocaleString()}`,
                          'Sales'
                        ]}
                      />
                      <Legend />
                    </>
                  ) : (
                    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fill="#6B7280">
                      No product data available
                    </text>
                  )}
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
      </div>

      {/* Recent Deals and Targets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
        {/* Recent Deals */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-700"
        >
          <div className="flex items-center space-x-3 mb-6">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Recent Deals</h3>
          </div>
          <div className="space-y-4">
            {agentData.recentDeals.map((deal, index) => (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1 + index * 0.1 }}
                className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
              >
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{deal.company}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{deal.id} • {deal.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">${deal.value.toLocaleString()}</p>
                  <p className="text-sm text-slate-500">{deal.status}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Targets */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-700"
        >
          <div className="flex items-center space-x-3 mb-6">
            <Target className="w-6 h-6 text-orange-600" />
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Performance Targets</h3>
          </div>
          <div className="space-y-6">
            {[
              {
                label: "Monthly Target",
                target: agentData.targets.monthly,
                current: agentData.currentMonth.sales,
                color: "blue"
              },
              {
                label: "Quarterly Target",
                target: agentData.targets.quarterly,
                current: agentData.performance.totalSales,
                color: "purple"
              },
              {
                label: "Yearly Target",
                target: agentData.targets.yearly,
                current: agentData.performance.totalSales,
                color: "green"
              }
            ].map((target, index) => {
              const progress = Math.min((target.current / target.target) * 100, 100);
              return (
                <motion.div
                  key={target.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{target.label}</span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      ${target.current.toLocaleString()} / ${target.target.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                    <motion.div
                      className={`h-3 rounded-full bg-gradient-to-r ${
                        target.color === 'blue' ? 'from-blue-500 to-blue-600' :
                        target.color === 'purple' ? 'from-purple-500 to-purple-600' :
                        'from-green-500 to-green-600'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, delay: 1.3 + index * 0.1 }}
                    />
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      {progress.toFixed(1)}%
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
});

export default AgentDashboard;