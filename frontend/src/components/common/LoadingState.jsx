import React from 'react';
import Loader from './Loader';

const LoadingState = ({ text = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 min-h-[300px] w-full h-full">
      <Loader size={32} className="mb-4" />
      <p className="text-muted-foreground">{text}</p>
    </div>
  );
};

export default LoadingState;
