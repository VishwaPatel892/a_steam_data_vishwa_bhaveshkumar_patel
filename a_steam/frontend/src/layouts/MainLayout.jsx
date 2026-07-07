import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useMediaQuery, useTheme as useMuiTheme } from '@mui/material';
import { setSidebarOpen } from '../store/slices/themeSlice';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Breadcrumbs from './Breadcrumbs';
import Footer from './Footer';

const MainLayout = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { sidebarOpen } = useSelector((state) => state.theme);
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  // Auto-close sidebar on mobile, open on desktop
  useEffect(() => {
    if (isMobile) {
      dispatch(setSidebarOpen(false));
    } else {
      dispatch(setSidebarOpen(true));
    }
  }, [isMobile, dispatch]);

  // Close mobile drawer on route change
  useEffect(() => {
    if (isMobile) {
      dispatch(setSidebarOpen(false));
    }
  }, [location.pathname, isMobile, dispatch]);

  return (
    <div className="flex h-screen overflow-hidden bg-[#0B1120] text-white selection:bg-blue-500/30">

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} isMobile={isMobile} />

      {/* Main content area */}
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-x-hidden overflow-y-auto scrollbar-thin">
          <div className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8">
            <Breadcrumbs />
            <Outlet />
          </div>

          <Footer />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
