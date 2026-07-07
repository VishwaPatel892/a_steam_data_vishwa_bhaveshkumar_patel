
import { CircularProgress, Box } from '@mui/material';

const Loader = ({ fullScreen = false, size = 40, color = 'primary' }) => {
  if (fullScreen) {
    return (
      <Box className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 z-50">
        <CircularProgress size={size} color={color} />
      </Box>
    );
  }

  return (
    <Box className="flex items-center justify-center p-4">
      <CircularProgress size={size} color={color} />
    </Box>
  );
};

export default Loader;
