import React from 'react';
import { AlertCircle } from 'lucide-react';
import Card from './Card';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <Card className="border-destructive bg-destructive/10">
      <div className="flex items-start gap-4">
        <AlertCircle className="text-destructive mt-1" size={24} />
        <div className="flex-1">
          <h3 className="text-destructive font-semibold mb-1">Something went wrong</h3>
          <p className="text-destructive/80 mb-4">{message || 'An unexpected error occurred.'}</p>
          {onRetry && (
            <button 
              onClick={onRetry}
              className="btn btn-destructive btn-sm"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ErrorMessage;
