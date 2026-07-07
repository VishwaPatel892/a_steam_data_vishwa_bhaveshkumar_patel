import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import GlassCard from './GlassCard';

const StatCard = ({ title, value, trend, isPositive, icon: Icon, chartData, dataKey }) => {
  return (
    <GlassCard hover className="flex flex-col relative overflow-hidden group">
      {/* Background Gradient Glow on Hover */}
      <div className="absolute -right-20 -top-20 w-40 h-40 bg-primary-500/10 dark:bg-primary-400/5 blur-3xl rounded-full transition-opacity duration-500 opacity-0 group-hover:opacity-100" />
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
        </div>
        <div className="p-2 bg-gray-50 dark:bg-[#1a1a1a] rounded-lg border border-gray-100 dark:border-[#27272a]">
          <Icon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </div>
      </div>

      <div className="flex items-center space-x-2 relative z-10">
        <span className={`flex items-center text-xs font-semibold px-1.5 py-0.5 rounded-md ${
          isPositive 
            ? 'text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10' 
            : 'text-rose-700 bg-rose-50 dark:text-rose-400 dark:bg-rose-500/10'
        }`}>
          {isPositive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
          {trend}%
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-500">vs last month</span>
      </div>

      {chartData && (
        <div className="absolute bottom-0 left-0 right-0 h-16 opacity-30 pointer-events-none">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id={`color-${title.replace(/\\s/g,'')}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isPositive ? '#10b981' : '#f43f5e'} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={isPositive ? '#10b981' : '#f43f5e'} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey={dataKey} 
                stroke={isPositive ? '#10b981' : '#f43f5e'} 
                strokeWidth={2}
                fillOpacity={1} 
                fill={`url(#color-${title.replace(/\\s/g,'')})`} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </GlassCard>
  );
};

export default StatCard;
