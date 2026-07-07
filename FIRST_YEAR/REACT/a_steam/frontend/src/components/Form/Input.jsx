import React from 'react';
import { TextField } from '@mui/material';
import { useField } from 'formik';

const Input = ({ name, label, ...props }) => {
  const [field, meta] = useField(name);
  const errorText = meta.error && meta.touched ? meta.error : '';

  return (
    <div className="mb-4 w-full">
      <TextField
        {...field}
        {...props}
        label={label}
        fullWidth
        variant="outlined"
        error={!!errorText}
        helperText={errorText}
        InputLabelProps={{
          className: "dark:text-gray-300",
        }}
        InputProps={{
          className: "dark:text-gray-100 dark:border-gray-600",
        }}
      />
    </div>
  );
};

export default Input;
