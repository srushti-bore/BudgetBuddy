import React from 'react';

const Input = React.forwardRef(({ className = '', label, error, ...props }, ref) => {
  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      <input
        ref={ref}
        className={`input ${error ? 'border-destructive' : ''} ${className}`}
        {...props}
      />
      {error && <span className="text-destructive text-sm mt-1">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
