import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  AlertTriangle, 
  X, 
  ChevronDown, 
  ChevronUp, 
  ChevronRight,
  MoreVertical,
  Search,
  Plus,
  Loader2,
  Home,
  User,
  Settings,
  Bell,
  Trash2,
  FolderOpen
} from 'lucide-react';

const UXTest = () => {
  // State for interactive components
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState('tab1');
  const [expandedAccordion, setExpandedAccordion] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  // Auto-progress bar for demo
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) return 0;
        return Math.min(oldProgress + 10, 100);
      });
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  const triggerToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const Section = ({ title, children }) => (
    <div className="mb-12">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 pb-2 border-b border-gray-200 dark:border-gray-800">
        {title}
      </h2>
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
        {children}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black py-12 px-4 sm:px-6 lg:px-8 pb-32">
      <div className="max-w-5xl mx-auto space-y-12">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">NexusUI Component Library</h1>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">A comprehensive showcase of interactive UI components.</p>
        </div>

        {/* --- Buttons --- */}
        <Section title="Buttons">
          <div className="flex flex-wrap gap-4 items-center">
            <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm text-sm font-medium transition-all focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900">
              Primary
            </button>
            <button className="px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl shadow-sm text-sm font-medium transition-all">
              Secondary
            </button>
            <button className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-sm text-sm font-medium transition-all">
              Danger
            </button>
            <button className="px-5 py-2.5 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-xl text-sm font-medium transition-all">
              Ghost
            </button>
            <button className="px-5 py-2.5 bg-blue-600/50 text-white rounded-xl text-sm font-medium cursor-not-allowed flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading...
            </button>
          </div>
        </Section>

        {/* --- Badges --- */}
        <Section title="Badges">
          <div className="flex flex-wrap gap-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">Default</span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">Primary</span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">Success</span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">Warning</span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400">Danger</span>
          </div>
        </Section>

        {/* --- Alerts --- */}
        <Section title="Alerts">
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">Action Successful</h4>
                <p className="text-sm text-emerald-700 dark:text-emerald-400/80 mt-1">Your changes have been saved successfully.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-xl">
              <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-rose-800 dark:text-rose-300">Validation Error</h4>
                <p className="text-sm text-rose-700 dark:text-rose-400/80 mt-1">Please ensure all required fields are filled out correctly.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300">Information</h4>
                <p className="text-sm text-blue-700 dark:text-blue-400/80 mt-1">A new software update is available for download.</p>
              </div>
            </div>
          </div>
        </Section>

        {/* --- Cards --- */}
        <Section title="Cards">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
              <div className="p-6 relative">
                <img src="https://i.pravatar.cc/150?img=11" alt="Profile" className="w-16 h-16 rounded-full border-4 border-white dark:border-gray-800 absolute -top-8 left-6" />
                <div className="mt-8">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Alex Morgan</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Senior Frontend Developer</p>
                  <p className="mt-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">Passionate about building accessible and blazingly fast web applications.</p>
                </div>
                <div className="mt-6 flex gap-3">
                  <button className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors">Follow</button>
                  <button className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-xl text-sm font-medium transition-colors">Message</button>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400">
                    <Settings className="w-6 h-6" />
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">Pro Plan</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Advanced Settings</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Configure your workspace preferences, API keys, and team member permissions.</p>
              </div>
              <button className="mt-6 w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl text-sm font-medium transition-colors">
                Manage Settings
              </button>
            </div>
          </div>
        </Section>

        {/* --- Interactive: Modal & Toast --- */}
        <Section title="Interactive Overlays (Modal & Toast)">
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm text-sm font-medium transition-all"
            >
              Open Modal
            </button>
            <button 
              onClick={() => triggerToast('success', 'File successfully uploaded!')}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm text-sm font-medium transition-all"
            >
              Trigger Success Toast
            </button>
            <button 
              onClick={() => triggerToast('error', 'Failed to save changes.')}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-sm text-sm font-medium transition-all"
            >
              Trigger Error Toast
            </button>
          </div>
        </Section>

        {/* --- Navigation Components --- */}
        <Section title="Navigation (Tabs & Breadcrumbs)">
          {/* Breadcrumbs */}
          <nav className="flex mb-8 text-sm text-gray-500 dark:text-gray-400 font-medium">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <a href="#" className="inline-flex items-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <Home className="w-4 h-4 mr-2" />
                  Dashboard
                </a>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRight className="w-4 h-4 mx-1" />
                  <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Settings</a>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <ChevronRight className="w-4 h-4 mx-1" />
                  <span className="text-gray-800 dark:text-gray-200">Profile</span>
                </div>
              </li>
            </ol>
          </nav>

          {/* Tabs */}
          <div>
            <div className="border-b border-gray-200 dark:border-gray-800">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                {['Account', 'Security', 'Billing'].map((tab, idx) => {
                  const id = `tab${idx + 1}`;
                  return (
                    <button
                      key={id}
                      onClick={() => setActiveTab(id)}
                      className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === id
                          ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-700'
                      }`}
                    >
                      {tab}
                    </button>
                  );
                })}
              </nav>
            </div>
            <div className="mt-6 min-h-[100px] text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === 'tab1' && 'Update your account information, profile photo, and personal details here.'}
                  {activeTab === 'tab2' && 'Manage your password, 2FA settings, and review active sessions.'}
                  {activeTab === 'tab3' && 'View your billing history, update payment methods, and download invoices.'}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Section>

        {/* --- Dropdown & Accordion --- */}
        <Section title="Disclosure (Dropdown & Accordion)">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Dropdown */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Dropdown Menu</h4>
              <div className="relative inline-block text-left">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="inline-flex justify-center w-full rounded-xl border border-gray-300 dark:border-gray-700 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none transition-colors"
                >
                  Options
                  <ChevronDown className="-mr-1 ml-2 h-5 w-5 text-gray-400" />
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="origin-top-right absolute left-0 mt-2 w-56 rounded-xl shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 dark:ring-white dark:ring-opacity-10 focus:outline-none z-10 border border-gray-100 dark:border-gray-700"
                    >
                      <div className="py-1">
                        <button className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                          <User className="mr-3 h-4 w-4 text-gray-400" /> Account settings
                        </button>
                        <button className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                          <AlertTriangle className="mr-3 h-4 w-4 text-gray-400" /> Support
                        </button>
                        <button className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                          <Trash2 className="mr-3 h-4 w-4 text-rose-500" /> Delete workspace
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Accordion */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Accordion FAQ</h4>
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800">
                {[
                  { q: 'Is there a free trial?', a: 'Yes, we offer a 14-day free trial on all premium plans.' },
                  { q: 'Can I cancel anytime?', a: 'Absolutely. You can cancel your subscription at any time without penalty.' }
                ].map((item, idx) => (
                  <div key={idx} className="border-b border-gray-200 dark:border-gray-700 last:border-0">
                    <button
                      onClick={() => setExpandedAccordion(expandedAccordion === idx ? null : idx)}
                      className="w-full flex justify-between items-center px-4 py-3 text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors focus:outline-none"
                    >
                      {item.q}
                      {expandedAccordion === idx ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                    </button>
                    <AnimatePresence>
                      {expandedAccordion === idx && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-900/30">
                            {item.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </Section>

        {/* --- Progress & Loaders --- */}
        <Section title="Progress & Loaders">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Progress Bar</h4>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-2 overflow-hidden">
                <motion.div 
                  className="bg-blue-600 h-2.5 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "linear", duration: 1 }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 font-medium">
                <span>Uploading files...</span>
                <span>{progress}%</span>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Skeleton Loader</h4>
              <div className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-10 w-10"></div>
                <div className="flex-1 space-y-3 py-1">
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            </div>

          </div>
        </Section>

        {/* --- Table & Pagination --- */}
        <Section title="Data Display (Table & Pagination)">
          <div className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden mb-6">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Invoice</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">INV-001</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">$250.00</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">Paid</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">INV-002</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">$120.00</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">Pending</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">Showing 1 to 2 of 24 results</span>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700">
                Previous
              </button>
              <button className="relative inline-flex items-center px-4 py-2 border border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-sm font-medium text-blue-600 dark:text-blue-400 z-10">
                1
              </button>
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                2
              </button>
              <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700">
                Next
              </button>
            </nav>
          </div>
        </Section>

        {/* --- Empty State --- */}
        <Section title="Empty State">
          <div className="text-center py-12 px-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl">
            <FolderOpen className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No projects found</h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">Get started by creating a new project. Once created, they will appear here in your workspace.</p>
            <div className="mt-6">
              <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <Plus className="-ml-1 mr-2 h-5 w-5" />
                New Project
              </button>
            </div>
          </div>
        </Section>

      </div>

      {/* Portals / Fixed elements */}
      {/* Modal Overlay */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-gray-200 dark:border-gray-800"
            >
              <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Confirmation</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-500 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="px-6 py-6">
                <p className="text-sm text-gray-600 dark:text-gray-300">Are you sure you want to proceed with this action? This cannot be undone once confirmed.</p>
              </div>
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3 rounded-b-2xl">
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  Cancel
                </button>
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors">
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl max-w-sm w-full"
          >
            {toast.type === 'success' ? (
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            ) : (
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {toast.type === 'success' ? 'Success' : 'Error'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{toast.message}</p>
            </div>
            <button onClick={() => setToast(null)} className="flex-shrink-0 ml-4 text-gray-400 hover:text-gray-500">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default UXTest;
