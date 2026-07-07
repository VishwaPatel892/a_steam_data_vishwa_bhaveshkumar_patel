import React from 'react';
import { FormControl, FormLabel, RadioGroup as MUIRadioGroup, FormControlLabel, Radio, FormHelperText } from '@mui/material';
import { useField } from 'formik';

const RadioGroup = ({ name, label, options, ...props }) => {
  const [field, meta] = useField(name);
  const errorText = meta.error && meta.touched ? meta.error : '';

  return (
    <div className="mb-4 w-full">
      <FormControl component="fieldset" error={!!errorText}>
        <FormLabel component="legend" className="dark:text-gray-300">{label}</FormLabel>
        <MUIRadioGroup {...field} {...props} row>
          {options.map((option) => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={<Radio />}
              label={option.label}
              className="dark:text-gray-100"
            />
          ))}
        </MUIRadioGroup>
        {errorText && <FormHelperText>{errorText}</FormHelperText>}
      </FormControl>
    </div>
  );
};

export default RadioGroup;
