/**
 * ToastContainer — Renders all active toast notifications from Redux state.
 *
 * Mount this once in App.jsx (inside the Provider but outside the Router).
 * Toasts auto-dismiss after their `duration` ms.
 */

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { dismissToast } from '../store/slices/uiSlice.js';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  X,
} from 'lucide-react';

const ICONS = {
  success: CheckCircle,
  error:   XCircle,
  warning: AlertTriangle,
  info:    Info,
};

const STYLES = {
  success: {
    icon:    'text-emerald-500',
    bar:     'bg-emerald-500',
    wrapper: 'bg-white dark:bg-[#111111] border-l-4 border-emerald-500',
  },
  error: {
    icon:    'text-rose-500',
    bar:     'bg-rose-500',
    wrapper: 'bg-white dark:bg-[#111111] border-l-4 border-rose-500',
  },
  warning: {
    icon:    'text-amber-500',
    bar:     'bg-amber-500',
    wrapper: 'bg-white dark:bg-[#111111] border-l-4 border-amber-500',
  },
  info: {
    icon:    'text-blue-500',
    bar:     'bg-blue-500',
    wrapper: 'bg-white dark:bg-[#111111] border-l-4 border-blue-500',
  },
};

// ── Single Toast Item ───────────────────────────────────────────────────────
const ToastItem = ({ id, type, title, message, duration }) => {
  const dispatch = useDispatch();
  const style = STYLES[type] || STYLES.info;
  const Icon  = ICONS[type]  || Info;

  // Auto-dismiss
  useEffect(() => {
    const timer = setTimeout(() => dispatch(dismissToast(id)), duration);
    return () => clearTimeout(timer);
  }, [id, duration, dispatch]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 60, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`relative flex items-start gap-3 w-80 rounded-xl shadow-lg overflow-hidden p-4 ${style.wrapper}`}
      role="alert"
      aria-live="polite"
    >
      {/* Progress bar */}
      <motion.div
        className={`absolute bottom-0 left-0 h-0.5 ${style.bar}`}
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: duration / 1000, ease: 'linear' }}
      />

      {/* Icon */}
      <div className="flex-shrink-0 mt-0.5">
        <Icon className={`w-5 h-5 ${style.icon}`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {title && (
          <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
            {title}
          </p>
        )}
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5 leading-snug">
          {message}
        </p>
      </div>

      {/* Close button */}
      <button
        onClick={() => dispatch(dismissToast(id))}
        className="flex-shrink-0 p-0.5 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

// ── Container ───────────────────────────────────────────────────────────────
const ToastContainer = () => {
  const toasts = useSelector((state) => state.ui.toasts);

  return (
    <div
      aria-label="Notifications"
      className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 items-end"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <ToastItem key={t.id} {...t} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
