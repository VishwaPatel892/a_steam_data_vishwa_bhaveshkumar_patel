import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Typography, Divider, Alert } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Input, Button } from '../components';
import { registerUser } from '../store/slices/authSlice';

const RegisterSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Name must be at least 3 characters')
    .required('Full Name is required'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleRegister = async (values) => {
    // Only pass fields expected by backend
    const payload = {
      name: values.name,
      email: values.email,
      password: values.password
    };

    const resultAction = await dispatch(registerUser(payload));
    
    if (registerUser.fulfilled.match(resultAction)) {
      navigate('/');
    }
  };

  return (
    <div className="w-full">
      <Typography variant="h5" className="font-bold text-center text-gray-900 dark:text-white mb-2">
        Create an account
      </Typography>
      <Typography variant="body2" className="text-center text-gray-500 dark:text-gray-400 mb-6">
        Get started with your free admin account
      </Typography>

      {error && (
        <Alert severity="error" className="mb-6 rounded-lg dark:bg-rose-500/10 dark:text-rose-400 dark:border dark:border-rose-500/20">
          {error}
        </Alert>
      )}

      <Formik
        initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
        validationSchema={RegisterSchema}
        onSubmit={handleRegister}
      >
        {() => (
          <Form className="space-y-4">
            <Input 
              name="name" 
              label="Full Name" 
              autoComplete="name" 
            />

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
              autoComplete="new-password" 
            />

            <Input 
              name="confirmPassword" 
              label="Confirm Password" 
              type="password" 
              autoComplete="new-password" 
            />

            <Button 
              type="submit" 
              fullWidth 
              size="large" 
              isLoading={isLoading}
              className="mt-2"
            >
              Sign Up
            </Button>
          </Form>
        )}
      </Formik>

      <div className="mt-6">
        <Divider className="dark:border-[#27272a]">
          <Typography variant="body2" className="text-gray-500 dark:text-gray-400 px-2">
            Already have an account?
          </Typography>
        </Divider>
        <div className="mt-6 text-center text-sm">
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
            Sign in instead
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
