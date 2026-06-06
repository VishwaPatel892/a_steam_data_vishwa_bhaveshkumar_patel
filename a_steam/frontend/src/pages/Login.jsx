
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Typography, Divider } from '@mui/material';
import { Input, Button } from '../components';
import { Link, useNavigate } from 'react-router-dom';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email format').required('Email is required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
});

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (values, { setSubmitting }) => {
    // Simulate API call
    setTimeout(() => {
      console.log('Login values:', values);
      setSubmitting(false);
      navigate('/');
    }, 1000);
  };

  return (
    <div className="w-full">
      <Typography variant="h5" className="font-bold text-center text-gray-900 dark:text-white mb-6">
        Sign in to your account
      </Typography>

      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={handleLogin}
      >
        {({ isSubmitting }) => (
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
              isLoading={isSubmitting}
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
          <Link to="#" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
