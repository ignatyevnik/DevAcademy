import { Link } from 'react-router';
import { courses, courseStats } from '@/data';
import { useProgress } from '@/lib/progress';
import type { Track } from '@/data/tracks';
import { lessonsWord, coursesWord } from '@/lib/pluralize';
import { ChevronRight } from 'lucide-react';

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
    <Link 
      to={`/track/${track.slug}`}
      className="group flex flex-col rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex items-start justify-between">
        <h3 className="text-base font-bold tracking-tight group-hover:text-primary transition-colors">
          {track.title}
        </h3>
        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
      
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground line-clamp-2">
        {track.description}
      </p>

      <p className="mt-3 text-xs text-muted-foreground">
        {trackCourses.length} {coursesWord(trackCourses.length)} · {totalLessons} {lessonsWord(totalLessons)}
      </p>

      {started && (
        <div className="mt-3">
          <div className="h-1.5 overflow-hidden rounded-full bg-secondary" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
            <div className="h-full rounded-full bg-primary transition-[width] duration-300" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-1.5 text-[11px] font-medium text-muted-foreground">
            {pct}% пройдено
          </p>
        </div>
      )}
    </Link>
  );
}