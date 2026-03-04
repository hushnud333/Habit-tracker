import { Check, Flame, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Habit } from '../types';

interface HabitItemProps {
  habit: Habit;
  isCompletedToday: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  key?: string | number;
}

export default function HabitItem({ habit, isCompletedToday, onToggle, onDelete }: HabitItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`gaming-card p-4 rounded-xl flex items-center justify-between group transition-all duration-300 ${
        isCompletedToday ? 'border-gaming-xp/30 bg-gaming-xp/5' : 'hover:border-gaming-accent/30'
      }`}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={() => onToggle(habit.id)}
          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
            isCompletedToday
              ? 'bg-gaming-xp text-white xp-glow'
              : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-gaming-accent'
          }`}
        >
          {isCompletedToday ? <Check size={20} /> : <div className="w-2 h-2 rounded-full bg-slate-600" />}
        </button>
        
        <div>
          <h3 className={`font-bold transition-all duration-300 ${isCompletedToday ? 'text-slate-300 line-through opacity-50' : 'text-white'}`}>
            {habit.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            {habit.streak >= 3 && (
              <div className="flex items-center gap-1 text-gaming-streak text-xs font-bold">
                <Flame size={14} fill="currentColor" />
                <span>{habit.streak} KUNLIK SERIYA</span>
              </div>
            )}
            {habit.streak < 3 && habit.streak > 0 && (
              <span className="text-slate-500 text-[10px] font-mono uppercase tracking-tighter">
                {habit.streak} kunlik seriya
              </span>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={() => onDelete(habit.id)}
        className="opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-gaming-hp transition-all"
      >
        <Trash2 size={18} />
      </button>
    </motion.div>
  );
}
