import { Link } from 'react-router';
import { useMemo } from 'react';
import { getCourse, courseStats } from '@/data';
import { useProgress } from '@/lib/progress';
import type { Track } from '@/data/tracks';
import { lessonsWord, coursesWord } from '@/lib/pluralize';
import { ChevronRight } from 'lucide-react';

export function TrackCard({ track }: { track: Track }) {
  const { courseProgress } = useProgress();

  const { totalSteps, doneSteps, totalLessons, courseCount } = useMemo(() => {
    let totalSteps = 0;
    let doneSteps = 0;
    let totalLessons = 0;
    let courseCount = 0;

    for (const tc of track.courses) {
      const c = getCourse(tc.slug);
      if (!c) continue;
      courseCount += 1;
      const stats = courseStats(c);
      totalSteps += stats.steps;
      totalLessons += stats.lessons;
      doneSteps += courseProgress(tc.slug).done;
    }

    return { totalSteps, doneSteps, totalLessons, courseCount };
  }, [track, courseProgress]);

  const pct = totalSteps ? Math.round((doneSteps / totalSteps) * 100) : 0;
  const started = doneSteps > 0;
  const completed = pct === 100 && totalSteps > 0;

  return (
    <Link
      to={`/track/${track.slug}`}
      className="group flex flex-col rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-bold tracking-tight group-hover:text-primary transition-colors">
          {track.title}
          {completed && (
            <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded align-middle">
              Пройден
            </span>
          )}
        </h3>
        <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>

      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground line-clamp-2">
        {track.description}
      </p>

      <p className="mt-3 text-xs text-muted-foreground">
        {courseCount} {coursesWord(courseCount)} · {totalLessons} {lessonsWord(totalLessons)}
      </p>

      {started && (
        <div className="mt-3">
          <div
            className="h-1.5 overflow-hidden rounded-full bg-secondary"
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Прогресс трека"
          >
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-1.5 text-[11px] font-medium text-muted-foreground">
            {pct}% пройдено
          </p>
        </div>
      )}
    </Link>
  );
}