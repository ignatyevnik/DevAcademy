import { useRef, useState } from 'react';
import { Download, Upload, AlertTriangle, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { useProgress } from '@/lib/progress';
import {
  serializeProgress,
  parseProgressFile,
  formatExportedAt,
  downloadJson,
  progressFilename,
  exportNotesMarkdown,
  notesFilename,
  downloadText,
} from '@/lib/progress-io';
import { Button } from '@/components/ui/button';
import { getCourse, findLesson } from '@/data';

export function ProgressExport() {
  const { state, replaceState } = useProgress();
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const totalDone = Object.keys(state.done).length;
  const totalQuizzes = Object.keys(state.quizResults).length;
  const totalBookmarks = Object.keys(state.bookmarks).length;
  const totalNotes = Object.keys(state.notes).length;
  const isEmpty =
    totalDone === 0 &&
    totalQuizzes === 0 &&
    totalBookmarks === 0 &&
    totalNotes === 0 &&
    Object.keys(state.lastVisited).length === 0;

  const onExport = () => {
    try {
      const json = serializeProgress(state);
      const filename = progressFilename();
      downloadJson(json, filename);
      toast.success(`Сохранено: ${filename}`, { duration: 5000 });
    } catch {
      toast.error('Не удалось сохранить прогресс');
    }
  };

  const onExportNotes = () => {
    const { markdown, count } = exportNotesMarkdown(state);
    if (count === 0) {
      toast.message('Заметок пока нет — нечего экспортировать');
      return;
    }
    downloadText(markdown, notesFilename(), 'text/markdown;charset=utf-8');
    toast.success(`Экспортировано заметок: ${count}`);
  };

  const onImportClick = () => {
    fileRef.current?.click();
  };

const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  e.target.value = '';
  if (!file) return;

  setBusy(true);
  try {
    const raw = await file.text();
    const parsed = parseProgressFile(raw);
    const when = formatExportedAt(parsed.exported_at);

    const ok = window.confirm(
      `Файл от ${when}.\nТекущий прогресс будет заменён. Продолжить?`,
    );
    if (!ok) return;

    // Чистим lastVisited: оставляем только записи, где курс и урок ещё существуют
    const sanitized = { ...parsed.progress };
    const cleanedLastVisited: typeof sanitized.lastVisited = {};
    for (const [slug, v] of Object.entries(sanitized.lastVisited)) {
      const c = getCourse(slug);
      if (c && findLesson(c, v.lessonId)) {
        cleanedLastVisited[slug] = v;
      }
    }
    sanitized.lastVisited = cleanedLastVisited;

    replaceState(sanitized);
    toast.success(`Прогресс загружен (файл от ${when})`);

    setTimeout(() => window.location.reload(), 500);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'неизвестная ошибка';
    toast.error(`Не удалось загрузить: ${msg}`);
  } finally {
    setBusy(false);
  }
};

  return (
    <section id="progress" className="mt-12 scroll-mt-20">
      <h2 className="text-xl font-bold tracking-tight">Прогресс обучения</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Прогресс хранится в этом браузере. Скачайте файл, чтобы перенести его на другое устройство
        или сохранить на будущее.
      </p>

      <div className="mt-4 rounded-xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <span>
            <span className="font-semibold text-primary">{totalDone}</span>{' '}
            <span className="text-muted-foreground">шагов пройдено</span>
          </span>
          <span>
            <span className="font-semibold text-primary">{totalQuizzes}</span>{' '}
            <span className="text-muted-foreground">квизов решено</span>
          </span>
          {totalBookmarks > 0 && (
            <span>
              <span className="font-semibold text-primary">{totalBookmarks}</span>{' '}
              <span className="text-muted-foreground">закладок</span>
            </span>
          )}
          {totalNotes > 0 && (
            <span>
              <span className="font-semibold text-primary">{totalNotes}</span>{' '}
              <span className="text-muted-foreground">заметок</span>
            </span>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            type="button"
            onClick={onExport}
            disabled={isEmpty}
            className="min-h-[44px]"
            aria-label="Скачать прогресс в JSON"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            Скачать
          </Button>
          
          <Button
            type="button"
            onClick={onImportClick}
            disabled={busy}
            variant="outline"
            className="min-h-[44px]"
            aria-label="Загрузить прогресс из JSON"
          >
            <Upload className="h-4 w-4" aria-hidden="true" />
            Загрузить
          </Button>
          
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            onChange={onFileChange}
            className="hidden"
            aria-hidden="true"
            tabIndex={-1}
          />
          
          <Button
            type="button"
            variant="outline"
            onClick={onExportNotes}
            className="min-h-[44px]"
            aria-label="Скачать заметки в Markdown"
          >
            <FileText className="h-4 w-4" aria-hidden="true" />
            Заметки (.md)
          </Button>
        </div>

        {isEmpty && (
          <p className="mt-3 text-xs text-muted-foreground">
            Пока нечего сохранять — пройдите хотя бы один шаг.
          </p>
        )}

        <details className="mt-4 text-xs text-muted-foreground">
          <summary className="inline-flex cursor-pointer items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
            О формате и безопасности
          </summary>
          <ul className="mt-2 space-y-1 pl-4">
            <li>Файл — обычный JSON, можно открыть в любом текстовом редакторе.</li>
            <li>
              Содержит только ваш прогресс: пройденные шаги, результаты квизов и последнюю
              позицию. Никаких персональных данных.
            </li>
            <li>Загрузка заменяет текущий прогресс целиком (не сливает).</li>
          </ul>
        </details>
      </div>
    </section>
  );
}