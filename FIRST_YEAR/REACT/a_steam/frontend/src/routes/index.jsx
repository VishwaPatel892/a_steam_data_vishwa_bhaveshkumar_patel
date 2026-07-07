
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile } from '../store/slices/authSlice';
import { Loader } from '../components';

// Layouts
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';

// Components
import ProtectedRoute from '../components/ProtectedRoute';

// Pages
import Dashboard from '../pages/Dashboard';
import Login from '../pages/Login';
import Register from '../pages/Register';
import UsersPage from '../pages/Users';
import AnalyticsPage from '../pages/Analytics';
import ProfilePage from '../pages/Profile';
import SettingsPage from '../pages/Settings';
import FormTest from '../pages/FormTest';
import UXTest from '../pages/UXTest';
import Games from '../pages/Games';
import Reviews from '../pages/Reviews';

const router = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: 'users',
            element: <UsersPage />,
          },
          {
            path: 'analytics',
            element: <AnalyticsPage />,
          },
          {
            path: 'profile',
            element: <ProfilePage />,
          },
          {
            path: 'settings',
            element: <SettingsPage />,
          },
          {
            path: 'games',
            element: <Games />,
          },
          {
            path: 'reviews',
            element: <Reviews />,
          },
        ],
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
      },
    ],
  },
  {
    path: '/form-test',
    element: <FormTest />,
  },
  {
    path: '/ux-test',
    element: <UXTest />,
  },
]);

const AppRoutes = () => {
  const dispatch = useDispatch();
  const { token, isAuthenticated } = useSelector((state) => state.auth);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token && !isAuthenticated) {
        await dispatch(fetchProfile());
      }
      setIsInitializing(false);
    };
    initAuth();
  }, [dispatch, token, isAuthenticated]);

  if (isInitializing) {
    return <Loader fullScreen size={50} color="primary" />;
  }

  return <RouterProvider router={router} />;
};

export default AppRoutes;
