import React from 'react';
import { getStatusBadgeClass, getPaymentBadgeClass } from '../../utils/formatters';

export const StatusBadge = ({ status }) => {
  const badgeClasses = getStatusBadgeClass(status);
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeClasses}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-75" />
      {status}
    </span>
  );
};

export const PaymentBadge = ({ status }) => {
  const badgeClasses = getPaymentBadgeClass(status || 'Pending');
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeClasses}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-75" />
      {status || 'Pending'}
    </span>
  );
};

export const CategoryBadge = ({ text }) => {
  return (
    <span className="inline-block px-2.5 py-0.5 text-xs font-medium bg-rose-50 text-rose-700 rounded-full border border-rose-100">
      {text}
    </span>
  );
};

export default { StatusBadge, PaymentBadge, CategoryBadge };

