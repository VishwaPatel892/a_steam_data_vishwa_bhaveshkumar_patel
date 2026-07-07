import React, { useRef } from 'react';
import { useField } from 'formik';
import { Button, FormControl, FormHelperText } from '@mui/material';
import { Upload } from 'lucide-react';

const FileUpload = ({ name, label, accept, ...props }) => {
  const [field, meta, helpers] = useField(name);
  const { setValue } = helpers;
  const errorText = meta.error && meta.touched ? meta.error : '';
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setValue(file);
  };

  return (
    <div className="mb-4 w-full">
      <FormControl error={!!errorText} fullWidth>
        <div className="flex items-center gap-4">
          <Button
            variant="outlined"
            component="label"
            startIcon={<Upload size={18} />}
            className="dark:text-gray-200 dark:border-gray-600"
          >
            {label || "Upload File"}
            <input
              type="file"
              hidden
              accept={accept}
              ref={fileInputRef}
              onChange={handleFileChange}
              {...props}
            />
          </Button>
          <span className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-xs">
            {field.value ? field.value.name : "No file chosen"}
          </span>
        </div>
        {errorText && <FormHelperText>{errorText}</FormHelperText>}
      </FormControl>
    </div>
  );
};

export default FileUpload;
