import React from 'react';

const FormStep = ({ children, stepName, validationSchema }) => {
  return (
    <div className="form-step animate-fadeIn">
      {children}
    </div>
  );
};

export default FormStep;
