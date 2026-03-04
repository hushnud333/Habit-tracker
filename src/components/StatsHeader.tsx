import { Shield, Zap, Trophy } from 'lucide-react';
import { motion } from 'motion/react';
import { UserStats } from '../types';

interface StatsHeaderProps {
  stats: UserStats;
}

export default function StatsHeader({ stats }: StatsHeaderProps) {
  const xpPercentage = (stats.xp % 100);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* HP Card */}
      <div className="gaming-card p-4 rounded-2xl flex items-center gap-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-gaming-hp" />
        <div className="w-12 h-12 rounded-xl bg-gaming-hp/10 flex items-center justify-center text-gaming-hp">
          <Shield size={24} />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-end mb-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Salomatlik (HP)</span>
            <span className="text-sm font-mono font-bold text-gaming-hp">{stats.hp}/100</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stats.hp}%` }}
              className="h-full bg-gaming-hp hp-glow"
            />
          </div>
        </div>
      </div>

      {/* XP Card */}
      <div className="gaming-card p-4 rounded-2xl flex items-center gap-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-gaming-xp" />
        <div className="w-12 h-12 rounded-xl bg-gaming-xp/10 flex items-center justify-center text-gaming-xp">
          <Zap size={24} />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-end mb-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stats.level}-Daraja</span>
            <span className="text-sm font-mono font-bold text-gaming-xp">{stats.xp} XP</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xpPercentage}%` }}
              className="h-full bg-gaming-xp xp-glow"
            />
          </div>
        </div>
      </div>

      {/* Points Card */}
      <div className="gaming-card p-4 rounded-2xl flex items-center gap-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-gaming-streak" />
        <div className="w-12 h-12 rounded-xl bg-gaming-streak/10 flex items-center justify-center text-gaming-streak">
          <Trophy size={24} />
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Mavjud ochkolar</span>
          <span className="text-2xl font-mono font-bold text-gaming-streak">{stats.totalPoints}</span>
        </div>
      </div>
    </div>
  );
}
