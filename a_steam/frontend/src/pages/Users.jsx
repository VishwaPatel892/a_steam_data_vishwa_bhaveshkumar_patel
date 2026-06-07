import { motion } from 'framer-motion';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';
import { GlassCard, Badge, Button } from '../components';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 22 } },
};

const users = [
  { id: 1, name: 'Alex Mitchell', email: 'alex@example.com', role: 'admin', status: 'active', joined: 'Jan 12, 2024', avatar: 'AM' },
  { id: 2, name: 'Sarah Connor', email: 'sarah@example.com', role: 'user', status: 'active', joined: 'Feb 3, 2024', avatar: 'SC' },
  { id: 3, name: 'John Doe', email: 'john@example.com', role: 'user', status: 'inactive', joined: 'Mar 18, 2024', avatar: 'JD' },
  { id: 4, name: 'Emma Wilson', email: 'emma@example.com', role: 'moderator', status: 'active', joined: 'Apr 5, 2024', avatar: 'EW' },
  { id: 5, name: 'Ryan Garcia', email: 'ryan@example.com', role: 'user', status: 'pending', joined: 'May 22, 2024', avatar: 'RG' },
  { id: 6, name: 'Priya Sharma', email: 'priya@example.com', role: 'user', status: 'active', joined: 'Jun 1, 2024', avatar: 'PS' },
];

const roleColors = {
  admin: 'bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300',
  moderator: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
  user: 'bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-400',
};

const StatusIcon = ({ status }) => {
  if (status === 'active') return <CheckCircle className="w-4 h-4 text-emerald-500" />;
  if (status === 'inactive') return <XCircle className="w-4 h-4 text-rose-400" />;
  return <Clock className="w-4 h-4 text-amber-400" />;
};

const UsersPage = () => {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <Users className="w-8 h-8 text-primary-500" />
            Users
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage and monitor all registered users.
          </p>
        </div>
        <Button id="add-user-btn" startIcon={<UserPlus className="w-4 h-4" />}>
          Add User
        </Button>
      </motion.div>

      {/* Stats Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: '6', color: 'from-primary-500 to-blue-600' },
          { label: 'Active', value: '4', color: 'from-emerald-500 to-teal-600' },
          { label: 'Inactive', value: '1', color: 'from-rose-500 to-pink-600' },
          { label: 'Pending', value: '1', color: 'from-amber-500 to-orange-500' },
        ].map((s) => (
          <GlassCard key={s.label} className="!p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}>
              {s.value}
            </p>
          </GlassCard>
        ))}
      </motion.div>

      {/* Table */}
      <motion.div variants={itemVariants}>
        <GlassCard noPadding>
          {/* Toolbar */}
          <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-[#27272a] flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="users-search"
                type="text"
                placeholder="Search users..."
                className="w-full bg-gray-50 dark:bg-[#111111] border border-gray-200 dark:border-[#27272a] text-sm text-gray-900 dark:text-white rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-[#111111] border border-gray-200 dark:border-[#27272a] rounded-xl hover:bg-gray-100 dark:hover:bg-[#1a1a1a] transition-colors">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>

          {/* Table Body */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-[#27272a]">
                  {['User', 'Role', 'Status', 'Joined', ''].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider first:pl-6 last:pr-6"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-[#27272a]">
                {users.map((u, i) => (
                  <motion.tr
                    key={u.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-5 py-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {u.avatar}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{u.name}</p>
                          <p className="text-xs text-gray-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${roleColors[u.role]}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <StatusIcon status={u.status} />
                        <span className="capitalize text-gray-700 dark:text-gray-300">{u.status}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-500 dark:text-gray-400">{u.joined}</td>
                    <td className="px-5 py-4 pr-6 text-right">
                      <button className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-[#27272a] hover:text-gray-700 dark:hover:text-white transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-5 py-3 border-t border-gray-100 dark:border-[#27272a] flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Showing 1–6 of 6 users</span>
            <div className="flex items-center gap-1">
              {[1].map((p) => (
                <button key={p} className="w-7 h-7 rounded-lg bg-primary-500 text-white font-semibold text-xs">
                  {p}
                </button>
              ))}
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
};

export default UsersPage;
