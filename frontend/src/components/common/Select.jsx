import React from 'react';

const Select = React.forwardRef(({ className = '', label, error, options = [], ...props }, ref) => {
  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      <select
        ref={ref}
        className={`select ${error ? 'border-destructive' : ''} ${className}`}
        {...props}
      >
        <option value="" disabled>Select an option</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-destructive text-sm mt-1">{error}</span>}
    </div>
  );
});

Select.displayName = 'Select';
export default Select;
