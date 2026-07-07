import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@mui/material';
import { AlertCircle, RefreshCw } from 'lucide-react';

const ErrorState = ({
  title = 'Something went wrong',
  description = 'An error occurred while loading this content. Please try again.',
  onRetry,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex flex-col items-center justify-center p-8 text-center bg-rose-50 dark:bg-rose-900/10 rounded-2xl border border-rose-200 dark:border-rose-900/30 ${className}`}
    >
      <div className="mb-4 text-rose-500 dark:text-rose-400">
        <AlertCircle className="w-12 h-12" />
      </div>
      <h3 className="text-lg font-semibold text-rose-800 dark:text-rose-300 mb-2">
        {title}
      </h3>
      <p className="text-sm text-rose-600 dark:text-rose-400/80 max-w-sm mb-6">
        {description}
      </p>
      {onRetry && (
        <Button
          variant="outlined"
          color="error"
          onClick={onRetry}
          startIcon={<RefreshCw className="w-4 h-4" />}
        >
          Retry
        </Button>
      )}
    </motion.div>
  );
};

export default ErrorState;
