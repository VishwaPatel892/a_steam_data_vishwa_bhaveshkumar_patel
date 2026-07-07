import React from 'react';
import Input from './Input';
import Select from './Select';
import CheckboxGroup from './CheckboxGroup';
import RadioGroup from './RadioGroup';
import DatePicker from './DatePicker';
import FileUpload from './FileUpload';

const DynamicForm = ({ fields }) => {
  return (
    <>
      {fields.map((field) => {
        const { type, name, label, options, ...rest } = field;

        switch (type) {
          case 'text':
          case 'email':
          case 'password':
          case 'number':
            return <Input key={name} type={type} name={name} label={label} {...rest} />;
          case 'select':
            return <Select key={name} name={name} label={label} options={options} {...rest} />;
          case 'checkbox':
            return <CheckboxGroup key={name} name={name} label={label} options={options} {...rest} />;
          case 'radio':
            return <RadioGroup key={name} name={name} label={label} options={options} {...rest} />;
          case 'date':
            return <DatePicker key={name} name={name} label={label} {...rest} />;
          case 'file':
            return <FileUpload key={name} name={name} label={label} {...rest} />;
          default:
            return null;
        }
      })}
    </>
  );
};

export default DynamicForm;
