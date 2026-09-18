// Currency formatter (Indian Rupees INR ₹, cleanly formatted)
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatINR = formatCurrency;

// Calculate percentage discount
export const calculateDiscount = (mrp, price) => {
  if (!mrp || !price || Number(mrp) <= Number(price)) return 0;
  return Math.round(((Number(mrp) - Number(price)) / Number(mrp)) * 100);
};

// Date formatter
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

// DateTime formatter
export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

// Order status styling dictionary
export const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'Pending':
      return 'bg-amber-100 text-amber-800 border-amber-300';
    case 'Confirmed':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'Packed':
      return 'bg-indigo-100 text-indigo-800 border-indigo-300';
    case 'Shipped':
      return 'bg-purple-100 text-purple-800 border-purple-300';
    case 'Out for Delivery':
      return 'bg-cyan-100 text-cyan-800 border-cyan-300';
    case 'Delivered':
      return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    case 'Cancelled':
      return 'bg-rose-100 text-rose-800 border-rose-300';
    default:
      return 'bg-stone-100 text-stone-800 border-stone-300';
  }
};

// Payment status styling dictionary
export const getPaymentBadgeClass = (status) => {
  switch (status) {
    case 'Paid':
      return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    case 'Pending':
      return 'bg-amber-100 text-amber-800 border-amber-300';
    case 'Failed':
      return 'bg-rose-100 text-rose-800 border-rose-300';
    case 'Refunded':
      return 'bg-purple-100 text-purple-800 border-purple-300';
    default:
      return 'bg-stone-100 text-stone-800 border-stone-300';
  }
};

