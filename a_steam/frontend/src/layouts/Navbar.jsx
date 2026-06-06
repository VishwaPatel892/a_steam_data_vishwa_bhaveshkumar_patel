import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  Search, 
  Bell, 
  Sun, 
  Moon,
  Command,
  LogOut,
  User,
  Settings
} from 'lucide-react';
import { toggleTheme, toggleSidebar } from '../store/slices/themeSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const { mode } = useSelector((state) => state.theme);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between px-4 sm:px-6 glass border-b-0 border-gray-200 dark:border-b dark:border-[#27272a]">
      {/* Left section: Hamburger & Search */}
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={() => dispatch(toggleSidebar())}
          className="p-2 -ml-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-[#27272a] transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar - Hidden on small mobile */}
        <div className="hidden sm:flex items-center max-w-md w-full relative">
          <Search className="w-4 h-4 absolute left-3 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="w-full bg-gray-100 dark:bg-[#111111] border border-transparent dark:border-[#27272a] text-gray-900 dark:text-white text-sm rounded-full pl-10 pr-12 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
          />
          <div className="absolute right-3 flex items-center gap-1">
            <kbd className="hidden lg:inline-flex items-center justify-center rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-black px-1.5 font-mono text-[10px] font-medium text-gray-500 dark:text-gray-400">
              <Command className="w-3 h-3 mr-0.5" /> K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right section: Actions & Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        <button 
          onClick={() => dispatch(toggleTheme())}
          className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-[#27272a] transition-colors relative"
        >
          {mode === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-[#27272a] transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-white dark:border-[#0a0a0a]" />
        </button>

        <div className="relative ml-2">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-sm ring-2 ring-transparent hover:ring-primary-500 transition-all">
              VP
            </div>
          </button>

          {/* Profile Dropdown */}
          <AnimatePresence>
            {showProfileMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-56 rounded-xl glass-card border border-gray-200 dark:border-[#27272a] shadow-xl z-50 overflow-hidden"
                >
                  <div className="p-4 border-b border-gray-100 dark:border-[#27272a]">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Vishwa Patel</p>
                    <p className="text-xs text-gray-500 truncate">vishwa@example.com</p>
                  </div>
                  <div className="p-2">
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors">
                      <User className="w-4 h-4" /> Profile
                    </button>
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors">
                      <Settings className="w-4 h-4" /> Settings
                    </button>
                  </div>
                  <div className="p-2 border-t border-gray-100 dark:border-[#27272a]">
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors">
                      <LogOut className="w-4 h-4" /> Log out
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
