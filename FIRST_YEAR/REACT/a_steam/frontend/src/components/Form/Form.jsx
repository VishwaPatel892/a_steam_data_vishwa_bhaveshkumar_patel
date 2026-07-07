import React, { useState, ReactNode } from 'react';
import { Formik, Form as FormikForm } from 'formik';
import { Button } from '@mui/material';

const Form = ({ children, initialValues, onSubmit }) => {
  // Check if we have multiple steps
  const stepsArray = React.Children.toArray(children).filter(
    (child) => child.type.name === 'FormStep' || child.type.displayName === 'FormStep'
  );

  const isMultiStep = stepsArray.length > 0;
  const [activeStep, setActiveStep] = useState(0);

  const activeChild = isMultiStep ? stepsArray[activeStep] : children;

  // The active validation schema is determined by the current step if multi-step
  const currentValidationSchema = isMultiStep
    ? activeChild.props.validationSchema
    : undefined;

  const isLastStep = activeStep === stepsArray.length - 1;

  const handleNext = async (validateForm, setTouched, values) => {
    // Validate current step
    const errors = await validateForm();
    if (Object.keys(errors).length === 0) {
      setActiveStep((prev) => prev + 1);
      setTouched({});
    } else {
      // Mark all fields in current step as touched to show errors
      const touchedFields = Object.keys(errors).reduce((acc, field) => {
        acc[field] = true;
        return acc;
      }, {});
      setTouched(touchedFields);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={currentValidationSchema}
      onSubmit={(values, actions) => {
        if (isMultiStep && !isLastStep) {
          // If the form tries to submit but it's not the last step (e.g., pressing enter)
          // we should ideally move to next step, but here we just let the buttons handle it
          actions.setSubmitting(false);
        } else {
          onSubmit(values, actions);
        }
      }}
    >
      {({ isSubmitting, validateForm, setTouched, values }) => (
        <FormikForm className="w-full flex flex-col space-y-4">
          
          {/* Step Indicators */}
          {isMultiStep && (
            <div className="flex justify-between mb-6">
              {stepsArray.map((step, index) => (
                <div
                  key={index}
                  className={`flex-1 text-center py-2 text-sm font-semibold border-b-2 transition-colors duration-300 ${
                    activeStep === index
                      ? 'border-blue-500 text-blue-500'
                      : activeStep > index
                      ? 'border-green-500 text-green-500'
                      : 'border-gray-300 text-gray-400 dark:border-gray-700'
                  }`}
                >
                  {step.props.stepName || `Step ${index + 1}`}
                </div>
              ))}
            </div>
          )}

          {/* Form Content */}
          <div className="py-2">
            {activeChild}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            {isMultiStep && activeStep > 0 ? (
              <Button onClick={handleBack} variant="outlined">
                Back
              </Button>
            ) : (
              <div></div> // Placeholder for alignment
            )}

            {isMultiStep && !isLastStep ? (
              <Button
                type="button"
                variant="contained"
                onClick={() => handleNext(validateForm, setTouched, values)}
              >
                Next
              </Button>
            ) : (
              <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            )}
          </div>
        </FormikForm>
      )}
    </Formik>
  );
};

export default Form;
