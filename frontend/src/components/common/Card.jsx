import React from 'react';

const Card = React.forwardRef(({ className = '', interactive = false, children, ...props }, ref) => {
  return (
    <div 
      ref={ref} 
      className={`card ${interactive ? 'card-interactive cursor-pointer' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});
Card.displayName = 'Card';

export const CardHeader = ({ className = '', children, ...props }) => (
  <div className={`flex flex-col space-y-1.5 mb-4 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ className = '', children, ...props }) => (
  <h3 className={`font-semibold leading-none tracking-tight ${className}`} {...props}>
    {children}
  </h3>
);

export const CardContent = ({ className = '', children, ...props }) => (
  <div className={`flex-1 ${className}`} {...props}>
    {children}
  </div>
);

export default Card;
