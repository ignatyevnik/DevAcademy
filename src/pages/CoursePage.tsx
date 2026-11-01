import { Link, useParams, Navigate } from 'react-router';
import { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Clock,
  PlayCircle,
  RotateCcw,
  Target,
  ListChecks, Bookmark, 
} from 'lucide-react';
import { toast } from 'sonner';
import { getCourse, courseStats, allLessons, findLesson } from '@/data';
import { useProgress } from '@/lib/progress';
import { Header } from '@/components/Header';
import { CourseIcon } from '@/components/CourseIcon';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { lessonsWord, stepsWord } from '@/lib/pluralize';

export default function CoursePage() {
  const { slug } = useParams();
  const course = getCourse(slug ?? '');
  const { courseProgress, lessonProgress, state, resetCourse, isBookmarked } = useProgress();
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({});
  const [confirmReset, setConfirmReset] = useState(false);

  if (!course) return <Navigate to="/" replace />;

  const { lessons, steps } = courseStats(course);
  const { pct, done } = courseProgress(course.slug);
  const minutes = allLessons(course).reduce((a, l) => a + l.minutes, 0);

  // Валидируем lastVisited: урок мог быть удалён/переименован
  const last = state.lastVisited[course.slug];
  const lastValid = last && findLesson(course, last.lessonId) ? last : undefined;

  const firstLesson = course.modules[0]?.lessons[0];
  const continueTarget = lastValid
    ? `/course/${course.slug}/lesson/${lastValid.lessonId}?step=${lastValid.stepIndex}`
    : firstLesson
      ? `/course/${course.slug}/lesson/${firstLesson.id}`
      : `/course/${course.slug}`;

  const showReset = !!lastValid || done > 0;

  const onReset = () => {
    resetCourse(course.slug);
    setConfirmReset(false);
    toast.success('Прогресс курса сброшен');
  };

  return (
    <div className="min-h-dvh">
      <Header />
      <main className="mx-auto max-w-6xl px-4 pb-20">
        <Link
          to="/"
          className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-md text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Каталог
        </Link>

        {/* Шапка курса */}
        <section className="mt-2 flex flex-col gap-6 rounded-xl border border-border bg-card p-6 sm:flex-row sm:items-start sm:p-8">
          <CourseIcon icon={course.icon} accent={course.accent} className="h-20 w-20" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{course.level}</Badge>
              {course.tags.map((t) => (
                <Badge key={t} variant="outline" className="font-normal">
                  {t}
                </Badge>
              ))}
            </div>
            <h1 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
              {course.title}
            </h1>
            <p className="mt-2 max-w-2xl leading-relaxed text-muted-foreground">
              {course.subtitle}
            </p>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
              <span>
                {lessons} {lessonsWord(lessons)}
              </span>
              <span>
                {steps} {stepsWord(steps)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" aria-hidden="true" />≈{Math.round(minutes / 60)} ч
              </span>
            </div>
          </div>
          <div className="w-full shrink-0 sm:w-60">
            <div className="flex items-baseline justify-between text-sm">
              <span className="font-semibold">Прогресс</span>
              <span className="font-extrabold text-primary">{pct}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-300"
                style={{ width: `${pct}%` }}
                role="progressbar"
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Прогресс курса"
              />
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">
              {done} из {steps} шагов
            </p>
            <Button asChild className="mt-4 min-h-[44px] w-full">
              <Link to={continueTarget}>
                <PlayCircle className="h-4 w-4" aria-hidden="true" />
                {done > 0 ? 'Продолжить' : 'Начать обучение'}
              </Link>
            </Button>
            {showReset && (
              <div className="mt-2">
                {!confirmReset ? (
                  <button
                    type="button"
                    onClick={() => setConfirmReset(true)}
                    className="inline-flex min-h-[36px] w-full items-center justify-center gap-1.5 rounded-md text-xs font-medium text-muted-foreground transition-colors hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                    Сбросить прогресс
                  </button>
                ) : (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-center">
                    <p className="text-xs font-medium">Сбросить весь прогресс курса?</p>
                    <div className="mt-2 flex justify-center gap-2">
                      <Button size="sm" variant="destructive" onClick={onReset}>
                        Да, сбросить
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setConfirmReset(false)}>
                        Отмена
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Программа */}
          <section>
            <h2 className="text-xl font-bold tracking-tight">Программа курса</h2>
            <div className="mt-4 space-y-3">
              {course.modules.map((m, mi) => {
                const isOpen = openModules[m.id] ?? true;
                return (
                  <div
                    key={m.id}
                    className="overflow-hidden rounded-xl border border-border bg-card"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenModules((s) => ({ ...s, [m.id]: !isOpen }))}
                      aria-expanded={isOpen}
                      className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                    >
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent text-sm font-bold text-primary">
                        {mi + 1}
                      </span>
                      <span className="flex-1 font-bold tracking-tight">{m.title}</span>
                      <span className="hidden text-xs text-muted-foreground sm:block">
                        {m.lessons.length} {lessonsWord(m.lessons.length)}
                      </span>
                      <ChevronDown
                        className={cn(
                          'h-5 w-5 text-muted-foreground transition-transform duration-200',
                          !isOpen && '-rotate-90'
                        )}
                        aria-hidden="true"
                      />
                    </button>
                    {isOpen && (
                      <ul className="border-t border-border">
                        {m.lessons.map((l) => {
                          const lp = lessonProgress(
                            course.slug,
                            l.steps.map((s) => s.id)
                          );
                          const complete = lp === 1;
                          return (
                            <li key={l.id}>
                              <Link
                                to={`/course/${course.slug}/lesson/${l.id}`}
                                className="flex min-h-[56px] items-center gap-3 px-5 py-3 transition-colors hover:bg-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                              >
                                {complete ? (
                                  <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" aria-label="Урок пройден" />
                                ) : lp > 0 ? (
                                  <svg className="h-5 w-5 shrink-0 -rotate-90" viewBox="0 0 20 20" aria-hidden="true">
                                    <circle cx="10" cy="10" r="9" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground/30" />
                                    <circle
                                      cx="10"
                                      cy="10"
                                      r="9"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeDasharray={`${lp * 56.55} 56.55`}
                                      className="text-primary transition-all duration-300"
                                    />
                                  </svg>
                                ) : (
                                  <span className="h-5 w-5 shrink-0 rounded-full border-2 border-muted-foreground/30" aria-hidden="true" />
                                )}
                                <span className="flex-1 text-[15px] font-medium">{l.title}</span>
                                {isBookmarked(course.slug, l.id) && (
                                  <Bookmark className="h-4 w-4 text-primary shrink-0" aria-label="В закладках" />
                                )}
                                <span className="text-xs text-muted-foreground">
                                  {l.steps.length} {stepsWord(l.steps.length)} · {l.minutes} мин
                                </span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* О курсе */}
          <aside className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="flex items-center gap-2 font-bold tracking-tight">
                <Target className="h-4 w-4 text-primary" aria-hidden="true" />
                Чему вы научитесь
              </h2>
              <ul className="mt-3 space-y-2.5">
                {course.outcomes.map((o) => (
                  <li key={o} className="flex gap-2.5 text-sm leading-relaxed">
                    <CheckCircle2
                      className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    {o}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="flex items-center gap-2 font-bold tracking-tight">
                <ListChecks className="h-4 w-4 text-primary" aria-hidden="true" />
                Требования
              </h2>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
                {course.requirements.map((r) => (
                  <li key={r} className="flex gap-2.5">
                    <span
                      className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/50"
                      aria-hidden="true"
                    />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="font-bold tracking-tight">О курсе</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {course.description}
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}