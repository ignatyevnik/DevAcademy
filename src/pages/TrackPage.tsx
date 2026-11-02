import { useParams, Link, Navigate } from 'react-router';
import { ArrowLeft, CheckCircle2, PlayCircle, Clock, BookOpen } from 'lucide-react';
import { tracks } from '@/data/tracks';
import { getCourse, courseStats, findLesson } from '@/data';
import { useProgress } from '@/lib/progress';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function TrackPage() {
  const { slug } = useParams();
  const track = tracks.find((t) => t.slug === slug);
  const { courseProgress, state } = useProgress();

  if (!track) return <Navigate to="/" replace />;

  // Собираем курсы с их прогрессом
  const trackCourses = track.courses
    .map((tc) => {
      const course = getCourse(tc.slug);
      if (!course) return null;
      const stats = courseStats(course);
      const prog = courseProgress(course.slug);
      const last = state.lastVisited[course.slug];
      const lastValid = last && findLesson(course, last.lessonId) ? last : undefined;
      
      const firstLesson = course.modules[0]?.lessons[0];
      const continueTarget = lastValid
        ? `/course/${course.slug}/lesson/${lastValid.lessonId}?step=${lastValid.stepIndex}`
        : firstLesson
          ? `/course/${course.slug}/lesson/${firstLesson.id}`
          : `/course/${course.slug}`;

      return { course, label: tc.label, stats, prog, continueTarget };
    })
    .filter((c): c is NonNullable<typeof c> => c !== null);

  const totalSteps = trackCourses.reduce((sum, c) => sum + c.stats.steps, 0);
  const doneSteps = trackCourses.reduce((sum, c) => sum + c.prog.done, 0);
  const trackPct = totalSteps ? Math.round((doneSteps / totalSteps) * 100) : 0;

  return (
    <div className="min-h-dvh">
      <Header />
      <main className="mx-auto max-w-4xl px-4 pb-20">
        <Link to="/" className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Назад на главную
        </Link>

        <section className="mt-4 rounded-xl border border-border bg-card p-6 sm:p-8">
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{track.title}</h1>
          <p className="mt-2 text-muted-foreground">{track.description}</p>
          
          <div className="mt-6 flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-semibold">Прогресс трека</span>
                <span className="font-bold text-primary">{trackPct}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-secondary">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${trackPct}%` }} />
              </div>
            </div>
            <div className="text-sm text-muted-foreground whitespace-nowrap">
              {doneSteps} из {totalSteps} шагов
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold tracking-tight mb-6">Маршрут обучения</h2>
          
          <div className="relative border-l-2 border-muted ml-4 space-y-8 pb-8">
            {trackCourses.map((tc, i) => {
              const isComplete = tc.prog.pct === 100;
              const isStarted = tc.prog.done > 0;

              return (
                <div key={tc.course.slug} className="relative pl-8">
                  {/* Точка на таймлайне */}
                  <span className={cn(
                    "absolute -left-[11px] top-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 bg-background",
                    isComplete ? "border-primary text-primary" : 
                    isStarted ? "border-primary text-primary" : 
                    "border-muted-foreground/40 text-muted-foreground/40"
                  )}>
                    {isComplete ? <CheckCircle2 className="h-3.5 w-3.5" /> : <span className="text-[10px] font-bold">{i + 1}</span>}
                  </span>

                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold">{tc.course.title}</h3>
                        {isComplete && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded font-medium">Пройден</span>}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{tc.course.subtitle}</p>
                      
                      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5" /> {tc.stats.lessons} уроков</span>
                        <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> ≈{Math.round(tc.course.modules.flatMap(m => m.lessons).reduce((a, l) => a + l.minutes, 0) / 60)} ч</span>
                      </div>
                    </div>

                    <Button asChild variant={isStarted ? "default" : "outline"} className="shrink-0 min-h-[44px]">
                      <Link to={tc.continueTarget}>
                        {isStarted ? <PlayCircle className="h-4 w-4 mr-2" /> : null}
                        {isComplete ? 'Повторить' : isStarted ? 'Продолжить' : 'Начать курс'}
                      </Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}