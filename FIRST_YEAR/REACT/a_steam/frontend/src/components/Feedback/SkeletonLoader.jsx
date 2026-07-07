import React from 'react';
import { Skeleton } from '@mui/material';

const SkeletonLoader = ({ variant = 'text', width, height, className, count = 1, ...props }) => {
  const Skeletons = Array.from(new Array(count));

  return (
    <>
      {Skeletons.map((_, index) => (
        <Skeleton
          key={index}
          variant={variant}
          width={width}
          height={height}
          animation="wave"
          className={`bg-gray-200 dark:bg-gray-700/50 ${className || ''}`}
          {...props}
        />
      ))}
    </>
  );
};

export default SkeletonLoader;
