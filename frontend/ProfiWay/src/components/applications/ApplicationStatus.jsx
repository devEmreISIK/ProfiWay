import React from 'react';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';

const statusConfig = {
  0: { // Pending
    label: 'Beklemede',
    icon: Clock,
    className: 'bg-yellow-50 text-yellow-700 border-yellow-200'
  },
  1: { // Accepted
    label: 'Kabul Edildi',
    icon: CheckCircle2,
    className: 'bg-green-50 text-green-700 border-green-200'
  },
  2: { // Rejected
    label: 'Reddedildi',
    icon: XCircle,
    className: 'bg-red-50 text-red-700 border-red-200'
  }
};

const ApplicationStatus = ({ status }) => {
  const config = statusConfig[status] || {
    label: 'Bilinmeyen',
    icon: Clock,
    className: 'bg-gray-50 text-gray-700 border-gray-200'
  };
  
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.className}`}>
      <Icon className="h-4 w-4" />
      <span className="text-sm font-medium">{config.label}</span>
    </div>
  );
};

export default ApplicationStatus;