import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Key, 
  Globe, 
  Moon, 
  Sun,
  Monitor,
  Save,
  Copy,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'general', label: 'General', icon: SettingsIcon },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security & Privacy', icon: Shield },
  { id: 'api', label: 'API Keys', icon: Key },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

const contentVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } }
};

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  
  // Mock States
  const [theme, setTheme] = useState('system'); // light, dark, system
  const [language, setLanguage] = useState('en');
  const [emailNotifs, setEmailNotifs] = useState({ news: true, activity: true, billing: false });
  const [privacyPublic, setPrivacyPublic] = useState(true);
  const [copiedKey, setCopiedKey] = useState(false);

  const handleCopy = () => {
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="show" 
      className="p-4 md:p-8 max-w-7xl mx-auto pb-12"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Settings
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            Manage your account settings and preferences.
          </p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm text-sm font-medium transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 w-full sm:w-auto justify-center">
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Sidebar Navigation */}
        <motion.div variants={itemVariants} className="w-full md:w-64 flex-shrink-0">
          <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-hide">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-blue-600 dark:text-blue-500' : 'text-gray-400'}`} />
                {tab.label}
              </button>
            ))}
          </nav>
        </motion.div>

        {/* Content Area */}
        <motion.div variants={itemVariants} className="flex-1 w-full min-w-0">
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.div key="profile" variants={contentVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-700/50">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Profile Settings</h3>
                  
                  <div className="flex items-center gap-6 mb-8">
                    <img src="https://i.pravatar.cc/150?img=47" alt="Avatar" className="w-20 h-20 rounded-full object-cover border-4 border-gray-50 dark:border-gray-700" />
                    <div>
                      <button className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm mb-2 block">
                        Change Avatar
                      </button>
                      <p className="text-xs text-gray-500 dark:text-gray-400">JPG, GIF or PNG. 1MB max.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">First Name</label>
                      <input type="text" defaultValue="Alexandria" className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                      <input type="text" defaultValue="Smith" className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                      <div className="relative">
                        <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                        <input type="email" defaultValue="alexandria.s@untitledui.com" className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
                      <textarea rows="4" defaultValue="Product designer with a passion for creating intuitive and beautiful user experiences." className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"></textarea>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'general' && (
              <motion.div key="general" variants={contentVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-700/50">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">General Preferences</h3>
                  
                  <div className="space-y-8">
                    {/* Theme */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Theme Preference</h4>
                      <div className="grid grid-cols-3 gap-3 max-w-lg">
                        <button 
                          onClick={() => setTheme('light')}
                          className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${theme === 'light' ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10' : 'border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600'}`}
                        >
                          <Sun className={`w-6 h-6 ${theme === 'light' ? 'text-blue-500' : 'text-gray-400'}`} />
                          <span className={`text-sm font-medium ${theme === 'light' ? 'text-blue-700 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>Light</span>
                        </button>
                        <button 
                          onClick={() => setTheme('dark')}
                          className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${theme === 'dark' ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10' : 'border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600'}`}
                        >
                          <Moon className={`w-6 h-6 ${theme === 'dark' ? 'text-blue-500' : 'text-gray-400'}`} />
                          <span className={`text-sm font-medium ${theme === 'dark' ? 'text-blue-700 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>Dark</span>
                        </button>
                        <button 
                          onClick={() => setTheme('system')}
                          className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${theme === 'system' ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10' : 'border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600'}`}
                        >
                          <Monitor className={`w-6 h-6 ${theme === 'system' ? 'text-blue-500' : 'text-gray-400'}`} />
                          <span className={`text-sm font-medium ${theme === 'system' ? 'text-blue-700 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>System</span>
                        </button>
                      </div>
                    </div>

                    <hr className="border-gray-100 dark:border-gray-700/50" />

                    {/* Language */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Language</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Select the language used in the dashboard.</p>
                      <div className="relative max-w-sm">
                        <Globe className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                        <select 
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                          className="w-full pl-10 pr-10 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
                        >
                          <option value="en">English (US)</option>
                          <option value="es">Español</option>
                          <option value="fr">Français</option>
                          <option value="de">Deutsch</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'notifications' && (
              <motion.div key="notifications" variants={contentVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-700/50">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Email Notifications</h3>
                  
                  <div className="space-y-6">
                    {/* Toggle Item */}
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">News and updates</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Receive news about new features and product updates.</p>
                      </div>
                      <button 
                        onClick={() => setEmailNotifs({...emailNotifs, news: !emailNotifs.news})}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${emailNotifs.news ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'}`}
                      >
                        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${emailNotifs.news ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">Account activity</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Receive emails when someone logs into your account or changes your password.</p>
                      </div>
                      <button 
                        onClick={() => setEmailNotifs({...emailNotifs, activity: !emailNotifs.activity})}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${emailNotifs.activity ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'}`}
                      >
                        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${emailNotifs.activity ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">Billing and receipts</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Receive monthly emails with billing information and receipts.</p>
                      </div>
                      <button 
                        onClick={() => setEmailNotifs({...emailNotifs, billing: !emailNotifs.billing})}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${emailNotifs.billing ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'}`}
                      >
                        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${emailNotifs.billing ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div key="security" variants={contentVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
                
                {/* Privacy */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-700/50">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Privacy</h3>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">Public Profile</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Allow anyone to view your profile and see your activity.</p>
                    </div>
                    <button 
                        onClick={() => setPrivacyPublic(!privacyPublic)}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${privacyPublic ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'}`}
                      >
                        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${privacyPublic ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                  </div>
                </div>

                {/* Security */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-700/50">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Security</h3>
                  
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">Password</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Set a unique password to protect your account.</p>
                      </div>
                      <button className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm whitespace-nowrap">
                        Change Password
                      </button>
                    </div>

                    <hr className="border-gray-100 dark:border-gray-700/50" />

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Add an extra layer of security using an authenticator app.</p>
                      </div>
                      <button className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm whitespace-nowrap">
                        Enable 2FA
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'api' && (
              <motion.div key="api" variants={contentVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-700/50">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">API Keys</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage API keys to access our services programmatically.</p>
                    </div>
                    <button className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-800/50 text-sm font-medium rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors whitespace-nowrap">
                      Generate New Key
                    </button>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Production Key</span>
                      <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/20">Active</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 font-mono text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden text-ellipsis">
                        sk_prod_5j9x8y2z...4h7g6f5e
                      </code>
                      <button 
                        onClick={handleCopy}
                        className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg shadow-sm transition-colors"
                        title="Copy to clipboard"
                      >
                        {copiedKey ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">Created on Oct 24, 2023 • Last used 2 hours ago</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Settings;
