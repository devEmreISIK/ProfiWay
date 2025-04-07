import React from 'react';
import { FileX } from 'lucide-react';

const EmptyState = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-lg shadow-sm p-8">
      <FileX className="h-16 w-16 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz başvuru yok</h3>
      <p className="text-gray-600">{message}</p>
    </div>
  );
};

export default EmptyState;