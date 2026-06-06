
import { Outlet } from 'react-router-dom';
import { Box, Typography, IconButton } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../store/slices/themeSlice';

const AuthLayout = () => {
  const dispatch = useDispatch();
  const { mode } = useSelector((state) => state.theme);

  return (
    <Box className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="absolute top-4 right-4">
        <IconButton onClick={() => dispatch(toggleTheme())} color="primary">
          {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
      </div>

      <div className="w-full sm:max-w-md mt-6 px-6 py-8 bg-white dark:bg-gray-900 shadow-md overflow-hidden sm:rounded-2xl border border-gray-100 dark:border-gray-800">
        <div className="flex justify-center mb-6">
          <Typography variant="h4" className="font-bold text-primary-600 dark:text-primary-400">
            A-Steam
          </Typography>
        </div>
        
        <Outlet />
      </div>
      
      <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
        &copy; {new Date().getFullYear()} A-Steam Dashboard
      </div>
    </Box>
  );
};

export default AuthLayout;
