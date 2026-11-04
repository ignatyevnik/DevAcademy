import { Flame, Clock } from 'lucide-react';
import { useStreak } from '@/lib/streak';

export function StreakWidget() {
  const { streak, todayMinutes, goalMinutes } = useStreak();
  const pct = Math.min(100, Math.round((todayMinutes / goalMinutes) * 100));

  const getDayWord = (n: number) => {
    if (n % 10 === 1 && n % 100 !== 11) return 'день';
    if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) return 'дня';
    return 'дней';
  };

  return (
    <div className="inline-flex flex-wrap items-center gap-3 rounded-full border border-border bg-card px-4 py-2 text-sm shadow-sm">
      <div className="flex items-center gap-2">
        <Flame className={streak > 0 ? "h-5 w-5 text-orange-500" : "h-5 w-5 text-muted-foreground/40"} />
        <span className="font-semibold">
          {streak} {getDayWord(streak)} подряд
        </span>
      </div>

      <div className="h-4 w-px bg-border hidden sm:block" aria-hidden="true" />

      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <span className="text-muted-foreground">
          {todayMinutes} / {goalMinutes} мин
        </span>
        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-secondary">
          <div 
            className="h-full bg-orange-500 transition-all duration-500" 
            style={{ width: `${pct}%` }} 
          />
        </div>
      </div>
    </div>
  );
}