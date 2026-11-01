import { describe, it, expect } from 'vitest';
import {
  serializeProgress,
  parseProgressJson,
  parseProgressFile,
  formatExportedAt,
  progressFilename,
} from './progress-io';
import type { ProgressState } from './progress';

const sample: ProgressState = {
  done: { 'py:step-1': true, 'py:step-2': true },
  lastVisited: {
    'python-basics': { lessonId: 'py-l1', stepIndex: 2, ts: 1730000000000 },
  },
  quizResults: {
    'py:step-2': 'ok',
    'py:step-3': 'fail',
  },
  bookmarks: { 'python-basics:py-l1': true },
  notes: { 'python-basics:py-l1-s1': 'Это моя заметка' },
  srs: { 'python-basics:py-l1-s1': { interval: 1, nextReview: 1730000000000, ease: 2.5, repetitions: 1 } },
};

describe('serializeProgress', () => {
  it('создаёт JSON с app, version и progress', () => {
    const json = serializeProgress(sample);
    const parsed = JSON.parse(json);
    expect(parsed.app).toBe('dev-academy');
    expect(parsed.version).toBe(1);
    expect(parsed.progress.done).toEqual(sample.done);
    expect(typeof parsed.exported_at).toBe('string');
  });

  it('pretty-printed (2 пробела)', () => {
    const json = serializeProgress(sample);
    expect(json).toContain('\n  ');
  });
});

describe('parseProgressJson', () => {
  it('roundtrip: serialize → parse возвращает то же состояние', () => {
    const json = serializeProgress(sample);
    const restored = parseProgressJson(json);
    expect(restored).toEqual(sample);
  });

  it('бросает на не-JSON', () => {
    expect(() => parseProgressJson('not json')).toThrow(/корректным JSON/);
  });

  it('бросает на неверный app', () => {
    const json = JSON.stringify({
      app: 'other-app',
      version: 1,
      exported_at: '2025-01-01',
      progress: { done: {}, lastVisited: {}, quizResults: {} },
    });
    expect(() => parseProgressJson(json)).toThrow(/не тот файл/);
  });

  it('бросает на неверную версию', () => {
    const json = JSON.stringify({
      app: 'dev-academy',
      version: 99,
      exported_at: '2025-01-01',
      progress: { done: {}, lastVisited: {}, quizResults: {} },
    });
    expect(() => parseProgressJson(json)).toThrow(/неподдерживаемая версия/);
  });

  it('бросает на отсутствие progress', () => {
    const json = JSON.stringify({
      app: 'dev-academy',
      version: 1,
      exported_at: '2025-01-01',
    });
    expect(() => parseProgressJson(json)).toThrow();
  });

  it('бросает на неверный quizResult', () => {
    const json = JSON.stringify({
      app: 'dev-academy',
      version: 1,
      exported_at: '2025-01-01',
      progress: {
        done: {},
        lastVisited: {},
        quizResults: { 'py:step-1': 'unknown' },
      },
    });
    expect(() => parseProgressJson(json)).toThrow(/quizResults/);
  });

  it('принимает пустое состояние', () => {
    const empty: ProgressState = { done: {}, lastVisited: {}, quizResults: {}, bookmarks: {}, notes: {}, srs: {} };
    const json = serializeProgress(empty);
    expect(parseProgressJson(json)).toEqual(empty);
  });
});

describe('progressFilename', () => {
  it('формат dev-academy-progress-YYYY-MM-DD_HH-mm-ss.json', () => {
    // new Date(year, monthIndex, day, hours, minutes, seconds) — ЛОКАЛЬНОЕ время
    const date = new Date(2025, 10, 1, 14, 30, 45); // 1 ноября 2025, 14:30:45
    expect(progressFilename(date)).toBe(
      'dev-academy-progress-2025-11-01_14-30-45.json',
    );
  });

  it('дополняет нулями месяц, день, час, минуту, секунду', () => {
    const date = new Date(2025, 0, 5, 3, 7, 9); // 5 января 2025, 03:07:09
    expect(progressFilename(date)).toBe(
      'dev-academy-progress-2025-01-05_03-07-09.json',
    );
  });

  it('сохраняет сортируемость: более поздние даты идут лексикографически позже', () => {
    const a = new Date(2025, 10, 1, 9, 0, 0);
    const b = new Date(2025, 10, 1, 14, 30, 45);
    expect(progressFilename(a) < progressFilename(b)).toBe(true);
  });
});

describe('parseProgressFile', () => {
  it('возвращает полные метаданные', () => {
    const json = serializeProgress(sample);
    const file = parseProgressFile(json);
    expect(file.app).toBe('dev-academy');
    expect(file.version).toBe(1);
    expect(typeof file.exported_at).toBe('string');
    expect(file.progress).toEqual(sample);
  });

  it('бросает на не-JSON', () => {
    expect(() => parseProgressFile('not json')).toThrow(/корректным JSON/);
  });

  it('бросает на неверный app', () => {
    const json = JSON.stringify({
      app: 'other-app',
      version: 1,
      exported_at: '2025-01-01T00:00:00Z',
      progress: { done: {}, lastVisited: {}, quizResults: {} },
    });
    expect(() => parseProgressFile(json)).toThrow(/не тот файл/);
  });
});

describe('formatExportedAt', () => {
  it('форматирует ISO в YYYY-MM-DD HH:MM (локальное время)', () => {
    const d = new Date(2025, 10, 1, 14, 30, 0); // локальное 1 ноября 14:30
    const iso = d.toISOString();
    expect(formatExportedAt(iso)).toBe('2025-11-01 14:30');
  });

  it('возвращает исходную строку, если дата невалидная', () => {
    expect(formatExportedAt('not a date')).toBe('not a date');
  });

  it('возвращает исходную строку, если ISO пустой', () => {
    expect(formatExportedAt('')).toBe('');
  });
});