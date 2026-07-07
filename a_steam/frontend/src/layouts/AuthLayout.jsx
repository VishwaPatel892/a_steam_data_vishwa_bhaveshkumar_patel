import { Outlet } from 'react-router-dom';
import { Box, IconButton } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../store/slices/themeSlice';

const AuthLayout = () => {
  const dispatch = useDispatch();
  const { mode } = useSelector((state) => state.theme);

  return (
    <Box className="min-h-screen relative bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="absolute top-4 right-4 z-50">
        <IconButton onClick={() => dispatch(toggleTheme())} color="primary" sx={{ bgcolor: 'background.paper', boxShadow: 1 }}>
          {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
      </div>
      
      <Outlet />
    </Box>
  );
};

export default AuthLayout;
