import React, { useState, useEffect, useMemo } from 'react';
import { Plus, LayoutDashboard, Target, Gift, Settings, Trophy, Zap, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Habit, Reward, UserStats, DayOfWeek } from './types';
import CircularProgress from './components/CircularProgress';
import HabitItem from './components/HabitItem';
import RewardItem from './components/RewardItem';
import StatsHeader from './components/StatsHeader';

const DAYS: DayOfWeek[] = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'];

const INITIAL_HABITS: Habit[] = [
  { id: '1', name: 'Zal mashg\'uloti', completedDays: [], streak: 0, icon: 'Dumbbell' },
  { id: '2', name: '30 daqiqa mutolaa', completedDays: [], streak: 0, icon: 'Book' },
  { id: '3', name: 'Meditatsiya', completedDays: [], streak: 0, icon: 'Wind' },
];

const INITIAL_REWARDS: Reward[] = [
  { id: 'r1', name: '1 soat video o\'yinlar', cost: 100, icon: 'Gamepad' },
  { id: 'r2', name: 'Pitsa buyurtma qilish', cost: 300, icon: 'Pizza' },
  { id: 'r3', name: 'Yangi gadjet', cost: 1000, icon: 'Cpu' },
];

export default function App() {
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('habits');
    return saved ? JSON.parse(saved) : INITIAL_HABITS;
  });

  const [rewards] = useState<Reward[]>(INITIAL_REWARDS);
  
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('userStats');
    return saved ? JSON.parse(saved) : { xp: 0, hp: 100, level: 1, totalPoints: 0 };
  });

  const [newHabitName, setNewHabitName] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'rewards'>('dashboard');

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
    localStorage.setItem('userStats', JSON.stringify(stats));
  }, [habits, stats]);

  // Check for missed habits and deduct HP
  useEffect(() => {
    const lastCheck = localStorage.getItem('lastCheckDate');
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (lastCheck !== today) {
      let hpLoss = 0;
      habits.forEach(habit => {
        if (!habit.completedDays.includes(yesterdayStr)) {
          hpLoss += 5;
        }
      });

      if (hpLoss > 0) {
        setStats(prev => ({
          ...prev,
          hp: Math.max(0, prev.hp - hpLoss)
        }));
      }
      localStorage.setItem('lastCheckDate', today);
    }
  }, [habits, today]);

  const toggleHabit = (id: string) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id === id) {
        const isCompleted = habit.completedDays.includes(today);
        let newCompletedDays = [...habit.completedDays];
        let newStreak = habit.streak;

        if (isCompleted) {
          newCompletedDays = newCompletedDays.filter(d => d !== today);
          newStreak = Math.max(0, newStreak - 1);
          setStats(s => ({ 
            ...s, 
            xp: Math.max(0, s.xp - 10),
            totalPoints: Math.max(0, s.totalPoints - 10)
          }));
        } else {
          newCompletedDays.push(today);
          newStreak += 1;
          setStats(s => {
            const newXp = s.xp + 10;
            const newLevel = Math.floor(newXp / 100) + 1;
            return {
              ...s,
              xp: newXp,
              level: newLevel,
              totalPoints: s.totalPoints + 10
            };
          });
        }

        return { ...habit, completedDays: newCompletedDays, streak: newStreak };
      }
      return habit;
    }));
  };

  const addHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    
    const newHabit: Habit = {
      id: Date.now().toString(),
      name: newHabitName,
      completedDays: [],
      streak: 0,
      icon: 'Target',
    };
    
    setHabits([...habits, newHabit]);
    setNewHabitName('');
  };

  const deleteHabit = (id: string) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  const redeemReward = (reward: Reward) => {
    if (stats.totalPoints >= reward.cost) {
      setStats(prev => ({
        ...prev,
        totalPoints: prev.totalPoints - reward.cost
      }));
      alert(`${reward.name} olindi! Mukofotdan bahramand bo'ling.`);
    }
  };

  const dailyProgress = useMemo(() => {
    const progress: Record<string, number> = {};
    const now = new Date();
    
    DAYS.forEach((_, index) => {
      const d = new Date();
      // Adjust to get the dates of the current week
      const dayOffset = (now.getDay() === 0 ? 6 : now.getDay() - 1) - index;
      d.setDate(now.getDate() - dayOffset);
      const dateStr = d.toISOString().split('T')[0];
      
      const completedCount = habits.filter(h => h.completedDays.includes(dateStr)).length;
      progress[DAYS[index]] = habits.length > 0 ? (completedCount / habits.length) * 100 : 0;
    });
    
    return progress;
  }, [habits]);

  const currentDayName = DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      {/* Sidebar / Nav */}
      <nav className="fixed bottom-0 left-0 w-full md:w-20 md:h-screen bg-gaming-card border-t md:border-t-0 md:border-r border-slate-800 flex md:flex-col items-center justify-around md:justify-center gap-8 z-50 py-4 md:py-0">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`p-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-gaming-accent text-white gaming-glow' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <LayoutDashboard size={24} />
        </button>
        <button 
          onClick={() => setActiveTab('rewards')}
          className={`p-3 rounded-xl transition-all ${activeTab === 'rewards' ? 'bg-gaming-accent text-white gaming-glow' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Gift size={24} />
        </button>
        <button className="p-3 rounded-xl text-slate-500 hover:text-slate-300">
          <Settings size={24} />
        </button>
      </nav>

      {/* Main Content */}
      <main className="md:ml-20 p-4 md:p-8 max-w-6xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic">
              LevelUp <span className="text-gaming-accent">Odatlar</span>
            </h1>
            <p className="text-slate-500 text-xs font-mono uppercase tracking-widest mt-1">
              O'yinchi: {localStorage.getItem('userName') || 'Pro_Gamer_2024'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              1-fasl: Ibtido
            </div>
          </div>
        </header>

        <StatsHeader stats={stats} />

        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {/* Weekly Progress */}
              <section className="gaming-card p-6 rounded-3xl mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Target size={16} className="text-gaming-accent" />
                    Haftalik natijalar
                  </h2>
                </div>
                <div className="flex justify-between items-center overflow-x-auto pb-4 gap-4 no-scrollbar">
                  {DAYS.map((day) => (
                    <CircularProgress 
                      key={day} 
                      label={day} 
                      percentage={dailyProgress[day]} 
                      isToday={day === currentDayName}
                    />
                  ))}
                </div>
              </section>

              {/* Habits List */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Faol topshiriqlar</h2>
                    <span className="text-[10px] font-mono text-slate-600">{habits.length} ODATLAR KUZATILMOQDA</span>
                  </div>
                  
                  <div className="space-y-3">
                    {habits.map(habit => (
                      <HabitItem 
                        key={habit.id}
                        habit={habit}
                        isCompletedToday={habit.completedDays.includes(today)}
                        onToggle={toggleHabit}
                        onDelete={deleteHabit}
                      />
                    ))}
                    
                    <form onSubmit={addHabit} className="mt-6">
                      <div className="relative">
                        <input
                          type="text"
                          value={newHabitName}
                          onChange={(e) => setNewHabitName(e.target.value)}
                          placeholder="YANGI TOPSHIRIQ QO'SHISH..."
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl py-4 px-6 text-sm font-bold focus:outline-none focus:border-gaming-accent transition-all placeholder:text-slate-700"
                        />
                        <button 
                          type="submit"
                          className="absolute right-2 top-2 bottom-2 bg-gaming-accent text-white px-4 rounded-lg hover:gaming-glow transition-all"
                        >
                          <Plus size={20} />
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Quick Stats / Info */}
                <div className="space-y-6">
                  <div className="gaming-card p-6 rounded-2xl">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Kunlik maslahat</h3>
                    <p className="text-sm text-slate-300 leading-relaxed italic">
                      "Muntazamlik - bu eng yaxshi usul. XP yig'ish uchun odatlaringizni kanda qilmang!"
                    </p>
                  </div>
                  
                  <div className="gaming-card p-6 rounded-2xl border-dashed border-slate-800 bg-transparent">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Yutuqlar</h3>
                    <div className="flex flex-wrap gap-2">
                      <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-600 border border-slate-700">
                        <Trophy size={18} />
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-600 border border-slate-700">
                        <Zap size={18} />
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-600 border border-slate-700">
                        <Shield size={18} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="rewards"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-black text-white uppercase italic">Mukofotlar do'koni</h2>
                <p className="text-slate-500 text-xs font-mono uppercase tracking-widest">To'plagan ochkolaringizni sarflang</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rewards.map(reward => (
                  <RewardItem 
                    key={reward.id}
                    reward={reward}
                    canAfford={stats.totalPoints >= reward.cost}
                    onRedeem={redeemReward}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
