import { Link, useParams, useSearchParams, Navigate, useNavigate } from 'react-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft, ArrowRight, Check, CheckCircle2, CircleHelp, FileText, ListTree, X, Bookmark, BookmarkCheck, StickyNote, Library, ChevronRight 
} from 'lucide-react';
import { toast } from 'sonner';
import { getCourse, findLesson, allLessons } from '@/data';
import type { Step } from '@/data';
import { useProgress, stepKey } from '@/lib/progress';
import type { QuizResult } from '@/lib/progress';
import { TextBlocks, QuizView } from '@/components/StepContent';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ReportError } from '@/components/ReportError';
import { FontSizeToggle } from '@/components/FontSizeToggle';

function StepNotes({ slug, stepId }: { slug: string; stepId: string }) {
  const { getNote, setNote } = useProgress();
  const [text, setText] = useState(() => getNote(slug, stepId));
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setText(getNote(slug, stepId));
    setSaved(false);
  }, [slug, stepId, getNote]);

  const handleSave = () => {
    setNote(slug, stepId, text);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="mt-8 rounded-xl border border-border bg-card p-4 sm:p-5">
      <div className="flex items-center gap-2 text-sm font-semibold mb-3">
        <StickyNote className="h-4 w-4 text-primary" />
        Мои заметки
      </div>
      <textarea
        value={text}
        onChange={(e) => { setText(e.target.value); setSaved(false); }}
        onBlur={handleSave}
        placeholder="Запишите важное: команды, ссылки, свои мысли..."
        className="w-full min-h-[100px] resize-y rounded-lg border border-input bg-background p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      <div className="mt-2 flex justify-between items-center text-xs text-muted-foreground">
        <span>Сохраняется автоматически при клике вне поля</span>
        {saved && <span className="text-primary font-medium flex items-center gap-1"><Check className="h-3 w-3" /> Сохранено</span>}
      </div>
    </div>
  );
}

export default function LessonPage() {
  const { slug, lessonId } = useParams();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const course = getCourse(slug ?? '');
  const found = course && lessonId ? findLesson(course, lessonId) : null;
  const {
  isStepDone, completeStep, setQuizResult, visit,
  state, isBookmarked, toggleBookmark,
} = useProgress();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const h1Ref = useRef<HTMLHeadingElement>(null);

  const lesson = found?.lesson;
  const totalSteps = lesson?.steps.length ?? 1;
  const rawIndex = parseInt(params.get('step') ?? '0', 10);
  const safeIndex = Number.isFinite(rawIndex) ? rawIndex : 0;
  const stepIndex = Math.max(0, Math.min(safeIndex, totalSteps - 1));
  const step: Step | undefined = lesson?.steps[stepIndex];

  useEffect(() => {
    if (!lesson) return;
    if (safeIndex !== stepIndex) {
      const next = new URLSearchParams(params);
      next.set('step', String(stepIndex));
      setParams(next, { replace: true });
    }
  }, [safeIndex, stepIndex, lesson, params, setParams]);

  useEffect(() => {
    if (course && lesson) visit(course.slug, lesson.id, stepIndex);
  }, [course?.slug, lesson?.id, stepIndex, visit]);

const hasSandbox =
  step?.type === "theory" &&
  step.blocks.some((b) => b.type === "sandbox" || b.type === "python");

useEffect(() => {
  if (
    course &&
    step &&
    step.type === 'theory' &&
    !hasSandbox &&
    !isStepDone(course.slug, step.id)
  ) {
    completeStep(course.slug, step.id);
  }
}, [course?.slug, step?.id, step?.type, hasSandbox, isStepDone, completeStep, step]);

  useEffect(() => {
    if (step) h1Ref.current?.focus();
  }, [step?.id]);

  const nav = useMemo(() => {
    if (!course || !lesson) return null;
    const lessons = allLessons(course);
    const li = lessons.findIndex((l) => l.id === lesson.id);
    const goTo = (lessonIdx: number, stepIdx: number) =>
      `/course/${course.slug}/lesson/${lessons[lessonIdx].id}?step=${stepIdx}`;
    const prev =
      stepIndex > 0 ? goTo(li, stepIndex - 1) :
      li > 0 ? goTo(li - 1, lessons[li - 1].steps.length - 1) : null;
    const next =
      stepIndex < lesson.steps.length - 1 ? goTo(li, stepIndex + 1) :
      li < lessons.length - 1 ? goTo(li + 1, 0) : null;
    return { prev, next, isLast: !next, isLastInCourse: !next };
  }, [course, lesson, stepIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) return;

      if (e.key === 'ArrowLeft' && nav?.prev) {
        navigate(nav.prev);
      } else if (e.key === 'ArrowRight' && nav?.next) {
        navigate(nav.next);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nav, navigate]);

  if (!course || !found || !lesson || !step) return <Navigate to="/" replace />;

  const doneCount = lesson.steps.filter((s) => isStepDone(course.slug, s.id)).length;
  const lessonPct = Math.round((doneCount / lesson.steps.length) * 100);

  const goStep = (i: number) => {
    const next = new URLSearchParams(params);
    next.set('step', String(i));
    setParams(next, { replace: true });
    setSidebarOpen(false);
  };

  const onFinishLesson = () => {
    toast.success(`Урок «${lesson.title}» завершён`);
    navigate(`/course/${course.slug}`);
  };

  const sidebar = (
    <nav aria-label="Шаги урока" className="space-y-1">
      {lesson.steps.map((s, i) => {
        const done = isStepDone(course.slug, s.id);
        const active = i === stepIndex;
        const qr = state.quizResults[stepKey(course.slug, s.id)];
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => goStep(i)}
            aria-current={active ? 'step' : undefined}
            className={cn(
              'flex w-full min-h-[44px] items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              active ? 'bg-accent font-semibold text-foreground' : 'text-foreground/75 hover:bg-accent/40'
            )}
          >
            <span
              className={cn(
                'grid h-6 w-6 shrink-0 place-items-center rounded-full border text-[11px] font-bold',
                done ? 'border-primary bg-primary text-primary-foreground' :
                active ? 'border-primary text-primary' : 'border-muted-foreground/40 text-muted-foreground'
              )}
              aria-hidden="true"
            >
              {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate">{s.title}</span>
              <span className="mt-0.5 flex items-center gap-1 text-[11px] font-normal text-muted-foreground">
                {s.type === 'quiz' ? <CircleHelp className="h-3 w-3" aria-hidden="true" /> : <FileText className="h-3 w-3" aria-hidden="true" />}
                {s.type === 'quiz' ? 'Тест' : 'Теория'}
                {qr === 'fail' && !done && <span className="text-destructive">· есть ошибки</span>}
              </span>
            </span>
          </button>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-4">
          <button
            type="button"
            onClick={() => navigate(`/course/${course.slug}`)}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-md hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="К странице курса"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-1.5 min-w-0 flex-1 text-xs text-muted-foreground overflow-hidden">
            <Link to="/" className="hover:text-primary transition-colors whitespace-nowrap hidden sm:block">
              Каталог
            </Link>
            <ChevronRight className="h-3 w-3 shrink-0 hidden sm:block" />
            
            <Link to={`/course/${course.slug}`} className="hover:text-primary transition-colors truncate">
              {course.title}
            </Link>
            <ChevronRight className="h-3 w-3 shrink-0" />
            
            <span className="truncate hidden md:block">{found.module.title}</span>
            <ChevronRight className="h-3 w-3 shrink-0 hidden md:block" />
            
            <span className="truncate font-semibold text-foreground">{lesson.title}</span>
          </div>
          <button
            type="button"
            onClick={() => toggleBookmark(course.slug, lesson.id)}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-md hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={isBookmarked(course.slug, lesson.id) ? 'Удалить из закладок' : 'Добавить в закладки'}
            title={isBookmarked(course.slug, lesson.id) ? 'Удалить из закладок' : 'В закладки'}
          >
            {isBookmarked(course.slug, lesson.id) ? (
              <BookmarkCheck className="h-5 w-5 text-primary" />
            ) : (
              <Bookmark className="h-5 w-5 text-muted-foreground" />
            )}
          </button>
          <Link
            to="/bookmarks"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-md hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            title="Все закладки"
            aria-label="Перейти ко всем закладкам"
          >
            <Library className="h-5 w-5 text-muted-foreground" />
          </Link>

          <div className="hidden items-center gap-2 sm:flex" aria-hidden="true">
            <div className="h-1.5 w-28 overflow-hidden rounded-full bg-secondary">
              <div className="h-full rounded-full bg-primary transition-[width] duration-300" style={{ width: `${lessonPct}%` }} />
            </div>
            <span className="text-xs font-semibold text-muted-foreground">{lessonPct}%</span>
          </div>
          <div className="hidden sm:block">
            <FontSizeToggle />
          </div>
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-md hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
            aria-label="Открыть список шагов"
          >
            <ListTree className="h-5 w-5" />
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-20">
            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Шаги урока · {doneCount}/{lesson.steps.length}
            </p>
            {sidebar}
          </div>
        </aside>

        <main className="min-w-0 pb-24">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {step.type === 'quiz' ? <CircleHelp className="h-4 w-4 text-primary" aria-hidden="true" /> : <FileText className="h-4 w-4 text-primary" aria-hidden="true" />}
            Шаг {stepIndex + 1} из {lesson.steps.length} · {step.type === 'quiz' ? 'Тест' : 'Теория'}
          </div>
          <h1 ref={h1Ref} tabIndex={-1} className="mt-2 text-2xl font-extrabold tracking-tight focus:outline-none">{step.title}</h1>

          <div className="mt-6">
            {step.type === 'theory' ? (
<TextBlocks
  blocks={step.blocks}
  onResult={(result: QuizResult) => {
    if (result === 'ok') {
      completeStep(course.slug, step.id);
    } else if (result === 'fail') {
      setQuizResult(course.slug, step.id, 'fail');
    }
  }}
/>
) : (
  <QuizView slug={course.slug} step={step} />
)}
          </div>
          
          <StepNotes slug={course.slug} stepId={step.id} />
          
          <ReportError 
            course={course} 
            lesson={lesson} 
            step={step} 
            stepIndex={stepIndex} 
          />
          
           {/* Навигация */}
          <div className="mt-10 flex items-center justify-between gap-3 border-t border-border pt-6">
            {nav?.prev ? (
              <Button asChild variant="outline" className="min-h-[44px]">
                <Link to={nav.prev}><ArrowLeft className="h-4 w-4" aria-hidden="true" />Назад</Link>
              </Button>
            ) : <span />}
            {nav?.next ? (
              <Button asChild className="min-h-[44px]">
                <Link to={nav.next}>Далее<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
              </Button>
            ) : (
              <Button className="min-h-[44px]" onClick={onFinishLesson}>
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />Завершить урок
              </Button>
            )}
          </div>
        </main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Шаги урока"
          onKeyDown={(e) => { if (e.key === 'Escape') setSidebarOpen(false); }}
        >
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} aria-hidden="true" />
          <div className="absolute inset-y-0 right-0 w-[85%] max-w-xs overflow-y-auto bg-card p-4 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-bold tracking-tight">Шаги урока · {doneCount}/{lesson.steps.length}</p>
              <button
                type="button"
                autoFocus
                onClick={() => setSidebarOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-md hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Закрыть список шагов"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {sidebar}
          </div>
        </div>
      )}
    </div>
  );
}