import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, IconButton } from '@mui/material';
import { X, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ConfirmDialog = ({
  open,
  title = 'Are you sure?',
  content = 'This action cannot be undone.',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  isDestructive = false,
  isLoading = false,
}) => {
  return (
    <Dialog
      open={open}
      onClose={!isLoading ? onCancel : undefined}
      PaperProps={{
        component: motion.div,
        initial: { opacity: 0, y: 20, scale: 0.95 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 20, scale: 0.95 },
        className: 'bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden m-4 w-full max-w-sm',
      }}
      slotProps={{
        backdrop: {
          className: 'bg-black/40 backdrop-blur-sm',
        },
      }}
    >
      <DialogTitle className="flex items-center justify-between p-4 pb-0">
        <div className="flex items-center gap-3">
          {isDestructive && (
            <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-500">
              <AlertTriangle className="w-5 h-5" />
            </div>
          )}
          <Typography variant="h6" className="font-bold text-gray-900 dark:text-white">
            {title}
          </Typography>
        </div>
        {!isLoading && (
          <IconButton onClick={onCancel} size="small" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <X className="w-5 h-5" />
          </IconButton>
        )}
      </DialogTitle>
      
      <DialogContent className="p-4 pt-3">
        <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
          {content}
        </Typography>
      </DialogContent>

      <DialogActions className="p-4 pt-0 gap-2">
        <Button
          onClick={onCancel}
          disabled={isLoading}
          variant="outlined"
          className="text-gray-700 border-gray-300 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          {cancelLabel}
        </Button>
        <Button
          onClick={onConfirm}
          disabled={isLoading}
          variant="contained"
          color={isDestructive ? 'error' : 'primary'}
          className={isDestructive ? 'bg-rose-600 hover:bg-rose-700' : ''}
          disableElevation
        >
          {isLoading ? 'Processing...' : confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
