import { useMemo, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router';
import { ArrowLeft, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { getCourse } from '@/data';
import type { Step } from '@/data';
import { QuizView } from '@/components/StepContent';
import { ExamModeProvider } from '@/lib/exam-mode';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Course } from '@/data';

type QuizStep = Extract<Step, { type: 'quiz' }>;

interface ExamQuestion {
  step: QuizStep;
  lessonTitle: string;
}

const MAX_QUESTIONS = 20;

export function pickQuestions(modules: Course['modules']): ExamQuestion[] {
  const all: ExamQuestion[] = [];
  for (const m of modules) {
    for (const l of m.lessons) {
      for (const s of l.steps) {
        if (s.type === 'quiz') all.push({ step: s, lessonTitle: l.title });
      }
    }
  }
  if (all.length <= MAX_QUESTIONS) return all;
  const shuffled = [...all];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, MAX_QUESTIONS);
}

export default function ExamPage() {
  const { slug } = useParams();
  const course = getCourse(slug ?? '');
  const navigate = useNavigate();

  const questions = useMemo<ExamQuestion[]>(
    () => (course ? pickQuestions(course.modules) : []),
    [course],
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<Record<string, 'ok' | 'partial' | 'fail'>>({});
  const [answeredCurrent, setAnsweredCurrent] = useState(false);
  const [finished, setFinished] = useState(false);

  if (!course) return <Navigate to="/" replace />;
  if (questions.length === 0) return <Navigate to={`/course/${course.slug}`} replace />;

  const total = questions.length;
  const current = questions[currentIndex];

  const onResult = (r: 'ok' | 'partial' | 'fail') => {
    setResults((prev) => ({ ...prev, [current.step.id]: r }));
    setAnsweredCurrent(true);
  };

  const next = () => {
    if (currentIndex < total - 1) {
      setCurrentIndex(currentIndex + 1);
      setAnsweredCurrent(false);
    } else {
      setFinished(true);
    }
  };

  const restart = () => {
    setCurrentIndex(0);
    setResults({});
    setAnsweredCurrent(false);
    setFinished(false);
  };

  if (finished) {
    const correct = Object.values(results).filter((r) => r === 'ok').length;
    const partial = Object.values(results).filter((r) => r === 'partial').length;
    const failed = Object.values(results).filter((r) => r === 'fail').length;
    const pct = total ? Math.round((correct / total) * 100) : 0;
    const grade =
      pct >= 90 ? 'Отлично' : pct >= 70 ? 'Хорошо' : pct >= 50 ? 'Удовлетворительно' : 'Нужно повторить';

    return (
      <div className="min-h-dvh bg-background">
        <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
          <div className="mx-auto flex h-14 max-w-3xl items-center gap-2 px-4">
            <button
              type="button"
              onClick={() => navigate(`/course/${course.slug}`)}
              className="grid h-10 w-10 place-items-center rounded-md hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="К курсу"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Экзамен · результаты</p>
              <p className="truncate text-sm font-bold">{course.title}</p>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-3xl px-4 py-8 pb-24">
          <div className="rounded-2xl border border-border bg-card p-6 text-center sm:p-8">
            <p className="text-6xl font-extrabold tracking-tight text-primary">{pct}%</p>
            <p className="mt-2 text-xl font-bold">{grade}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Правильно {correct} из {total}
              {partial > 0 && `, частично ${partial}`}
              {failed > 0 && `, неправильно ${failed}`}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <Button onClick={restart} variant="outline">
                <RotateCcw className="h-4 w-4" /> Пройти заново
              </Button>
              <Button asChild>
                <Link to={`/course/${course.slug}`}>К курсу</Link>
              </Button>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            {questions.map((q, i) => {
              const r = results[q.step.id];
              return (
                <div
                  key={q.step.id}
                  className={cn(
                    'flex items-start gap-3 rounded-lg border p-3 text-sm',
                    r === 'ok' && 'border-primary/30 bg-primary/5',
                    r === 'partial' && 'border-amber-500/30 bg-amber-500/5',
                    r === 'fail' && 'border-destructive/30 bg-destructive/5',
                    !r && 'border-border',
                  )}
                >
                  <span className="shrink-0 pt-0.5 font-mono text-xs text-muted-foreground">
                    {i + 1}.
                  </span>
                  <span className="flex-1">{q.step.title}</span>
                  {r === 'ok' && <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />}
                  {r === 'partial' && (
                    <span className="shrink-0 text-xs text-amber-600 dark:text-amber-400">част.</span>
                  )}
                  {r === 'fail' && <XCircle className="h-4 w-4 shrink-0 text-destructive" />}
                </div>
              );
            })}
          </div>
        </main>
      </div>
    );
  }

  const progressPct = Math.round(((currentIndex + (answeredCurrent ? 1 : 0)) / total) * 100);

  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-3xl items-center gap-2 px-4">
          <button
            type="button"
            onClick={() => {
              if (confirm('Прервать экзамен? Результаты будут потеряны.')) {
                navigate(`/course/${course.slug}`);
              }
            }}
            className="grid h-10 w-10 place-items-center rounded-md hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Прервать экзамен"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground">
              Экзамен · вопрос {currentIndex + 1} из {total}
            </p>
            <p className="truncate text-sm font-bold">{course.title}</p>
          </div>
        </div>
        <div className="h-1 bg-secondary">
          <div
            className="h-full bg-primary transition-[width] duration-300"
            style={{ width: `${progressPct}%` }}
            role="progressbar"
            aria-valuenow={progressPct}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 pb-24">
        <p className="mb-3 text-xs text-muted-foreground">Урок: {current.lessonTitle}</p>

        <ExamModeProvider>
          <QuizView slug={course.slug} step={current.step} onResult={onResult} />
        </ExamModeProvider>

        {answeredCurrent && (
          <div className="mt-6 flex justify-end">
            <Button onClick={next} className="min-h-[44px] px-6">
              {currentIndex < total - 1 ? 'Следующий вопрос' : 'Завершить экзамен'}
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}