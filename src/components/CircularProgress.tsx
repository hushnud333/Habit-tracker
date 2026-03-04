import { motion } from 'motion/react';

interface CircularProgressProps {
  percentage: number;
  label: string;
  isToday?: boolean;
  key?: string | number;
}

export default function CircularProgress({ percentage, label, isToday }: CircularProgressProps) {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-20 h-20">
        <svg className="w-full h-full transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            className="text-slate-800"
          />
          {/* Progress circle */}
          <motion.circle
            cx="40"
            cy="40"
            r={radius}
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`${isToday ? 'text-gaming-accent' : 'text-slate-600'}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold font-mono">{Math.round(percentage)}%</span>
        </div>
      </div>
      <span className={`text-[10px] uppercase tracking-widest font-bold ${isToday ? 'text-gaming-accent' : 'text-slate-500'}`}>
        {label}
      </span>
    </div>
  );
}
