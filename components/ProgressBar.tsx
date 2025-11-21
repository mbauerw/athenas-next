import React from 'react';

interface ProgressBarProps {
  current: number;
  max: number;
  label: string;
  colorClass?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, max, label, colorClass = "bg-library-green" }) => {
  const percentage = Math.min(100, Math.max(0, (current / max) * 100));

  return (
    <div className="mb-4">
      <div className="flex justify-between items-end mb-1">
        <span className="text-sm font-bold text-library-wood font-serif">{label}</span>
        <span className="text-xs text-library-woodLight">{current} / {max}</span>
      </div>
      <div className="w-full bg-library-paperDark rounded-full h-3 border border-library-wood/20">
        <div 
          className={`h-full rounded-full ${colorClass} transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};