import React from 'react';
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, FormHelperText } from '@mui/material';
import { useField } from 'formik';

const CheckboxGroup = ({ name, label, options, ...props }) => {
  const [field, meta, helpers] = useField(name);
  const { setValue } = helpers;
  const errorText = meta.error && meta.touched ? meta.error : '';

  const handleChange = (event) => {
    const value = event.target.value;
    const isChecked = event.target.checked;
    
    // Assume field.value is an array
    let newValue = [...(field.value || [])];
    if (isChecked) {
      newValue.push(value);
    } else {
      newValue = newValue.filter((v) => v !== value);
    }
    setValue(newValue);
  };

  return (
    <div className="mb-4 w-full">
      <FormControl component="fieldset" error={!!errorText}>
        <FormLabel component="legend" className="dark:text-gray-300">{label}</FormLabel>
        <FormGroup row>
          {options.map((option) => (
            <FormControlLabel
              key={option.value}
              control={
                <Checkbox
                  checked={(field.value || []).includes(option.value)}
                  onChange={handleChange}
                  value={option.value}
                  name={name}
                  {...props}
                />
              }
              label={option.label}
              className="dark:text-gray-100"
            />
          ))}
        </FormGroup>
        {errorText && <FormHelperText>{errorText}</FormHelperText>}
      </FormControl>
    </div>
  );
};

export default CheckboxGroup;
