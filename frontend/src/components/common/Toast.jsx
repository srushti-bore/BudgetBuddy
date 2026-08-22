import React from 'react';
import { Toaster as SonnerToaster } from 'sonner';
import { useAppContext } from '../../context/AppContext';

const Toast = () => {
  const { theme } = useAppContext();
  
  return (
    <SonnerToaster 
      position="bottom-right" 
      theme={theme}
      toastOptions={{
        className: 'font-sans',
        style: {
          background: 'var(--color-card)',
          color: 'var(--color-foreground)',
          border: '1px solid var(--color-border)',
        },
      }}
    />
  );
};

export default Toast;
