import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  UserPlus,
  AlertTriangle,
  CheckCircle,
  MessageSquare,
  X,
  Check,
} from 'lucide-react';

const initialNotifications = [
  {
    id: 1,
    type: 'user',
    icon: UserPlus,
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-50 dark:bg-blue-500/10',
    title: 'New user registered',
    message: 'Alex Mitchell just created an account.',
    time: '2 min ago',
    read: false,
  },
  {
    id: 2,
    type: 'error',
    icon: AlertTriangle,
    iconColor: 'text-rose-500',
    iconBg: 'bg-rose-50 dark:bg-rose-500/10',
    title: 'Payment failed',
    message: 'Transaction #4921 could not be processed.',
    time: '1 hr ago',
    read: false,
  },
  {
    id: 3,
    type: 'success',
    icon: CheckCircle,
    iconColor: 'text-emerald-500',
    iconBg: 'bg-emerald-50 dark:bg-emerald-500/10',
    title: 'Deployment successful',
    message: 'v2.1.0 was deployed to production.',
    time: '3 hr ago',
    read: false,
  },
  {
    id: 4,
    type: 'message',
    icon: MessageSquare,
    iconColor: 'text-purple-500',
    iconBg: 'bg-purple-50 dark:bg-purple-500/10',
    title: 'New review submitted',
    message: 'Sarah left a review on Cyberpunk 2077.',
    time: '5 hr ago',
    read: true,
  },
];

const NotificationPanel = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const dismiss = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        id="notification-bell"
        onClick={() => setOpen((v) => !v)}
        className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-[#27272a] transition-colors relative"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <motion.span
            key={unreadCount}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-1 right-1 min-w-[16px] h-4 flex items-center justify-center rounded-full bg-rose-500 text-white text-[10px] font-bold px-0.5 border-2 border-white dark:border-[#0a0a0a]"
          >
            {unreadCount}
          </motion.span>
        )}
      </button>

      {/* Backdrop */}
      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl glass-card shadow-2xl z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-[#27272a]">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <span className="inline-flex items-center justify-center h-5 px-1.5 rounded-full bg-primary-100 dark:bg-primary-500/20 text-primary-700 dark:text-primary-400 text-xs font-bold">
                      {unreadCount}
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    <Check className="w-3 h-3" />
                    Mark all read
                  </button>
                )}
              </div>

              {/* Notification List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-[#27272a]">
                <AnimatePresence initial={false}>
                  {notifications.length === 0 ? (
                    <div className="py-10 text-center text-gray-400 dark:text-gray-500 text-sm">
                      You're all caught up 🎉
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <motion.div
                        key={n.id}
                        initial={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                        transition={{ duration: 0.2 }}
                        onClick={() => markRead(n.id)}
                        className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors ${
                          n.read
                            ? 'bg-transparent'
                            : 'bg-primary-50/50 dark:bg-primary-500/5'
                        } hover:bg-gray-50 dark:hover:bg-white/5`}
                      >
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${n.iconBg}`}
                        >
                          <n.icon className={`w-4 h-4 ${n.iconColor}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p
                              className={`text-sm font-medium leading-tight ${
                                n.read
                                  ? 'text-gray-700 dark:text-gray-300'
                                  : 'text-gray-900 dark:text-white'
                              }`}
                            >
                              {n.title}
                            </p>
                            {!n.read && (
                              <span className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                            {n.message}
                          </p>
                          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
                            {n.time}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            dismiss(n.id);
                          }}
                          className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-[#27272a] text-gray-400 transition-colors flex-shrink-0"
                          aria-label="Dismiss"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="px-4 py-2.5 border-t border-gray-100 dark:border-[#27272a] text-center">
                  <button className="text-xs text-primary-600 dark:text-primary-400 hover:underline">
                    View all notifications
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationPanel;
