
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const Modal = ({ open, onClose, title, children, actions, maxWidth = 'sm', fullWidth = true }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      PaperProps={{
        className: "dark:bg-gray-800 dark:text-gray-100 rounded-xl"
      }}
    >
      <DialogTitle className="flex items-center justify-between font-bold border-b border-gray-200 dark:border-gray-700">
        {title}
        {onClose ? (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </DialogTitle>
      
      <DialogContent dividers className="dark:border-gray-700 mt-4">
        {children}
      </DialogContent>
      
      {actions && (
        <DialogActions className="border-t border-gray-200 dark:border-gray-700 p-4">
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default Modal;
