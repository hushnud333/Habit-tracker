import { ShoppingBag } from 'lucide-react';
import { Reward } from '../types';

interface RewardItemProps {
  reward: Reward;
  canAfford: boolean;
  onRedeem: (reward: Reward) => void;
  key?: string | number;
}

export default function RewardItem({ reward, canAfford, onRedeem }: RewardItemProps) {
  return (
    <div className="gaming-card p-4 rounded-xl flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-gaming-accent">
          <ShoppingBag size={20} />
        </div>
        <div>
          <h4 className="font-bold text-sm">{reward.name}</h4>
          <span className="text-gaming-streak text-xs font-mono">{reward.cost} OCHKO</span>
        </div>
      </div>
      
      <button
        onClick={() => onRedeem(reward)}
        disabled={!canAfford}
        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
          canAfford
            ? 'bg-gaming-accent text-white hover:gaming-glow'
            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
        }`}
      >
        ALMASHISH
      </button>
    </div>
  );
}
