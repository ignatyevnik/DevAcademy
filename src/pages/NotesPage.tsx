import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, StickyNote, Download, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { getCourse } from '@/data';
import type { Course, Lesson } from '@/data';
import { useProgress } from '@/lib/progress';
import { exportNotesMarkdown, notesFilename, downloadText } from '@/lib/progress-io';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';

interface NoteItem {
  key: string;
  slug: string;
  stepId: string;
  course?: Course;
  lesson?: Lesson;
  stepTitle?: string;
  text: string;
}

export default function NotesPage() {
  const navigate = useNavigate();
  const { state, setNote } = useProgress();

  const items: NoteItem[] = useMemo(() => {
    const result: NoteItem[] = [];
    for (const [key, text] of Object.entries(state.notes)) {
      const [slug, stepId] = key.split(':');
      const course = getCourse(slug);
      let lesson: Lesson | undefined;
      let stepTitle: string | undefined;
      if (course) {
        outer: for (const m of course.modules) {
          for (const l of m.lessons) {
            const s = l.steps.find((st) => st.id === stepId);
            if (s) {
              lesson = l;
              stepTitle = s.title;
              break outer;
            }
          }
        }
      }
      result.push({ key, slug, stepId, course, lesson, stepTitle, text });
    }
    result.sort((a, b) => {
      const ca = a.course?.title ?? '~';
      const cb = b.course?.title ?? '~';
      if (ca !== cb) return ca.localeCompare(cb, 'ru');
      const la = a.lesson?.title ?? '';
      const lb = b.lesson?.title ?? '';
      return la.localeCompare(lb, 'ru');
    });
    return result;
  }, [state.notes]);

  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [savedKeys, setSavedKeys] = useState<Set<string>>(new Set());

  const handleChange = (key: string, value: string) => {
    setDrafts((d) => ({ ...d, [key]: value }));
    setSavedKeys((s) => {
      const n = new Set(s);
      n.delete(key);
      return n;
    });
  };

  const handleSave = (key: string, slug: string, stepId: string) => {
    const value = drafts[key] ?? items.find((i) => i.key === key)?.text ?? '';
    setNote(slug, stepId, value);
    setSavedKeys((s) => new Set(s).add(key));
    setTimeout(() => {
      setSavedKeys((s) => {
        const n = new Set(s);
        n.delete(key);
        return n;
      });
    }, 2000);
  };

  const handleExport = () => {
    const { markdown, count } = exportNotesMarkdown(state);
    if (count === 0) {
      toast.message('Заметок пока нет');
      return;
    }
    downloadText(markdown, notesFilename(), 'text/markdown;charset=utf-8');
    toast.success(`Экспортировано заметок: ${count}`);
  };

  return (
    <div className="min-h-dvh">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-8 pb-24">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> На главную
        </button>

        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <StickyNote className="h-6 w-6 text-primary" /> Мои заметки
            <span className="text-muted-foreground font-normal text-base">· {items.length}</span>
          </h1>
          <Button onClick={handleExport} disabled={items.length === 0}>
            <Download className="h-4 w-4" /> Экспорт в .md
          </Button>
        </div>

        {items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
            <p className="font-semibold">Заметок пока нет</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Откройте урок и добавьте заметку в блоке «Мои заметки» под шагом.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => {
              const draft = drafts[item.key] ?? item.text;
              const saved = savedKeys.has(item.key);
              const orphan = !item.course || !item.lesson;
              return (
                <div key={item.key} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <div className="min-w-0">
                      {orphan ? (
                        <span className="inline-flex items-center gap-1.5 text-sm text-destructive">
                          <AlertCircle className="h-4 w-4 shrink-0" />
                          {item.slug} · {item.stepId} (шаг не найден)
                        </span>
                      ) : (
                        <>
                          <p className="text-xs text-muted-foreground truncate">
                            {item.course!.title} · {item.lesson!.title}
                          </p>
                          <p className="text-sm font-semibold truncate">{item.stepTitle}</p>
                        </>
                      )}
                    </div>
                    {!orphan && (
                      <Link
                        to={`/course/${item.slug}/lesson/${item.lesson!.id}`}
                        className="text-xs text-primary hover:underline shrink-0"
                      >
                        Открыть шаг →
                      </Link>
                    )}
                  </div>
                  <textarea
                    value={draft}
                    onChange={(e) => handleChange(item.key, e.target.value)}
                    onBlur={() => handleSave(item.key, item.slug, item.stepId)}
                    placeholder="Текст заметки"
                    className="w-full min-h-[80px] resize-y rounded-lg border border-input bg-background p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <div className="mt-1 flex justify-end text-xs">
                    {saved && (
                      <span className="text-primary font-medium inline-flex items-center gap-1">
                        <Check className="h-3 w-3" /> Сохранено
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}