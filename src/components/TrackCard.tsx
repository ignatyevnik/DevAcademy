import { Link } from 'react-router';
import { courses, courseStats } from '@/data';
import { useProgress } from '@/lib/progress';
import type { Track } from '@/data/tracks';
import { lessonsWord, coursesWord } from '@/lib/pluralize';

export function TrackCard({ track }: { track: Track }) {
  const { courseProgress } = useProgress();

  const trackCourses = track.courses
    .map((tc) => courses.find((c) => c.slug === tc.slug))
    .filter((c): c is NonNullable<typeof c> => c !== undefined);

  const totalLessons = trackCourses.reduce((sum, c) => sum + courseStats(c).lessons, 0);
  const totalSteps = trackCourses.reduce((sum, c) => sum + courseStats(c).steps, 0);
  const doneSteps = trackCourses.reduce((sum, c) => sum + courseProgress(c.slug).done, 0);
  const pct = totalSteps ? Math.round((doneSteps / totalSteps) * 100) : 0;
  const started = doneSteps > 0;

  return (
    <div className="flex flex-col rounded-xl border border-border bg-card p-5">
      <h3 className="text-base font-bold tracking-tight">{track.title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
        {track.description}
      </p>

      <p className="mt-3 text-xs text-muted-foreground">
        {trackCourses.length} {coursesWord(trackCourses.length)} · {totalLessons}{' '}
        {lessonsWord(totalLessons)}
      </p>

      {started && (
        <div className="mt-2">
          <div
            className="h-1.5 overflow-hidden rounded-full bg-secondary"
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Прогресс трека ${track.title}`}
          >
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-1 text-[11px] font-medium text-muted-foreground">
            {pct}% пройдено
          </p>
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-x-1 gap-y-1 text-xs">
        {track.courses.map((tc, i) => (
          <span key={tc.slug} className="inline-flex items-center gap-1">
            {i > 0 && (
              <span className="text-muted-foreground/50" aria-hidden="true">
                →
              </span>
            )}
            <Link
              to={`/course/${tc.slug}`}
              className="font-medium text-foreground/80 transition-colors hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
            >
              {tc.label}
            </Link>
          </span>
        ))}
      </div>
    </div>
  );
}