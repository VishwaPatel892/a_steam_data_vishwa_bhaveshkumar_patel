
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Typography, Divider, Alert } from '@mui/material';
import { Input, Button } from '../components';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store/slices/authSlice';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email format').required('Email is required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
});

const Login = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleLogin = async (values) => {
    const resultAction = await dispatch(loginUser(values));
    if (loginUser.fulfilled.match(resultAction)) {
      navigate('/');
    }
  };

  return (
    <div className="w-full">
      <Typography variant="h5" className="font-bold text-center text-gray-900 dark:text-white mb-6">
        Sign in to your account
      </Typography>

      {error && (
        <Alert severity="error" className="mb-6 rounded-lg dark:bg-rose-500/10 dark:text-rose-400 dark:border dark:border-rose-500/20">
          {error}
        </Alert>
      )}

      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={handleLogin}
      >
        {() => (
          <Form className="space-y-4">
            <Input 
              name="email" 
              label="Email Address" 
              type="email" 
              autoComplete="email" 
            />
            
            <Input 
              name="password" 
              label="Password" 
              type="password" 
              autoComplete="current-password" 
            />

            <div className="flex items-center justify-between pb-2">
              <div className="text-sm">
                <Link to="#" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <Button 
              type="submit" 
              fullWidth 
              size="large" 
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </Form>
        )}
      </Formik>

      <div className="mt-6">
        <Divider className="dark:border-gray-700">
          <Typography variant="body2" className="text-gray-500 dark:text-gray-400 px-2">
            Or continue with
          </Typography>
        </Divider>
        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
