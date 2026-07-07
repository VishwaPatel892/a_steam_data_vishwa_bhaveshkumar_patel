import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Gamepad2,
  Tag,
  Trophy,
  LineChart,
  Settings,
  ChevronLeft,
  ChevronRight,
  UserCircle,
  X,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setSidebarOpen, toggleSidebar } from '../store/slices/themeSlice';
import { cn } from '../utils/cn';

const menuGroups = [
  {
    title: 'Overview',
    items: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/', id: 'nav-dashboard' },
      { name: 'Analytics', icon: LineChart, path: '/analytics', id: 'nav-analytics' },
    ],
  },
  {
    title: 'Games',
    items: [
      { name: 'All Games', icon: Gamepad2, path: '/games', id: 'nav-games' },
      { name: 'By Genre', icon: Tag, path: '/games/genre', id: 'nav-genre' },
      { name: 'Top Rated', icon: Trophy, path: '/games/top-rated', id: 'nav-toprated' },
      { name: 'Users', icon: Users, path: '/users', id: 'nav-users' },
    ],
  },
  {
    title: 'Account',
    items: [
      { name: 'Profile', icon: UserCircle, path: '/profile', id: 'nav-profile' },
      { name: 'Settings', icon: Settings, path: '/settings', id: 'nav-settings' },
    ],
  },
];

const EXPANDED_WIDTH = 260;
const COLLAPSED_WIDTH = 72;

const Sidebar = ({ isOpen, isMobile }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleMobileClose = () => {
    if (isMobile) dispatch(setSidebarOpen(false));
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    // Exact match for /games so it doesn't highlight when on /games/genre or /games/top-rated
    if (path === '/games') return location.pathname === '/games';
    return location.pathname.startsWith(path);
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
          width: isMobile ? (isOpen ? EXPANDED_WIDTH : 0) : isOpen ? EXPANDED_WIDTH : COLLAPSED_WIDTH,
          x: isMobile && !isOpen ? -EXPANDED_WIDTH : 0,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={cn(
          'fixed md:sticky top-0 left-0 z-50 h-screen flex flex-col',
          'bg-[#080f1c]',
          'border-r border-white/[0.06]',
          'overflow-hidden flex-shrink-0'
        )}
      >
        {/* ── Logo & Close/Collapse ── */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/[0.06] flex-shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-extrabold text-base flex-shrink-0 shadow">
              A
            </div>
            <AnimatePresence>
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  className="font-bold text-lg text-white whitespace-nowrap"
                >
                  A-Steam
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile: X button | Desktop: Collapse toggle */}
          {isMobile ? (
            <button
              id="sidebar-close-btn"
              onClick={handleMobileClose}
              className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-[#27272a] transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <button
              id="sidebar-collapse-btn"
              onClick={() => dispatch(toggleSidebar())}
              className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-[#27272a] transition-colors"
              aria-label="Toggle sidebar"
            >
              {isOpen ? (
                <ChevronLeft className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          )}
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-1 overflow-y-auto py-4 space-y-6 scrollbar-hide">
          {menuGroups.map((group, gi) => (
            <div key={gi} className="px-3">
              <AnimatePresence>
                {isOpen && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-[#475569] whitespace-nowrap"
                  >
                    {group.title}
                  </motion.p>
                )}
              </AnimatePresence>

              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.name}
                      id={item.id}
                      to={item.path}
                      onClick={handleMobileClose}
                      title={!isOpen ? item.name : undefined}
                      className={cn(
                        'group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
                        active
                          ? 'text-[#3B82F6] bg-[#3B82F6]/10'
                          : 'text-[#94A3B8] hover:text-white hover:bg-white/[0.06]'
                      )}
                    >
                      {/* Active pill */}
                      {active && (
                        <motion.div
                          layoutId="sidebar-active-indicator"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#3B82F6] rounded-r-full"
                        />
                      )}

                      <item.icon
                        className={cn(
                          'w-5 h-5 flex-shrink-0 transition-colors',
                          active
                            ? 'text-[#3B82F6]'
                            : 'group-hover:text-white'
                        )}
                      />

                      <AnimatePresence>
                        {isOpen && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.15 }}
                            className={cn(
                              'font-medium text-sm whitespace-nowrap overflow-hidden',
                              active ? 'text-[#3B82F6]' : ''
                            )}
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
        </nav>

        {/* ── User Card ── */}
        <div className="p-3 border-t border-white/[0.06] flex-shrink-0">
          <Link
            to="/profile"
            onClick={handleMobileClose}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/[0.06] transition-all duration-200 group"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 ring-2 ring-transparent group-hover:ring-primary-500/30 transition-all uppercase">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 overflow-hidden min-w-0"
                >
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate leading-tight">
                    {user?.name || 'Admin User'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize truncate">
                    {user?.role || 'Admin'}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            {isOpen && (
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary-500 transition-colors flex-shrink-0" />
            )}
          </Link>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
