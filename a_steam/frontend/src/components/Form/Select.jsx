import React from 'react';
import { FormControl, InputLabel, Select as MUISelect, MenuItem, FormHelperText } from '@mui/material';
import { useField } from 'formik';

const Select = ({ name, label, options, ...props }) => {
  const [field, meta] = useField(name);
  const errorText = meta.error && meta.touched ? meta.error : '';

  return (
    <div className="mb-4 w-full">
      <FormControl fullWidth variant="outlined" error={!!errorText}>
        <InputLabel className="dark:text-gray-300">{label}</InputLabel>
        <MUISelect
          {...field}
          {...props}
          label={label}
          className="dark:text-gray-100 dark:border-gray-600"
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </MUISelect>
        {errorText && <FormHelperText>{errorText}</FormHelperText>}
      </FormControl>
    </div>
  );
};

export default Select;
