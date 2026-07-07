import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Menu, Search, Sun, Moon, Command } from 'lucide-react';
import { toggleTheme, toggleSidebar } from '../store/slices/themeSlice';
import NotificationPanel from './NotificationPanel';
import UserProfileDropdown from './UserProfileDropdown';

const Navbar = () => {
  const dispatch = useDispatch();
  const { mode } = useSelector((state) => state.theme);
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between px-4 sm:px-6 glass border-b border-gray-200 dark:border-[#27272a]">
      {/* ── Left: Hamburger + Search ── */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button
          id="sidebar-toggle-btn"
          onClick={() => dispatch(toggleSidebar())}
          className="p-2 -ml-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-[#27272a] transition-colors flex-shrink-0"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Bar */}
        <motion.div
          animate={{ width: searchFocused ? '100%' : 'auto' }}
          className="hidden sm:flex items-center max-w-sm w-full relative"
        >
          <Search
            className={`w-4 h-4 absolute left-3 transition-colors ${
              searchFocused ? 'text-primary-500' : 'text-gray-400'
            }`}
          />
          <input
            id="global-search"
            type="text"
            placeholder="Search anything..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-full bg-gray-100 dark:bg-[#111111] border border-transparent focus:border-primary-400 dark:border-[#27272a] dark:focus:border-primary-500 text-gray-900 dark:text-white text-sm rounded-xl pl-10 pr-12 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all placeholder:text-gray-400"
          />
          <div className="absolute right-3 flex items-center gap-1">
            <kbd className="hidden lg:inline-flex items-center justify-center rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-black/40 px-1.5 font-mono text-[10px] font-medium text-gray-500 dark:text-gray-400">
              <Command className="w-3 h-3 mr-0.5" />K
            </kbd>
          </div>
        </motion.div>
      </div>

      {/* ── Right: Actions ── */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Theme Toggle */}
        <button
          id="theme-toggle-btn"
          onClick={() => dispatch(toggleTheme())}
          className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-[#27272a] transition-colors"
          aria-label="Toggle theme"
        >
          {mode === 'dark' ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

        {/* Notifications */}
        <NotificationPanel />

        {/* Divider */}
        <div className="hidden sm:block w-px h-6 bg-gray-200 dark:bg-[#27272a] mx-1" />

        {/* User Profile Dropdown */}
        <UserProfileDropdown />
      </div>
    </header>
  );
};

export default Navbar;
