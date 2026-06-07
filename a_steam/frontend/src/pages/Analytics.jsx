import { motion } from 'framer-motion';
import { LineChart, TrendingUp, TrendingDown, Users, DollarSign, Eye } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, LineChart as RLineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { GlassCard } from '../components';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 22 } },
};

const monthlyData = [
  { month: 'Jan', revenue: 12000, users: 340, sessions: 1200 },
  { month: 'Feb', revenue: 18500, users: 420, sessions: 1850 },
  { month: 'Mar', revenue: 15200, users: 390, sessions: 1600 },
  { month: 'Apr', revenue: 22000, users: 510, sessions: 2200 },
  { month: 'May', revenue: 28000, users: 640, sessions: 2800 },
  { month: 'Jun', revenue: 35000, users: 780, sessions: 3400 },
];

const topGames = [
  { name: 'Elden Ring', plays: 4200, color: '#3b82f6' },
  { name: 'Cyberpunk 2077', plays: 3800, color: '#8b5cf6' },
  { name: 'RDR2', plays: 2900, color: '#10b981' },
  { name: 'GTA V', plays: 2400, color: '#f59e0b' },
  { name: 'Witcher 3', plays: 1900, color: '#ef4444' },
];

const kpis = [
  { label: 'Total Revenue', value: '$130,700', change: '+14.3%', positive: true, icon: DollarSign, color: 'from-blue-500 to-cyan-500' },
  { label: 'New Users', value: '3,080', change: '+22.1%', positive: true, icon: Users, color: 'from-purple-500 to-pink-500' },
  { label: 'Page Views', value: '13,050', change: '-3.2%', positive: false, icon: Eye, color: 'from-amber-500 to-orange-500' },
  { label: 'Avg Session', value: '8m 24s', change: '+5.7%', positive: true, icon: TrendingUp, color: 'from-emerald-500 to-teal-500' },
];

const tooltipStyle = {
  backgroundColor: '#111827',
  borderColor: '#374151',
  borderRadius: '0.75rem',
  color: '#f3f4f6',
  fontSize: 12,
};

const AnalyticsPage = () => {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
          <LineChart className="w-8 h-8 text-primary-500" />
          Analytics
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Platform performance and growth metrics overview.
        </p>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <GlassCard key={kpi.label} className="!p-4 sm:!p-5">
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
                {kpi.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{kpi.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{kpi.label}</p>
          </GlassCard>
        ))}
      </motion.div>

      {/* Charts Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Area Chart */}
        <GlassCard className="lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-gray-900 dark:text-white">Revenue & Users</h3>
            <select className="text-xs border border-gray-200 dark:border-[#27272a] bg-white dark:bg-[#111111] text-gray-600 dark:text-gray-400 rounded-lg px-2 py-1 focus:outline-none">
              <option>Last 6 months</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.15} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} dx={-8} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
                <Area type="monotone" dataKey="revenue" name="Revenue ($)" stroke="#3b82f6" strokeWidth={2.5} fill="url(#gradRevenue)" />
                <Area type="monotone" dataKey="users" name="New Users" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#gradUsers)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Top Games Bar */}
        <GlassCard>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-5">Top Played Games</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topGames} layout="vertical" barSize={12}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#374151" opacity={0.15} />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 10 }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} width={80} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="plays" name="Plays" radius={[0, 6, 6, 0]} fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </motion.div>

      {/* Sessions Line Chart */}
      <motion.div variants={itemVariants}>
        <GlassCard>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-5">Daily Sessions (6 months)</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <RLineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.15} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="sessions" name="Sessions" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} />
              </RLineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
};

export default AnalyticsPage;
