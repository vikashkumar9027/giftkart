import React from 'react';

export const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100 animate-pulse">
      <div className="w-full h-64 bg-stone-200" />
      <div className="p-5 space-y-3">
        <div className="h-3 bg-stone-200 rounded w-1/3" />
        <div className="h-5 bg-stone-200 rounded w-3/4" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 bg-stone-200 rounded w-1/4" />
          <div className="h-9 bg-stone-200 rounded-full w-24" />
        </div>
      </div>
    </div>
  );
};

export const TableRowSkeleton = ({ cols = 5 }) => {
  return (
    <tr className="animate-pulse border-b border-stone-100">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="p-4">
          <div className="h-4 bg-stone-200 rounded w-4/5" />
        </td>
      ))}
    </tr>
  );
};

export default { ProductCardSkeleton, TableRowSkeleton };
