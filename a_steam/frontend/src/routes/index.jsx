
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

const router = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute />, // All children inside will require authentication
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          // Restrict users management page strictly to Admins
          // {
          //   path: '/users',
          //   element: <ProtectedRoute allowedRoles={['admin']}><UsersPage /></ProtectedRoute>
          // }
        ],
      }
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
]);

const AppRoutes = () => {
  const dispatch = useDispatch();
  const { token, isAuthenticated } = useSelector((state) => state.auth);
  const [isInitializing, setIsInitializing] = useState(true);

  // Attempt to silently auto-login / fetch profile if we have a token stored
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
