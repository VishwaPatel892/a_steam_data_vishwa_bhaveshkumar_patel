import { motion } from 'framer-motion';
import { 
  Users, 
  Gamepad2, 
  DollarSign, 
  MessageSquare,
  Download,
  Plus,
  ArrowRight,
  MoreVertical,
  UserPlus,
  Settings
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { StatCard, GlassCard, Badge, Button } from '../components';

// Dummy Data for Recharts
const revenueData = [
  { name: 'Jan', value: 4000 }, { name: 'Feb', value: 3000 }, { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 4500 }, { name: 'May', value: 6000 }, { name: 'Jun', value: 7500 },
];

const sparklineData = [
  { value: 10 }, { value: 25 }, { value: 15 }, { value: 40 }, { value: 35 }, { value: 50 }
];

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

const Dashboard = () => {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Overview
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Welcome back, Vishwa. Here's what's happening today.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button variant="outlined" startIcon={<Download className="w-4 h-4" />} className="bg-white dark:bg-transparent dark:border-gray-700 dark:text-gray-300">
            Export
          </Button>
          <Button startIcon={<Plus className="w-4 h-4" />}>
            New Game
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Users" 
          value="124.5K" 
          trend={12.5} 
          isPositive={true}
          icon={Users}
          chartData={sparklineData}
          dataKey="value"
        />
        <StatCard 
          title="Monthly Revenue" 
          value="$45,231" 
          trend={8.2} 
          isPositive={true}
          icon={DollarSign}
          chartData={sparklineData}
          dataKey="value"
        />
        <StatCard 
          title="Active Games" 
          value="1,204" 
          trend={2.4} 
          isPositive={false}
          icon={Gamepad2}
          chartData={sparklineData}
          dataKey="value"
        />
        <StatCard 
          title="New Reviews" 
          value="892" 
          trend={18.7} 
          isPositive={true}
          icon={MessageSquare}
          chartData={sparklineData}
          dataKey="value"
        />
      </motion.div>

      {/* Analytics Section */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Revenue Overview</h3>
            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dx={-10} tickFormatter={(val) => `$${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '0.5rem', color: '#f3f4f6' }}
                  itemStyle={{ color: '#60a5fa' }}
                />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Quick Actions Panel */}
        <GlassCard>
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-6">Quick Actions</h3>
          <div className="space-y-3">
            {[
              { title: 'Add New User', icon: UserPlus, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
              { title: 'Publish Game', icon: Gamepad2, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10' },
              { title: 'System Settings', icon: Settings, color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-800' },
            ].map((action, i) => (
              <button key={i} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors group border border-transparent hover:border-gray-200 dark:hover:border-[#27272a]">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${action.bg} ${action.color}`}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                    {action.title}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary-500 transition-colors" />
              </button>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Recent Activity */}
      <motion.div variants={itemVariants}>
        <GlassCard noPadding>
          <div className="p-6 border-b border-gray-200 dark:border-[#27272a] flex justify-between items-center">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Recent Activity</h3>
            <Button variant="text" size="small" endIcon={<ArrowRight className="w-4 h-4" />}>
              View All
            </Button>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-[#27272a]">
            {[
              { user: 'Alex Mitchell', action: 'Purchased Elden Ring', time: '2 mins ago', status: 'success' },
              { user: 'Sarah Connor', action: 'Left a review on Cyberpunk 2077', time: '1 hour ago', status: 'primary' },
              { user: 'System', action: 'Failed payment processing', time: '3 hours ago', status: 'error' },
              { user: 'John Doe', action: 'Registered new account', time: '5 hours ago', status: 'success' },
            ].map((item, i) => (
              <div key={i} className="p-4 sm:px-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#111111]/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 font-semibold text-sm">
                    {item.user.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900 dark:text-white">{item.action}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.user}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant={item.status}>{item.status === 'success' ? 'Completed' : item.status === 'error' ? 'Failed' : 'Info'}</Badge>
                  <span className="text-xs text-gray-500">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

    </motion.div>
  );
};

export default Dashboard;
