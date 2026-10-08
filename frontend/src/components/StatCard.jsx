import React from 'react';

const StatCard = ({ title, value, icon: Icon, trend, color = 'blue' }) => {
  const colorMap = {
    blue: 'text-cyan-400 bg-cyan-950/40 border-cyan-800/40',
    red: 'text-rose-400 bg-rose-950/40 border-rose-800/40',
    green: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40',
    yellow: 'text-amber-400 bg-amber-950/40 border-amber-800/40',
  };

  return (
    <div className="card flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
        <h3 className="text-3xl font-extrabold text-slate-100 font-mono mt-1">{value}</h3>
        {trend && (
          <p className="text-xs text-slate-400 mt-1 font-medium">{trend}</p>
        )}
      </div>
      <div className={`p-3 rounded-xl border ${colorMap[color] || colorMap.blue}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
};

export default StatCard;
