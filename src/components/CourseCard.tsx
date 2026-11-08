import { Link } from 'react-router';
import { Clock, Layers, CheckCircle2 } from 'lucide-react';
import type { Course } from '@/data';
import { courseStats, allLessons } from '@/data';
import { useProgress } from '@/lib/progress';
import { CourseIcon } from './CourseIcon';
import { Badge } from '@/components/ui/badge';

export function CourseCard({ course }: { course: Course }) {
  const { courseProgress } = useProgress();
  const { lessons, steps } = courseStats(course);
  const { pct, done } = courseProgress(course.slug);
  const minutes = allLessons(course).reduce((a, l) => a + l.minutes, 0);

  return (
    <Link
      to={`/course/${course.slug}`}
      className="group flex h-full w-full min-w-0 flex-col rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex items-start justify-between gap-3">
        <CourseIcon icon={course.icon} accent={course.accent} className="h-12 w-12 shrink-0" />
        <Badge variant="secondary" className="text-xs font-medium shrink-0">
          {course.level}
        </Badge>
      </div>

      <h3 className="mt-4 text-lg font-bold leading-snug tracking-tight group-hover:text-primary line-clamp-2 break-words">
        {course.title}
      </h3>
      <p className="mt-1.5 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
        {course.subtitle}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Layers className="h-3.5 w-3.5" aria-hidden="true" />
          {lessons} уроков · {steps} шагов
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />≈{Math.round(minutes / 60)} ч
        </span>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-muted-foreground">
            {done > 0 ? (
              <span className="inline-flex items-center gap-1 text-primary">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                Пройдено {pct}%
              </span>
            ) : (
              'Ещё не начат'
            )}
          </span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-300"
            style={{ width: `${pct}%` }}
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Прогресс курса ${course.title}`}
          />
        </div>
      </div>
    </Link>
  );
}