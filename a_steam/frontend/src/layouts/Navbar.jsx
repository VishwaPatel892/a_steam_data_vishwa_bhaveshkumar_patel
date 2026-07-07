import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Menu, Search, Command, Settings, X } from 'lucide-react';
import { toggleSidebar } from '../store/slices/themeSlice';
import NotificationPanel from './NotificationPanel';
import UserProfileDropdown from './UserProfileDropdown';

const Navbar = () => {
  const dispatch = useDispatch();
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchVal, setSearchVal]         = useState('');

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between px-4 sm:px-6"
      style={{
        background: 'rgba(11,17,32,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>

      {/* ── Left ── */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button id="sidebar-toggle-btn" onClick={() => dispatch(toggleSidebar())}
          className="p-2 -ml-1 rounded-xl text-[#94A3B8] hover:bg-white/[0.06] hover:text-white transition-colors flex-shrink-0">
          <Menu className="w-5 h-5"/>
        </button>

        {/* Search */}
        <motion.div animate={{ width: searchFocused ? 340 : 260 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="hidden sm:flex items-center relative">
          <Search className={`w-4 h-4 absolute left-3 transition-colors pointer-events-none ${searchFocused ? 'text-[#3B82F6]' : 'text-[#475569]'}`}/>
          <input id="global-search" type="text" value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Search games, users, reports…"
            className="w-full bg-white/[0.04] border border-white/[0.07] focus:border-[#3B82F6]/50 text-white text-sm rounded-xl pl-10 pr-14 py-2 focus:outline-none focus:ring-1 focus:ring-[#3B82F6]/30 transition-all placeholder:text-[#475569]"/>
          {searchVal && (
            <button onClick={() => setSearchVal('')} className="absolute right-8 text-[#475569] hover:text-white transition-colors">
              <X className="w-3.5 h-3.5"/>
            </button>
          )}
          <kbd className="absolute right-3 inline-flex items-center gap-0.5 rounded-md border border-white/10 bg-white/[0.04] px-1.5 font-mono text-[10px] text-[#475569]">
            <Command className="w-2.5 h-2.5"/>K
          </kbd>
        </motion.div>
      </div>

      {/* ── Right ── */}
      <div className="flex items-center gap-1">
        {/* Notifications */}
        <NotificationPanel/>

        {/* Settings */}
        <button className="p-2 rounded-xl text-[#94A3B8] hover:bg-white/[0.06] hover:text-white transition-colors">
          <Settings className="w-5 h-5"/>
        </button>

        <div className="w-px h-6 bg-white/[0.07] mx-1"/>

        {/* User Profile */}
        <UserProfileDropdown/>
      </div>
    </header>
  );
};

export default Navbar;
