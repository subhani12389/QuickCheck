import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

export const StatusBadge = ({ verdict, score, showIcon = true, size = 'normal' }) => {
  const getBadgeStyle = () => {
    switch (verdict?.toLowerCase()) {
      case 'original':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 dark:text-emerald-400',
          icon: <CheckCircle2 className={size === 'large' ? 'w-6 h-6' : 'w-4 h-4'} />,
          label: 'ORIGINAL & AUTHENTIC'
        };
      case 'suspicious':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400 dark:text-amber-400',
          icon: <AlertTriangle className={size === 'large' ? 'w-6 h-6' : 'w-4 h-4'} />,
          label: 'SUSPICIOUS — REQUIRES REVIEW'
        };
      case 'fake':
        return {
          bg: 'bg-rose-500/10 border-rose-500/30 text-rose-400 dark:text-rose-400',
          icon: <XCircle className={size === 'large' ? 'w-6 h-6' : 'w-4 h-4'} />,
          label: 'FRAUDULENT / FAKE'
        };
      default:
        return {
          bg: 'bg-slate-500/10 border-slate-500/30 text-slate-400',
          icon: <AlertTriangle className="w-4 h-4" />,
          label: verdict || 'UNKNOWN'
        };
    }
  };

  const style = getBadgeStyle();
  const sizeClasses = size === 'large' 
    ? 'px-4 py-2 text-base font-bold tracking-wide rounded-full border shadow-lg'
    : 'px-3 py-1 text-xs font-semibold tracking-wider rounded-md border';

  return (
    <div className={`inline-flex items-center gap-2 ${sizeClasses} ${style.bg}`}>
      {showIcon && style.icon}
      <span>{style.label}</span>
      {score !== undefined && (
        <span className="ml-1 opacity-80 border-l border-current pl-2">
          {score}% Score
        </span>
      )}
    </div>
  );
};
