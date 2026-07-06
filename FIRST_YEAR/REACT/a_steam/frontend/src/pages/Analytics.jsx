import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart as LineIcon, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  CreditCard,
  Download,
  Calendar,
  Filter,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, LineChart as RLineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 22 } },
};

const tooltipStyle = {
  backgroundColor: '#1f2937', // gray-800
  borderColor: '#374151', // gray-700
  borderRadius: '0.75rem',
  color: '#f3f4f6', // gray-100
  fontSize: '12px',
  padding: '12px',
  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
};

const PIE_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

// --- Mock Data ---
const revenueData = [
  { name: 'Jan', revenue: 4000, target: 2400 },
  { name: 'Feb', revenue: 3000, target: 1398 },
  { name: 'Mar', revenue: 2000, target: 9800 },
  { name: 'Apr', revenue: 2780, target: 3908 },
  { name: 'May', revenue: 1890, target: 4800 },
  { name: 'Jun', revenue: 2390, target: 3800 },
  { name: 'Jul', revenue: 3490, target: 4300 },
];

const monthlyPerformance = [
  { name: 'Week 1', users: 400, sessions: 240 },
  { name: 'Week 2', users: 300, sessions: 139 },
  { name: 'Week 3', users: 200, sessions: 980 },
  { name: 'Week 4', users: 278, sessions: 390 },
];

const pieData = [
  { name: 'SaaS Subs', value: 400 },
  { name: 'One-time', value: 300 },
  { name: 'Services', value: 300 },
  { name: 'Consulting', value: 200 },
];

const topProducts = [
  { id: 1, name: 'Enterprise License - Yearly', category: 'Subscription', sales: 1245, revenue: '$124,500', growth: '+12.5%' },
  { id: 2, name: 'Pro Plan - Monthly', category: 'Subscription', sales: 3490, revenue: '$85,200', growth: '+5.2%' },
  { id: 3, name: 'Cloud Storage 1TB', category: 'Add-on', sales: 854, revenue: '$42,700', growth: '-2.4%' },
  { id: 4, name: 'Setup & Migration Service', category: 'Service', sales: 120, revenue: '$35,000', growth: '+18.1%' },
  { id: 5, name: 'Basic Plan - Yearly', category: 'Subscription', sales: 2100, revenue: '$21,000', growth: '+1.1%' },
];

const kpis = [
  { label: 'Total Revenue', value: '$128,430', change: '+14.5%', positive: true, icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { label: 'Monthly Recurring', value: '$42,390', change: '+5.2%', positive: true, icon: CreditCard, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { label: 'Active Users', value: '14,290', change: '-1.4%', positive: false, icon: Users, color: 'text-rose-500', bg: 'bg-rose-500/10' },
  { label: 'Revenue Growth', value: '24.8%', change: '+4.1%', positive: true, icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-500/10' },
];

const Analytics = () => {
  const [dateFilter, setDateFilter] = useState('Last 30 Days');

  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="show" 
      className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto"
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <LineIcon className="w-8 h-8 text-blue-600 dark:text-blue-500" />
            Analytics Overview
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            Track your key performance indicators and business growth.
          </p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Date Filter */}
          <div className="relative flex-1 sm:flex-none">
            <div className="flex items-center justify-between gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>{dateFilter}</span>
              <Filter className="w-4 h-4 text-gray-400 ml-2" />
            </div>
          </div>
          
          {/* Export Button */}
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm text-sm font-medium transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export Report</span>
          </button>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700/50 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${kpi.bg}`}>
                <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
              </div>
              <span className={`flex items-center gap-1 text-sm font-semibold px-2.5 py-1 rounded-full ${
                kpi.positive ? 'text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10' : 'text-rose-700 bg-rose-50 dark:text-rose-400 dark:bg-rose-500/10'
              }`}>
                {kpi.positive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                {kpi.change}
              </span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{kpi.value}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">{kpi.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Charts Row 1: Line Chart & Pie Chart */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Line Chart (Revenue) */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700/50 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Revenue vs Target</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Monthly performance metrics</p>
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dx={-10} tickFormatter={(val) => `$${val}`} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: '#9ca3af', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '13px', paddingTop: '20px' }} />
                <Area type="monotone" dataKey="revenue" name="Actual Revenue" stroke="#3b82f6" strokeWidth={3} fill="url(#colorRevenue)" activeDot={{ r: 6, strokeWidth: 0 }} />
                <Line type="monotone" dataKey="target" name="Target" stroke="#94a3b8" strokeWidth={2} strokeDasharray="4 4" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart (Distribution) */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700/50">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Revenue by Category</h3>
            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
          <div className="h-[250px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend iconType="circle" layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
            {/* Inner Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pr-[110px]">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">1.2k</span>
              <span className="text-xs text-gray-500 font-medium">Total Sales</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Charts Row 2: Bar Chart & Table */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Performance (Bar Chart) */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700/50">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Monthly Performance</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Users vs Sessions</p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyPerformance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dx={-10} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: '#374151', opacity: 0.05 }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '13px', paddingTop: '20px' }} />
                <Bar dataKey="users" name="New Users" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="sessions" name="Sessions" fill="#f472b6" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products / Services Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 lg:col-span-2 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700/50 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Top Products & Services</h3>
            <button className="text-sm font-medium text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 transition-colors">
              View All
            </button>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700/50 dark:text-gray-300">
                <tr>
                  <th scope="col" className="px-6 py-4 font-semibold">Product Name</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Category</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Sales</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Revenue</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Growth</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product) => (
                  <tr key={product.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-750/50 transition-colors">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {product.name}
                    </th>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs font-medium">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium">{product.sales.toLocaleString()}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">{product.revenue}</td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1 font-medium ${
                        product.growth.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'
                      }`}>
                        {product.growth.startsWith('+') ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                        {product.growth}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Analytics;
