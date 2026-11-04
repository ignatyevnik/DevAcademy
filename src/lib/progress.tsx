import { createContext, useCallback, useContext, useEffect, useMemo, useState, useRef } from 'react';
import type { ReactNode } from 'react';
import { courses, type Step } from '@/data';
import type { SrsCard } from './srs';
import { calculateSrs } from './srs';
import { useStreak } from './streak';

const STORAGE_KEY = 'devlearn-progress-v1';

export type QuizResult = 'ok' | 'partial' | 'fail';

export interface ProgressState {
  done: Record<string, true>;
  lastVisited: Record<string, { lessonId: string; stepIndex: number; ts: number }>;
  quizResults: Record<string, 'ok' | 'partial' | 'fail'>;
  bookmarks: Record<string, true>; // ключ: `${courseSlug}:${lessonId}`
  notes: Record<string, string>; // <-- ДОБАВИТЬ: ключ `${courseSlug}:${stepId}`
  srs: Record<string, SrsCard>;
}

const empty: ProgressState = { done: {}, lastVisited: {}, quizResults: {}, bookmarks: {}, notes: {}, srs: {} };

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
  isBookmarked: (slug: string, lessonId: string) => boolean;
  toggleBookmark: (slug: string, lessonId: string) => void;  
  getNote: (slug: string, stepId: string) => string;
  setNote: (slug: string, stepId: string, text: string) => void;
  recordSrsAnswer: (slug: string, stepId: string, isCorrect: boolean) => void;
  getDueReviews: () => { slug: string; lessonId: string; step: Step; courseTitle: string }[];
}

const Ctx = createContext<ProgressApi | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(load);
  const { recordActivity } = useStreak();
  const prevDoneRef = useRef(state.done);

  useEffect(() => {
  const prev = prevDoneRef.current;
  const curr = state.done;
  let added = 0;
  for (const k in curr) {
    if (!prev[k]) added++;
  }
  if (added > 0) {
    recordActivity(added * 2); // Считаем каждый шаг за 2 минуты
  }
  prevDoneRef.current = curr;
}, [state.done, recordActivity]);

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
      replaceState: (newState) => {
        setState({
          done: newState.done ?? {},
          lastVisited: newState.lastVisited ?? {},
          quizResults: newState.quizResults ?? {},
          bookmarks: newState.bookmarks ?? {},
          notes: newState.notes ?? {},
          srs: newState.srs ?? {}
        });
      },
      
      courseProgress: (slug) => {
        const { done, total } = countDoneInCourse(slug);
        return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
      },
      lessonProgress: (slug, stepIds) => {
        if (!stepIds.length) return 0;
        const done = stepIds.filter((id) => state.done[stepKey(slug, id)]).length;
        return done / stepIds.length;
      },
      resetCourse: (slug) => {
        setState((s) => {
          const done: Record<string, true> = {};
          const quizResults: Record<string, QuizResult> = {};
          for (const k of Object.keys(s.done)) if (!k.startsWith(slug + ':')) done[k] = true;
          for (const [k, v] of Object.entries(s.quizResults)) if (!k.startsWith(slug + ':')) quizResults[k] = v;
          
          const lastVisited = { ...s.lastVisited };
          delete lastVisited[slug];

          const bookmarks = { ...s.bookmarks };
          for (const k of Object.keys(bookmarks)) {
            if (k.startsWith(slug + ':')) delete bookmarks[k];
          }

          // Удаляем заметки этого курса
          const notes = { ...s.notes };
          for (const k of Object.keys(notes)) {
            if (k.startsWith(slug + ':')) delete notes[k];
          }

          // Удаляем заметки этого курса
          const srs = { ...s.srs };
          for (const k of Object.keys(srs)) {
            if (k.startsWith(slug + ':')) delete srs[k];
          }

          return { done, quizResults, lastVisited, bookmarks, notes, srs };
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

      recordSrsAnswer: (slug, stepId, isCorrect) => {
        const key = stepKey(slug, stepId);
        setState((s) => {
          const nextSrs = { ...s.srs };
          nextSrs[key] = calculateSrs(isCorrect, nextSrs[key]);
          return { ...s, srs: nextSrs };
        });
      },
      getDueReviews: () => {
        const now = Date.now();
        const due: { slug: string; lessonId: string; step: Step; courseTitle: string }[] = [];
        
        for (const course of courses) {
          for (const mod of course.modules) {
            for (const lesson of mod.lessons) {
              for (const step of lesson.steps) {
                if (step.type !== 'quiz') continue;
                const key = stepKey(course.slug, step.id);
                const card = state.srs[key];
                const result = state.quizResults[key];

                // Если карточка есть и пришло время, ИЛИ если нет карточки, но квиз уже был пройден верно
                if ((card && card.nextReview <= now) || (!card && result === 'ok')) {
                  due.push({ slug: course.slug, lessonId: lesson.id, step, courseTitle: course.title });
                }
              }
            }
          }
        }
        return due;
      },

      isBookmarked: (slug, lessonId) => !!state.bookmarks[`${slug}:${lessonId}`],
      toggleBookmark: (slug, lessonId) => {
        const key = `${slug}:${lessonId}`;
        setState((s) => {
          const next = { ...s.bookmarks };
          if (next[key]) {
            delete next[key];
          } else {
            next[key] = true;
          }
          return { ...s, bookmarks: next };
        });
      },
      getNote: (slug, stepId) => state.notes[`${slug}:${stepId}`] || '',
      setNote: (slug, stepId, text) => {
        const key = `${slug}:${stepId}`;
        setState((s) => {
          const nextNotes = { ...s.notes };
          if (!text.trim()) {
            delete nextNotes[key];
          } else {
            nextNotes[key] = text;
          }
          return { ...s, notes: nextNotes };
        });
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