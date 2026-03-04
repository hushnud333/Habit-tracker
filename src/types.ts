export interface Habit {
  id: string;
  name: string;
  completedDays: string[]; // ISO dates
  streak: number;
  icon: string;
}

export interface Reward {
  id: string;
  name: string;
  cost: number;
  icon: string;
}

export interface UserStats {
  xp: number;
  hp: number;
  level: number;
  totalPoints: number;
}

export type DayOfWeek = 'Du' | 'Se' | 'Ch' | 'Pa' | 'Ju' | 'Sh' | 'Ya';
