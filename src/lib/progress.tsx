import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { courses } from '@/data';

const STORAGE_KEY = 'devlearn-progress-v1';

export type QuizResult = 'ok' | 'partial' | 'fail';

export interface ProgressState {
  done: Record<string, true>;
  lastVisited: Record<string, { lessonId: string; stepIndex: number; ts: number }>;
  quizResults: Record<string, QuizResult>;
}

const empty: ProgressState = { done: {}, lastVisited: {}, quizResults: {} };

export function stepKey(slug: string, stepId: string) {
  return `${slug}:${stepId}`;
}

function load(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw);
    return { ...empty, ...parsed };
  } catch {
    return empty;
  }
}

const RANK: Record<QuizResult, number> = { fail: 0, partial: 1, ok: 2 };

interface ProgressApi {
  state: ProgressState;
  isStepDone: (slug: string, stepId: string) => boolean;
  completeStep: (slug: string, stepId: string) => void;
  setQuizResult: (slug: string, stepId: string, result: QuizResult) => void;
  quizResult: (slug: string, stepId: string) => QuizResult | undefined;
  visit: (slug: string, lessonId: string, stepIndex: number) => void;
  courseProgress: (slug: string) => { done: number; total: number; pct: number };
  lessonProgress: (slug: string, stepIds: string[]) => number;
  resetCourse: (slug: string) => void;
  replaceState: (newState: ProgressState) => void;
  totalStats: () => { started: number; donePct: number };
}

const Ctx = createContext<ProgressApi | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(load);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const completeStep = useCallback((slug: string, stepId: string) => {
    setState((s) => {
      const k = stepKey(slug, stepId);
      if (s.done[k]) return s;
      return { ...s, done: { ...s.done, [k]: true } };
    });
  }, []);

  const setQuizResult = useCallback((slug: string, stepId: string, result: QuizResult) => {
    setState((s) => {
      const k = stepKey(slug, stepId);
      const prev = s.quizResults[k];
      if (prev && RANK[prev] >= RANK[result]) return s;
      return { ...s, quizResults: { ...s.quizResults, [k]: result } };
    });
  }, []);

  const visit = useCallback((slug: string, lessonId: string, stepIndex: number) => {
    setState((s) => ({
      ...s,
      lastVisited: { ...s.lastVisited, [slug]: { lessonId, stepIndex, ts: Date.now() } },
    }));
  }, []);

  const api = useMemo<ProgressApi>(() => {
    const countDoneInCourse = (slug: string) => {
      const course = courses.find((c) => c.slug === slug);
      if (!course) return { done: 0, total: 0 };
      let done = 0;
      let total = 0;
      for (const m of course.modules)
        for (const l of m.lessons)
          for (const st of l.steps) {
            total++;
            if (state.done[stepKey(slug, st.id)]) done++;
          }
      return { done, total };
    };

    return {
      state,
      isStepDone: (slug, stepId) => !!state.done[stepKey(slug, stepId)],
      completeStep,
      setQuizResult,
      quizResult: (slug, stepId) => state.quizResults[stepKey(slug, stepId)],
      visit,
      courseProgress: (slug) => {
        const { done, total } = countDoneInCourse(slug);
        return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
      },
      lessonProgress: (slug, stepIds) => {
        if (!stepIds.length) return 0;
        const done = stepIds.filter((id) => state.done[stepKey(slug, id)]).length;
        return done / stepIds.length;
      },
      replaceState: (newState) => {
        setState({
          done: newState.done ?? {},
          lastVisited: newState.lastVisited ?? {},
          quizResults: newState.quizResults ?? {},
        });
      },
      resetCourse: (slug) => {
        setState((s) => {
          const done: Record<string, true> = {};
          const quizResults: Record<string, QuizResult> = {};
          for (const k of Object.keys(s.done)) if (!k.startsWith(slug + ':')) done[k] = true;
          for (const [k, v] of Object.entries(s.quizResults)) if (!k.startsWith(slug + ':')) quizResults[k] = v;
          const lastVisited = { ...s.lastVisited };
          delete lastVisited[slug];
          return { done, quizResults, lastVisited };
        });
      },
      totalStats: () => {
        const started = Object.keys(state.lastVisited).length;
        let done = 0;
        let total = 0;
        for (const c of courses) {
          const s = countDoneInCourse(c.slug);
          done += s.done;
          total += s.total;
        }
        return { started, donePct: total ? Math.round((done / total) * 100) : 0 };
      },
    };
  }, [state, completeStep, setQuizResult, visit]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useProgress() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useProgress must be used inside ProgressProvider');
  return ctx;
}