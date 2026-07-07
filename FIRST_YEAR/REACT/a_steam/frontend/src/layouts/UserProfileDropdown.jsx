import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, LogOut, ChevronDown, Shield } from 'lucide-react';
import { logoutUser } from '../store/slices/authSlice';

const UserProfileDropdown = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await dispatch(logoutUser());
    setLoggingOut(false);
    setOpen(false);
    navigate('/login');
  };

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'U';

  const menuItems = [
    {
      label: 'View Profile',
      icon: User,
      path: '/profile',
      id: 'dropdown-profile',
    },
    {
      label: 'Settings',
      icon: Settings,
      path: '/settings',
      id: 'dropdown-settings',
    },
  ];

  return (
    <div className="relative">
      <button
        id="user-profile-btn"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-xl hover:bg-gray-100 dark:hover:bg-[#27272a] transition-all duration-200 group"
        aria-label="User menu"
      >
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-md ring-2 ring-transparent group-hover:ring-primary-500/40 transition-all">
          {initials}
        </div>

        {/* Name — hidden on mobile */}
        <div className="hidden md:flex flex-col items-start leading-tight">
          <span className="text-sm font-semibold text-gray-900 dark:text-white truncate max-w-[120px]">
            {user?.name || 'Admin User'}
          </span>
          <span className="text-[11px] text-gray-500 dark:text-gray-400 capitalize">
            {user?.role || 'Admin'}
          </span>
        </div>

        <ChevronDown
          className={`hidden md:block w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-60 rounded-2xl glass-card shadow-2xl z-50 overflow-hidden"
            >
              {/* User Info Header */}
              <div className="px-4 py-4 border-b border-gray-100 dark:border-[#27272a] flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold text-base shadow">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {user?.name || 'Admin User'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user?.email || 'admin@example.com'}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Shield className="w-3 h-3 text-primary-500" />
                    <span className="text-[11px] text-primary-600 dark:text-primary-400 capitalize font-medium">
                      {user?.role || 'Admin'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.id}
                    id={item.id}
                    to={item.path}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors group"
                  >
                    <item.icon className="w-4 h-4 text-gray-400 group-hover:text-primary-500 transition-colors" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
              </div>

              {/* Logout */}
              <div className="p-2 border-t border-gray-100 dark:border-[#27272a]">
                <button
                  id="logout-btn"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-colors group disabled:opacity-60"
                >
                  <LogOut
                    className={`w-4 h-4 ${
                      loggingOut ? 'animate-pulse' : ''
                    }`}
                  />
                  <span className="font-medium">
                    {loggingOut ? 'Logging out...' : 'Log out'}
                  </span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserProfileDropdown;
