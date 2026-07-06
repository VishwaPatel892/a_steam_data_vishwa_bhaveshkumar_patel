import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@mui/material';
import { Inbox } from 'lucide-react';

const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No Data Found',
  description = 'There is currently no data to display here.',
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center p-8 text-center bg-gray-50/50 dark:bg-[#1a1a1a]/50 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 ${className}`}
    >
      <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="contained" color="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

export default EmptyState;
