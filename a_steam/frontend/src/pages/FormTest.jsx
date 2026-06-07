import React from 'react';
import * as Yup from 'yup';
import { Typography, Paper, Box } from '@mui/material';
import { Form, FormStep, DynamicForm } from '../components/Form';

const validationSchemaStep1 = Yup.object({
  firstName: Yup.string().required('First Name is required'),
  lastName: Yup.string().required('Last Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
});

const validationSchemaStep2 = Yup.object({
  role: Yup.string().required('Role is required'),
  skills: Yup.array().min(1, 'Select at least one skill'),
  gender: Yup.string().required('Gender is required'),
  dob: Yup.date().required('Date of birth is required'),
});

const validationSchemaStep3 = Yup.object({
  resume: Yup.mixed().required('Resume is required'),
});

const step1Fields = [
  { name: 'firstName', label: 'First Name', type: 'text' },
  { name: 'lastName', label: 'Last Name', type: 'text' },
  { name: 'email', label: 'Email', type: 'email' },
];

const step2Fields = [
  {
    name: 'role',
    label: 'Role',
    type: 'select',
    options: [
      { label: 'Developer', value: 'developer' },
      { label: 'Designer', value: 'designer' },
      { label: 'Manager', value: 'manager' },
    ],
  },
  {
    name: 'skills',
    label: 'Skills',
    type: 'checkbox',
    options: [
      { label: 'React', value: 'react' },
      { label: 'Node.js', value: 'node' },
      { label: 'Python', value: 'python' },
    ],
  },
  {
    name: 'gender',
    label: 'Gender',
    type: 'radio',
    options: [
      { label: 'Male', value: 'male' },
      { label: 'Female', value: 'female' },
      { label: 'Other', value: 'other' },
    ],
  },
  { name: 'dob', label: 'Date of Birth', type: 'date' },
];

const step3Fields = [
  { name: 'resume', label: 'Upload Resume', type: 'file' },
];

const FormTest = () => {
  const handleSubmit = (values, actions) => {
    console.log('Form Submitted Successfully!', values);
    alert('Form submitted! Check console for values.');
    actions.setSubmitting(false);
  };

  return (
    <Box className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
      <Paper className="p-8 max-w-2xl w-full bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
        <Typography variant="h4" className="mb-6 text-center font-bold text-gray-800 dark:text-white">
          Multi-Step Dynamic Form Test
        </Typography>

        <Form
          initialValues={{
            firstName: '',
            lastName: '',
            email: '',
            role: '',
            skills: [],
            gender: '',
            dob: '',
            resume: null,
          }}
          onSubmit={handleSubmit}
        >
          <FormStep stepName="Personal Info" validationSchema={validationSchemaStep1}>
            <DynamicForm fields={step1Fields} />
          </FormStep>

          <FormStep stepName="Professional Details" validationSchema={validationSchemaStep2}>
            <DynamicForm fields={step2Fields} />
          </FormStep>

          <FormStep stepName="Documents" validationSchema={validationSchemaStep3}>
            <DynamicForm fields={step3Fields} />
          </FormStep>
        </Form>
      </Paper>
    </Box>
  );
};

export default FormTest;
