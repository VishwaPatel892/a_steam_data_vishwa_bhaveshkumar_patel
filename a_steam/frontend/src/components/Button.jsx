
import { Button as MuiButton, CircularProgress } from '@mui/material';

const Button = ({ 
  children, 
  variant = 'contained', 
  color = 'primary', 
  isLoading = false, 
  disabled = false, 
  className = '', 
  startIcon, 
  endIcon,
  ...props 
}) => {
  return (
    <MuiButton
      variant={variant}
      color={color}
      disabled={disabled || isLoading}
      startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : startIcon}
      endIcon={endIcon}
      className={`capitalize font-semibold shadow-sm hover:shadow ${className}`}
      disableElevation
      {...props}
    >
      {children}
    </MuiButton>
  );
};

export default Button;
