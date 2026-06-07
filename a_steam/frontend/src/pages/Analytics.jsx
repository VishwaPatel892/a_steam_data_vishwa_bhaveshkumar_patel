import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart as LineIcon, TrendingUp, TrendingDown, Users, DollarSign, Database, AlertCircle } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, LineChart as RLineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { Skeleton } from '@mui/material';
import { GlassCard } from '../components';
import analyticsService from '../services/analyticsService';
import userService from '../services/userService';
import useApi from '../utils/useApi';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 22 } },
};

const tooltipStyle = {
  backgroundColor: '#111827',
  borderColor: '#374151',
  borderRadius: '0.75rem',
  color: '#f3f4f6',
  fontSize: 12,
  padding: '8px 12px',
};

const PIE_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'];

const AnalyticsPage = () => {
  const [dashboardData, setDashboardData] = useState({
    usersTotal: 0,
    recordsTotal: 0,
    revenueTotal: 0,
    growthPercent: 0,
    revenueData: [],
    topGamesData: [],
    releaseData: [],
    genreData: [],
  });

  const { execute, loading, error } = useApi({ showSuccessToast: false, showErrorToast: true });

  useEffect(() => {
    const fetchData = async () => {
      await execute(async () => {
        // Fetch aggregations concurrently
        const [
          usersRes,
          platformRes,
          revenueRes,
          topGamesRes,
          trendsRes,
          genreRes
        ] = await Promise.all([
          userService.getAllUsers({ limit: 1 }),
          analyticsService.getPlatformDistribution(),
          analyticsService.getRevenue(20),
          analyticsService.getMostDownloaded(10),
          analyticsService.getReleaseTrends(),
          analyticsService.getGenreDistribution()
        ]);

        // Calculate KPI Metrics
        const usersTotal = usersRes.total || 0;
        const recordsTotal = platformRes.total || 0;
        
        // Revenue sum
        const revenueTotal = revenueRes.reduce((acc, curr) => acc + (curr.revenueEstimate || 0), 0);
        
        // Growth calc (comparing last two years of releases)
        let growthPercent = 0;
        if (trendsRes && trendsRes.length >= 2) {
          const currentYear = trendsRes[0].count;
          const prevYear = trendsRes[1].count;
          if (prevYear > 0) {
            growthPercent = ((currentYear - prevYear) / prevYear) * 100;
          } else {
            growthPercent = currentYear > 0 ? 100 : 0;
          }
        }

        setDashboardData({
          usersTotal,
          recordsTotal,
          revenueTotal,
          growthPercent: growthPercent.toFixed(1),
          revenueData: revenueRes.slice(0, 10), // Take top 10 for area chart
          topGamesData: topGamesRes,
          releaseData: [...trendsRes].reverse(), // chronologically ascending
          genreData: genreRes.slice(0, 7), // Top 7 genres for Pie Chart
        });
        
        return true;
      });
    };

    fetchData();
  }, [execute]);

  // Format currency
  const formatCurrency = (value) => `$${(value / 1000).toFixed(1)}k`;

  const kpis = [
    { label: 'Total Users', value: dashboardData.usersTotal.toLocaleString(), change: '+2.4%', positive: true, icon: Users, color: 'from-purple-500 to-pink-500' },
    { label: 'Total Records (Games)', value: dashboardData.recordsTotal.toLocaleString(), change: '+5.1%', positive: true, icon: Database, color: 'from-blue-500 to-cyan-500' },
    { label: 'Est. Total Revenue', value: `$${dashboardData.revenueTotal.toLocaleString()}`, change: '+14.3%', positive: true, icon: DollarSign, color: 'from-emerald-500 to-teal-500' },
    { label: 'YoY Growth (Releases)', value: `${dashboardData.growthPercent}%`, change: `${dashboardData.growthPercent}%`, positive: dashboardData.growthPercent >= 0, icon: dashboardData.growthPercent >= 0 ? TrendingUp : TrendingDown, color: 'from-amber-500 to-orange-500' },
  ];

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-4">
        <AlertCircle className="w-16 h-16 text-rose-500" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Failed to load analytics</h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-md">{error.message || 'The server encountered an error while running aggregations.'}</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 mt-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition">
          Retry
        </button>
      </div>
    );
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 pb-12">
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
          <LineIcon className="w-8 h-8 text-primary-500" />
          Analytics Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          MongoDB Aggregation metrics covering user growth, platform distribution, and revenue.
        </p>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <GlassCard key={i} className="!p-4 sm:!p-5">
              <Skeleton variant="circular" width={40} height={40} className="mb-3" />
              <Skeleton variant="text" sx={{ fontSize: '2rem' }} width="60%" />
              <Skeleton variant="text" width="40%" />
            </GlassCard>
          ))
        ) : (
          kpis.map((kpi, idx) => (
            <GlassCard key={idx} className="!p-4 sm:!p-5">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${kpi.color} flex items-center justify-center`}>
                  <kpi.icon className="w-5 h-5 text-white" />
                </div>
                <span
                  className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
                    kpi.positive
                      ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10'
                      : 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10'
                  }`}
                >
                  {kpi.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {Math.abs(parseFloat(kpi.change))}%
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white truncate">{kpi.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{kpi.label}</p>
            </GlassCard>
          ))
        )}
      </motion.div>

      {/* Charts Row 1: Area & Pie */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Area Chart */}
        <GlassCard className="lg:col-span-2">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-5">Estimated Revenue by Top Games (Area Chart)</h3>
          <div className="h-72">
            {loading ? (
              <Skeleton variant="rounded" width="100%" height="100%" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dashboardData.revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.15} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#6b7280', fontSize: 10 }} 
                    dy={8}
                    tickFormatter={(name) => name.length > 10 ? name.substring(0, 10) + '...' : name}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#6b7280', fontSize: 11 }} 
                    dx={-8}
                    tickFormatter={formatCurrency}
                  />
                  <Tooltip contentStyle={tooltipStyle} formatter={(val) => [`$${val.toLocaleString()}`, 'Revenue']} />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
                  <Area type="monotone" dataKey="revenueEstimate" name="Est. Revenue ($)" stroke="#10b981" strokeWidth={2.5} fill="url(#gradRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </GlassCard>

        {/* Category Pie Chart */}
        <GlassCard>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-5">Category Distribution (Pie Chart)</h3>
          <div className="h-72">
            {loading ? (
              <Skeleton variant="circular" width={200} height={200} className="mx-auto mt-4" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dashboardData.genreData}
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="count"
                    nameKey="genre"
                    stroke="none"
                  >
                    {dashboardData.genreData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </GlassCard>
      </motion.div>

      {/* Charts Row 2: Bar & Line */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Downloaded / Reviews Bar Chart */}
        <GlassCard>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-5">Most Downloaded/Reviewed (Bar Chart)</h3>
          <div className="h-64">
            {loading ? (
              <Skeleton variant="rounded" width="100%" height="100%" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboardData.topGamesData} layout="vertical" barSize={12} margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#374151" opacity={0.15} />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 10 }} />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#6b7280', fontSize: 11 }} 
                    width={90}
                    tickFormatter={(name) => name.length > 12 ? name.substring(0, 12) + '...' : name}
                  />
                  <Tooltip contentStyle={tooltipStyle} cursor={{fill: '#374151', opacity: 0.1}} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="reviewCount" name="Reviews/Downloads" radius={[0, 4, 4, 0]} fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </GlassCard>

        {/* Release Trends Line Chart */}
        <GlassCard>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-5">Yearly Release Trends (Line Chart)</h3>
          <div className="h-64">
            {loading ? (
              <Skeleton variant="rounded" width="100%" height="100%" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <RLineChart data={dashboardData.releaseData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.15} />
                  <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} dy={8} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    name="Games Released" 
                    stroke="#8b5cf6" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: '#8b5cf6' }} 
                    activeDot={{ r: 6 }} 
                  />
                </RLineChart>
              </ResponsiveContainer>
            )}
          </div>
        </GlassCard>
      </motion.div>
      
    </motion.div>
  );
};

export default AnalyticsPage;
