import React from 'react';
import { motion } from 'framer-motion';

export const ScoreGauge = ({ score = 0, size = 180 }) => {
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let gradientId = "score-green";
  let strokeColor = "#10b981";
  let glowColor = "rgba(16, 185, 129, 0.4)";
  let label = "High Confidence";

  if (score < 60) {
    gradientId = "score-red";
    strokeColor = "#ef4444";
    glowColor = "rgba(239, 68, 68, 0.4)";
    label = "High Risk Fraud";
  } else if (score < 90) {
    gradientId = "score-amber";
    strokeColor = "#f59e0b";
    glowColor = "rgba(245, 158, 11, 0.4)";
    label = "Moderate Risk";
  }

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <linearGradient id="score-green" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="score-amber" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <linearGradient id="score-red" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f87171" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
        </defs>
        
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Animated Score Progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
          fill="none"
          style={{ filter: `drop-shadow(0 0 8px ${glowColor})` }}
        />
      </svg>

      {/* Center Score Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <motion.span 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-4xl font-extrabold tracking-tight"
          style={{ color: strokeColor }}
        >
          {score}%
        </motion.span>
        <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400 mt-0.5">
          {label}
        </span>
      </div>
    </div>
  );
};
