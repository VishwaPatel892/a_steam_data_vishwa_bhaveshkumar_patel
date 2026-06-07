import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Bell,
  Shield,
  Palette,
  Globe,
  Database,
  ChevronRight,
  Moon,
  Sun,
  Monitor,
  Check,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '../store/slices/themeSlice';
import { GlassCard, Button } from '../components';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 22 } },
};

const Toggle = ({ checked, onChange, id }) => (
  <button
    id={id}
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className={`relative inline-flex w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 ${
      checked ? 'bg-primary-600' : 'bg-gray-200 dark:bg-[#27272a]'
    }`}
  >
    <span
      className={`inline-block w-5 h-5 rounded-full bg-white shadow transform transition-transform duration-200 mt-0.5 ${
        checked ? 'translate-x-5' : 'translate-x-0.5'
      }`}
    />
  </button>
);

const SettingsPage = () => {
  const dispatch = useDispatch();
  const { mode } = useSelector((s) => s.theme);

  const [notifs, setNotifs] = useState({
    emailAlerts: true,
    pushNotifs: false,
    weeklyReport: true,
    securityAlerts: true,
  });

  const [privacy, setPrivacy] = useState({
    twoFactor: false,
    sessionTimeout: true,
    activityLog: true,
  });

  const sectionIcon = (Icon, color) => (
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
      <Icon className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
    </div>
  );

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 max-w-3xl">
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
          <Settings className="w-8 h-8 text-primary-500" />
          Settings
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Configure your admin dashboard preferences.
        </p>
      </motion.div>

      {/* Appearance */}
      <motion.div variants={itemVariants}>
        <GlassCard>
          <div className="flex items-center gap-3 mb-5">
            {sectionIcon(Palette, 'bg-gradient-to-br from-purple-500 to-pink-500')}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Appearance</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Choose your preferred theme.</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Light', value: 'light', icon: Sun },
              { label: 'Dark', value: 'dark', icon: Moon },
              { label: 'System', value: 'system', icon: Monitor },
            ].map(({ label, value, icon: Icon }) => {
              const active = mode === value || (value === 'system' && !['light', 'dark'].includes(mode));
              return (
                <button
                  key={value}
                  id={`theme-${value}`}
                  onClick={() => dispatch(setTheme(value === 'system' ? 'light' : value))}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    active
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10'
                      : 'border-gray-200 dark:border-[#27272a] hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${active ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500'}`} />
                  <span className={`text-sm font-medium ${active ? 'text-primary-700 dark:text-primary-300' : 'text-gray-600 dark:text-gray-400'}`}>
                    {label}
                  </span>
                  {active && <Check className="w-3.5 h-3.5 text-primary-500 -mt-1" />}
                </button>
              );
            })}
          </div>
        </GlassCard>
      </motion.div>

      {/* Notifications */}
      <motion.div variants={itemVariants}>
        <GlassCard>
          <div className="flex items-center gap-3 mb-5">
            {sectionIcon(Bell, 'bg-gradient-to-br from-amber-500 to-orange-500')}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Control how you receive alerts.</p>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { key: 'emailAlerts', label: 'Email Alerts', desc: 'Receive important updates via email.' },
              { key: 'pushNotifs', label: 'Push Notifications', desc: 'Browser push notifications.' },
              { key: 'weeklyReport', label: 'Weekly Report', desc: 'Summary email every Monday.' },
              { key: 'securityAlerts', label: 'Security Alerts', desc: 'Alerts for suspicious activity.' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{desc}</p>
                </div>
                <Toggle
                  id={`notif-${key}`}
                  checked={notifs[key]}
                  onChange={(v) => setNotifs((n) => ({ ...n, [key]: v }))}
                />
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Security & Privacy */}
      <motion.div variants={itemVariants}>
        <GlassCard>
          <div className="flex items-center gap-3 mb-5">
            {sectionIcon(Shield, 'bg-gradient-to-br from-emerald-500 to-teal-500')}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Security & Privacy</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Protect your account.</p>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { key: 'twoFactor', label: 'Two-Factor Authentication', desc: 'Add an extra layer of security.' },
              { key: 'sessionTimeout', label: 'Auto Session Timeout', desc: 'Sign out after 30 min of inactivity.' },
              { key: 'activityLog', label: 'Activity Log', desc: 'Track sign-in history.' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{desc}</p>
                </div>
                <Toggle
                  id={`security-${key}`}
                  checked={privacy[key]}
                  onChange={(v) => setPrivacy((p) => ({ ...p, [key]: v }))}
                />
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-[#27272a]">
            <button
              id="change-password-btn"
              className="flex items-center justify-between w-full py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors group"
            >
              <span className="font-medium">Change Password</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </GlassCard>
      </motion.div>

      {/* Danger Zone */}
      <motion.div variants={itemVariants}>
        <GlassCard>
          <div className="flex items-center gap-3 mb-5">
            {sectionIcon(Database, 'bg-gradient-to-br from-rose-500 to-red-600')}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Danger Zone</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Irreversible actions.</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              id="clear-data-btn"
              className="flex-1 px-4 py-2.5 text-sm font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors"
            >
              Clear Cache
            </button>
            <button
              id="delete-account-btn"
              className="flex-1 px-4 py-2.5 text-sm font-medium text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors"
            >
              Delete Account
            </button>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
};

export default SettingsPage;
