import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  Gamepad2, 
  MessageSquare, 
  LineChart, 
  Settings,
  ChevronRight
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setSidebarOpen } from '../store/slices/themeSlice';
import { cn } from '../utils/cn';

const menuGroups = [
  {
    title: 'Overview',
    items: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
      { name: 'Analytics', icon: LineChart, path: '/analytics' },
    ]
  },
  {
    title: 'Management',
    items: [
      { name: 'Users', icon: Users, path: '/users' },
      { name: 'Games', icon: Gamepad2, path: '/games' },
      { name: 'Reviews', icon: MessageSquare, path: '/reviews' },
    ]
  },
  {
    title: 'System',
    items: [
      { name: 'Settings', icon: Settings, path: '/settings' },
    ]
  }
];

const Sidebar = ({ isOpen, isMobile }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleMobileClose = () => {
    if (isMobile) dispatch(setSidebarOpen(false));
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleMobileClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ 
          width: isOpen ? 260 : isMobile ? 0 : 80,
          x: isMobile && !isOpen ? -260 : 0
        }}
        className={cn(
          "fixed md:sticky top-0 left-0 z-50 h-screen flex flex-col bg-white dark:bg-[#0a0a0a]",
          "border-r border-gray-200 dark:border-[#27272a] shadow-xl md:shadow-none transition-all duration-300",
          !isOpen && !isMobile && "overflow-hidden"
        )}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-[#27272a] flex-shrink-0">
          <div className="flex items-center gap-3 w-full">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              A
            </div>
            <AnimatePresence>
              {isOpen && (
                <motion.span 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="font-bold text-lg text-gray-900 dark:text-white whitespace-nowrap"
                >
                  A-Steam
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-6 space-y-8 scrollbar-hide">
          {menuGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="px-4">
              <AnimatePresence>
                {isOpen && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="px-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 whitespace-nowrap"
                  >
                    {group.title}
                  </motion.p>
                )}
              </AnimatePresence>
              
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={handleMobileClose}
                      className={cn(
                        "group relative flex items-center gap-3 px-2 py-2.5 rounded-lg transition-all duration-200",
                        isActive 
                          ? "text-primary-600 dark:text-white bg-primary-50 dark:bg-white/10" 
                          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
                      )}
                    >
                      {/* Active Indicator Line */}
                      {isActive && (
                        <motion.div 
                          layoutId="sidebar-active"
                          className="absolute left-0 w-1 h-5 bg-primary-600 dark:bg-primary-500 rounded-r-full"
                        />
                      )}
                      
                      <item.icon className={cn(
                        "w-5 h-5 flex-shrink-0 transition-colors",
                        isActive ? "text-primary-600 dark:text-primary-400" : "group-hover:text-gray-900 dark:group-hover:text-white"
                      )} />
                      
                      <AnimatePresence>
                        {isOpen && (
                          <motion.span 
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            className="font-medium whitespace-nowrap overflow-hidden"
                          >
                            {item.name}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* User Profile at Bottom */}
        <div className="p-4 border-t border-gray-200 dark:border-[#27272a] flex-shrink-0">
          <button className={cn(
            "flex items-center gap-3 w-full p-2 rounded-xl transition-all duration-200",
            "hover:bg-gray-100 dark:hover:bg-[#111111] border border-transparent dark:hover:border-white/5"
          )}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold flex-shrink-0 uppercase">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <AnimatePresence>
              {isOpen && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 text-left overflow-hidden"
                >
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500 truncate capitalize">{user?.role || 'Guest'}</p>
                </motion.div>
              )}
            </AnimatePresence>
            {isOpen && <ChevronRight className="w-4 h-4 text-gray-400" />}
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
