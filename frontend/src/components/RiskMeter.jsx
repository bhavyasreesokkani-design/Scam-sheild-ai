import React from 'react';
import AlertBadge from './AlertBadge';

const RiskMeter = ({ score = 0, level = 'LOW', confidence = 90 }) => {
  const clampedScore = Math.min(Math.max(score, 0), 100);
  
  let colorClass = 'from-emerald-500 to-green-400 text-emerald-400';
  let strokeColor = '#10b981';

  if (clampedScore >= 80) {
    colorClass = 'from-red-600 to-rose-500 text-rose-500';
    strokeColor = '#ef4444';
  } else if (clampedScore >= 60) {
    colorClass = 'from-orange-500 to-amber-500 text-orange-400';
    strokeColor = '#f97316';
  } else if (clampedScore >= 30) {
    colorClass = 'from-amber-500 to-yellow-400 text-amber-400';
    strokeColor = '#f59e0b';
  }

  const strokeDashoffset = 283 - (283 * clampedScore) / 100;

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-slate-900/60 rounded-xl border border-slate-800">
      <div className="relative w-36 h-36 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            className="text-slate-800"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke={strokeColor}
            strokeWidth="8"
            strokeDasharray="283"
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-extrabold tracking-tight font-mono">
            {Math.round(clampedScore)}
          </span>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            / 100 RISK
          </span>
        </div>
      </div>

      <div className="mt-3 flex flex-col items-center gap-1">
        <AlertBadge level={level} score={score} />
        <span className="text-xs text-slate-400 mt-1 font-mono">
          Confidence: <strong className="text-slate-200">{confidence}%</strong>
        </span>
      </div>
    </div>
  );
};

export default RiskMeter;
