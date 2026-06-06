import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useMediaQuery, useTheme as useMuiTheme } from '@mui/material';
import { setSidebarOpen } from '../store/slices/themeSlice';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const MainLayout = () => {
  const dispatch = useDispatch();
  const { sidebarOpen } = useSelector((state) => state.theme);
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  // Auto-close sidebar on mobile
  useEffect(() => {
    if (isMobile) {
      dispatch(setSidebarOpen(false));
    } else {
      dispatch(setSidebarOpen(true));
    }
  }, [isMobile, dispatch]);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 selection:bg-primary-500/30">
      
      <Sidebar isOpen={sidebarOpen} isMobile={isMobile} />

      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <Navbar />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>

    </div>
  );
};

export default MainLayout;
