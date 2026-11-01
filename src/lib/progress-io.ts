import { z } from 'zod';
import type { ProgressState } from './progress';

const APP_ID = 'dev-academy';
const FORMAT_VERSION = 1;

const exportedStateSchema = z.object({
  done: z.record(z.string(), z.literal(true)),
  lastVisited: z.record(
    z.string(),
    z.object({
      lessonId: z.string().min(1),
      stepIndex: z.number().int().nonnegative(),
      ts: z.number().nonnegative(),
    }),
  ),
  quizResults: z.record(z.string(), z.enum(['ok', 'partial', 'fail'])),
  bookmarks: z.record(z.string(), z.literal(true)).optional().default({}),
  notes: z.record(z.string(), z.string()).optional().default({}), // <-- ДОБАВИТЬ
});

const exportFileSchema = z.object({
  app: z.literal(APP_ID, {
    message: `не тот файл: ожидается "${APP_ID}"`,
  }),
  version: z.literal(FORMAT_VERSION, {
    message: `неподдерживаемая версия формата (ожидается ${FORMAT_VERSION})`,
  }),
  exported_at: z.string(),
  progress: exportedStateSchema,
});

export type ExportFile = z.infer<typeof exportFileSchema>;

/** Сериализует состояние в строку JSON для скачивания. */
export function serializeProgress(state: ProgressState): string {
  const data: ExportFile = {
    app: APP_ID,
    version: FORMAT_VERSION,
    exported_at: new Date().toISOString(),
    progress: state,
  };
  return JSON.stringify(data, null, 2);
}

/** Парсит JSON и возвращает весь файл, включая метаданные. */
export function parseProgressFile(raw: string): ExportFile {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('файл не является корректным JSON');
  }

  const result = exportFileSchema.safeParse(parsed);
  if (!result.success) {
    const issue = result.error.issues[0];
    const path = issue.path.length > 0 ? issue.path.join('.') : '(корень)';
    throw new Error(`${path}: ${issue.message}`);
  }

  return result.data;
}

/** Парсит JSON и возвращает только состояние прогресса. */
export function parseProgressJson(raw: string): ProgressState {
  return parseProgressFile(raw).progress;
}

/** Скачивает JSON как файл через Blob. */
export function downloadJson(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

/** Имя файла с локальной датой и временем: dev-academy-progress-2025-11-01_14-30-45.json */
export function progressFilename(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = pad2(date.getMonth() + 1);
  const d = pad2(date.getDate());
  const hh = pad2(date.getHours());
  const mm = pad2(date.getMinutes());
  const ss = pad2(date.getSeconds());
  return `dev-academy-progress-${y}-${m}-${d}_${hh}-${mm}-${ss}.json`;
}

/** Форматирует ISO-timestamp в читаемый вид: 2025-11-01 14:30 */
export function formatExportedAt(iso: string): string {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
  } catch {
    return iso;
  }
}