import { Link, useNavigate } from 'react-router';
import { ArrowLeft, Bookmark } from 'lucide-react';
import { useProgress } from '@/lib/progress';
import { getCourse, findLesson } from '@/data';
import type { Course, Lesson } from '@/data';
import { Header } from '@/components/Header';

interface BookmarkItem {
  course: Course;
  lesson: Lesson;
}

export default function BookmarksPage() {
  const { state } = useProgress();
  const navigate = useNavigate();

  const items: BookmarkItem[] = [];
  for (const key of Object.keys(state.bookmarks)) {
    const [slug, lessonId] = key.split(':');
    const course = getCourse(slug);
    if (!course) continue;
    const found = findLesson(course, lessonId);
    if (!found) continue;
    items.push({ course, lesson: found.lesson });
  }

  return (
    <div className="min-h-dvh">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-8 pb-24">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground mb-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
        >
          <ArrowLeft className="h-4 w-4" /> На главную
        </button>
        
        <h1 className="text-2xl font-extrabold tracking-tight mb-6 flex items-center gap-2">
          <Bookmark className="h-6 w-6 text-primary" /> Закладки
        </h1>
        
        {items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
            <p className="font-semibold">Закладок пока нет</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Нажмите иконку закладки на странице урока, чтобы сохранить его.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {items.map(({ course, lesson }) => (
              <Link
                key={`${course.slug}-${lesson.id}`}
                to={`/course/${course.slug}/lesson/${lesson.id}`}
                className="flex flex-col rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="text-xs text-muted-foreground">{course.title}</span>
                <span className="mt-1 font-bold">{lesson.title}</span>
                <span className="mt-auto pt-3 text-xs text-muted-foreground">{lesson.minutes} мин</span>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}