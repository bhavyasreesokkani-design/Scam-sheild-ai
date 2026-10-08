import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, XOctagon } from 'lucide-react';

const AlertBadge = ({ level, score }) => {
  const normalizedLevel = (level || 'LOW').toUpperCase();

  let className = 'badge-low';
  let Icon = ShieldCheck;
  let label = 'LOW RISK';

  if (normalizedLevel === 'CRITICAL' || score >= 80) {
    className = 'badge-critical';
    Icon = XOctagon;
    label = 'CRITICAL RISK';
  } else if (normalizedLevel === 'HIGH' || score >= 60) {
    className = 'badge-high';
    Icon = ShieldAlert;
    label = 'HIGH RISK';
  } else if (normalizedLevel === 'MEDIUM' || score >= 30) {
    className = 'badge-medium';
    Icon = AlertTriangle;
    label = 'MEDIUM RISK';
  }

  return (
    <span className={`badge ${className}`}>
      <Icon className="w-3.5 h-3.5" />
      {label}
    </span>
  );
};

export default AlertBadge;
