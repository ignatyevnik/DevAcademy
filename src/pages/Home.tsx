import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router';
import { Bookmark, BookOpenCheck, WifiOff } from 'lucide-react';
import { courses, courseStats, getCourse, findLesson } from '@/data';
import { useProgress } from '@/lib/progress';
import { Header } from '@/components/Header';
import { CourseCard } from '@/components/CourseCard';
import { coursesWord } from '@/lib/pluralize';
import { tracks } from '@/data/tracks';
import { TrackCard } from '@/components/TrackCard';
import { ProgressExport } from '@/components/ProgressExport';
import { Button } from '@/components/ui/button';
import { ReportError } from '@/components/ReportError';

const ALL_TAGS = ['Все', ...Array.from(new Set(courses.flatMap((c) => c.tags)))];

export default function Home() {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') ?? '');
  const [tag, setTag] = useState('Все');
  const deferredQuery = useDeferredValue(query);
  const { totalStats, courseProgress, getDueReviews } = useProgress();
  const dueCount = useMemo(() => getDueReviews().length, [getDueReviews]);

  // URL → state
  useEffect(() => {
    setQuery(params.get('q') ?? '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.get('q')]);

  // state → URL (replace)
  useEffect(() => {
    const next = new URLSearchParams(params);
    if (query) next.set('q', query); else next.delete('q');
    if (next.toString() !== params.toString()) setParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const stats = useMemo(() => totalStats(), [totalStats]);
  const startedCourses = useMemo(
    () => courses.filter((c) => courseProgress(c.slug).done > 0),
    [courseProgress]
  );
  const { state } = useProgress();

    const bookmarkedItems = useMemo(() => {
    const items = [];
    for (const key of Object.keys(state.bookmarks)) {
      if (!state.bookmarks[key]) continue;
      const [slug, lessonId] = key.split(':');
      const course = getCourse(slug);
      if (!course) continue;
      const found = findLesson(course, lessonId);
      if (found) {
        items.push({ course, lesson: found.lesson });
      }
    }
    return items;
  }, [state.bookmarks]);

  const filtered = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    return courses.filter((c) => {
      const byTag = tag === 'Все' || c.tags.includes(tag);
      const byQuery =
        !q || [c.title, c.subtitle, c.description, ...c.tags].join(' ').toLowerCase().includes(q);
      return byTag && byQuery;
    });
  }, [deferredQuery, tag]);

  const totalSteps = useMemo(() => courses.reduce((a, c) => a + courseStats(c).steps, 0), []);

  return (
    <div className="min-h-dvh">
      <Header/>

      <main className="mx-auto max-w-6xl px-4 pb-20">
        <section className="py-10 sm:py-14">
          <p className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-accent/50 px-3.5 py-1.5 text-xs font-semibold text-primary">
            <WifiOff className="h-3.5 w-3.5" aria-hidden="true" />
            Работает полностью офлайн
          </p>
          <h1 className="mt-4 max-w-2xl text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
            Инженерная база знаний: тестирование, Python, Docker, Kubernetes и ИИ-агенты
          </h1>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">
            Пошаговые уроки с проверочными вопросами. Прогресс сохраняется на устройстве — учитесь
            дома, в метро или на даче без интернета.
          </p>

          <div className="mt-6 flex flex-wrap gap-6 text-sm">
            <div>
              <p className="text-2xl font-extrabold tracking-tight text-primary">{courses.length}</p>
              <p className="text-muted-foreground">{coursesWord(courses.length)} в базе</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold tracking-tight text-primary">{totalSteps}</p>
              <p className="text-muted-foreground">шагов обучения</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold tracking-tight text-primary">{stats.donePct}%</p>
              <p className="text-muted-foreground">пройдено вами</p>
            </div>
          </div>
        </section>

        {startedCourses.length > 0 && (
          <section id="my-courses" className="scroll-mt-20">
            <div className="flex items-center gap-2.5">
              <BookOpenCheck className="h-5 w-5 text-primary" aria-hidden="true" />
              <h2 className="text-xl font-bold tracking-tight">Моё обучение</h2>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {startedCourses.map((c) => <CourseCard key={c.slug} course={c} />)}
            </div>
          </section>
        )}

        {dueCount > 0 && (
          <section className="mb-8 rounded-xl border border-primary/30 bg-accent/20 p-5 sm:flex sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-primary">Пора повторить!</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                У вас {dueCount} вопросов на сегодня для закрепления знаний.
              </p>
            </div>
            <Button asChild className="mt-4 sm:mt-0">
              <Link to="/review">Начать повторение</Link>
            </Button>
          </section>
        )}

                {/* Закладки */}
        {bookmarkedItems.length > 0 && (
          <section id="bookmarks" className="mt-12 scroll-mt-20">
            <div className="flex items-center gap-2.5">
              <Bookmark className="h-5 w-5 text-primary" aria-hidden="true" />
              <h2 className="text-xl font-bold tracking-tight">Закладки</h2>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {bookmarkedItems.map(({ course, lesson }) => (
                <Link
                  key={`${course.slug}-${lesson.id}`}
                  to={`/course/${course.slug}/lesson/${lesson.id}`}
                  className="flex flex-col rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
                >
                  <span className="text-xs text-muted-foreground">{course.title}</span>
                  <span className="mt-1 font-bold">{lesson.title}</span>
                  <span className="mt-auto pt-3 text-xs text-muted-foreground">{lesson.minutes} мин</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Треки */}
        <section id="tracks" className="mt-12 scroll-mt-20">
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold tracking-tight">Треки обучения</h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Наборы курсов под разные роли — порядок слева направо
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tracks.map((t) => (
              <TrackCard key={t.slug} track={t} />
            ))}
          </div>
        </section>

        <section id="catalog" className="mt-12 scroll-mt-20">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold tracking-tight">Каталог курсов</h2>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Фильтр по темам">
              {ALL_TAGS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTag(t)}
                  aria-pressed={tag === t}
                  className={`min-h-[36px] rounded-full border px-3.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    tag === t
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-card text-foreground/70 hover:border-primary/40 hover:text-foreground'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div aria-live="polite" aria-atomic="true" className="sr-only">
            Найдено {filtered.length} {coursesWord(filtered.length)}
          </div>

          {filtered.length === 0 ? (
            <div className="mt-8 rounded-xl border border-dashed border-border bg-card p-10 text-center">
              <p className="font-semibold">Ничего не найдено</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Попробуйте другой запрос или сбросьте фильтр по теме.
              </p>
            </div>
          ) : (
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((c) => <CourseCard key={c.slug} course={c} />)}
            </div>
          )}
        </section>
        <ProgressExport />
      </main>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5">
            <p className="font-semibold text-foreground">
              Дев<span className="text-primary">Академия</span>
            </p>
            <p className="text-xs">Прогресс хранится локально на этом устройстве</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <Link 
              to="/editor" 
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors hover:underline underline-offset-4"
            >
              Создать свой курс
            </Link>
            <ReportError context="Главная" className="bg-background" />
          </div>
        </div>
      </footer>
    </div>
  );
}