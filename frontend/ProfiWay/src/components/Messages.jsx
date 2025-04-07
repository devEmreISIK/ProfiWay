import React from 'react';
import { AlertCircle } from 'lucide-react';

const ErrorMessage = ({ message, divId }) => {
  return (
    <div id={divId} className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-red-50 text-red-700 px-6 py-4 rounded-lg flex items-center gap-3 max-w-md">
        <AlertCircle className="h-5 w-5 flex-shrink-0" />
        <p>{message}</p>
      </div>
    </div>
  );
};

export default ErrorMessage;