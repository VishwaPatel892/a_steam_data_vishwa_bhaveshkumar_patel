import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@mui/material';
import { CheckCircle2 } from 'lucide-react';

const SuccessState = ({
  title = 'Success!',
  description = 'The action was completed successfully.',
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex flex-col items-center justify-center p-8 text-center bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-200 dark:border-emerald-900/30 ${className}`}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
        className="mb-4 text-emerald-500 dark:text-emerald-400"
      >
        <CheckCircle2 className="w-12 h-12" />
      </motion.div>
      <h3 className="text-lg font-semibold text-emerald-800 dark:text-emerald-300 mb-2">
        {title}
      </h3>
      <p className="text-sm text-emerald-600 dark:text-emerald-400/80 max-w-sm mb-6">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button
          variant="contained"
          color="success"
          onClick={onAction}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

export default SuccessState;
