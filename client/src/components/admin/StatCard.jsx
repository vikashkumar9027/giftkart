import React from 'react';

const StatCard = ({ title, value, icon: Icon, color = 'rose', subtitle }) => {
  const colorMap = {
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex items-center justify-between">
      <div className="space-y-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
          {title}
        </span>
        <h3 className="text-3xl font-extrabold text-stone-900">{value}</h3>
        {subtitle && <p className="text-xs text-stone-500 font-medium">{subtitle}</p>}
      </div>

      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${colorMap[color] || colorMap.rose}`}>
        <Icon className="w-7 h-7" />
      </div>
    </div>
  );
};

export default StatCard;
