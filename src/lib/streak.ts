import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'devlearn-streak';
const GOAL_MINUTES = 15;

export interface StreakState {
  lastDay: string;
  streak: number;
  todayMinutes: number;
}

function getToday(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function load(): StreakState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { lastDay: '', streak: 0, todayMinutes: 0 };
    const parsed = JSON.parse(raw) as StreakState;
    const today = getToday();
    
    // Если это новый день, но не сегодня, сбрасываем todayMinutes.
    // Сам стрик проверим при первом действии.
    if (parsed.lastDay !== today) {
      return { lastDay: parsed.lastDay, streak: parsed.streak, todayMinutes: 0 };
    }
    return parsed;
  } catch {
    return { lastDay: '', streak: 0, todayMinutes: 0 };
  }
}

export function useStreak() {
  const [state, setState] = useState<StreakState>(load);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const recordActivity = useCallback((minutes: number = 1) => {
    setState((prev) => {
      const today = getToday();
      let newStreak = prev.streak;
      let newToday = prev.todayMinutes;

      if (prev.lastDay !== today) {
        // Первое действие за сегодня. Проверяем, был ли вчера.
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
        
        if (prev.lastDay === yStr) {
          newStreak += 1; // Продолжаем стрик
        } else {
          newStreak = 1; // Начинаем заново
        }
        newToday = 0;
      }

      newToday += minutes;
      return { lastDay: today, streak: newStreak, todayMinutes: newToday };
    });
  }, []);

  return { ...state, recordActivity, goalMinutes: GOAL_MINUTES };
}