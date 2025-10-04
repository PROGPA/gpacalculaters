import React from 'react';
import { motion } from 'motion/react';

interface CircularMeterProps {
  value: number;
  maxValue: number;
  size?: number;
  strokeWidth?: number;
  children?: React.ReactNode;
  className?: string;
}

export function CircularMeter({ 
  value, 
  maxValue, 
  size = 160, 
  strokeWidth = 12, 
  children, 
  className = "" 
}: CircularMeterProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = Math.min(Math.max(value / maxValue, 0), 1);
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage * circumference);

  // Color based on performance
  const getStrokeColor = () => {
    const normalizedValue = value / maxValue;
    if (normalizedValue >= 0.9) return '#10b981'; // green
    if (normalizedValue >= 0.75) return '#3b82f6'; // blue
    if (normalizedValue >= 0.6) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-200 dark:text-gray-700"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getStrokeColor()}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ 
            duration: 1.5, 
            ease: "easeOut",
            delay: 0.5 
          }}
          style={{
            filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
          }}
        />
        
        {/* Glow effect */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getStrokeColor()}
          strokeWidth={strokeWidth / 2}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          initial={{ strokeDashoffset: circumference, opacity: 0 }}
          animate={{ strokeDashoffset, opacity: 0.3 }}
          transition={{ 
            duration: 1.5, 
            ease: "easeOut",
            delay: 0.5 
          }}
          style={{
            filter: 'blur(2px)'
          }}
        />
      </svg>
      
      {/* Content in center */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children}
      </div>
      
      {/* Percentage indicator */}
      <motion.div 
        className="absolute -bottom-2 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.5 }}
      >
        <div className="bg-white dark:bg-gray-800 px-2 py-1 rounded-full shadow-md border">
          <span className="text-xs font-medium" style={{ color: getStrokeColor() }}>
            {(percentage * 100).toFixed(0)}%
          </span>
        </div>
      </motion.div>
    </div>
  );
}