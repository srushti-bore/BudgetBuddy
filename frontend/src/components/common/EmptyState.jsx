import React from 'react';
import { FileSearch } from 'lucide-react';

const EmptyState = ({ title = 'No data found', description = 'Try adjusting your filters or creating a new item.', action }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center animate-fade">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4 text-muted-foreground">
        <FileSearch size={32} />
      </div>
      <h3 className="heading-md mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-sm">
        {description}
      </p>
      {action}
    </div>
  );
};

export default EmptyState;
