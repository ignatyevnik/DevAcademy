import type { Database, SqlJsStatic, QueryExecResult } from 'sql.js';

let sqlPromise: Promise<SqlJsStatic> | null = null;

/** Инициализирует sql.js один раз на всё приложение. */
export async function getSql(): Promise<SqlJsStatic> {
  if (!sqlPromise) {
    const initSqlJs = (await import('sql.js')).default;
    sqlPromise = initSqlJs({
      locateFile: () =>
        new URL('sql.js/dist/sql-wasm.wasm', import.meta.url).href,
    });
  }
  return sqlPromise;
}

export interface RunResult {
  columns: string[];
  rows: (string | number | null)[][];
}

export function runQuery(db: Database, sql: string): RunResult[] {
  const raw: QueryExecResult[] = db.exec(sql);
  return raw.map((r) => ({
    columns: r.columns,
    rows: r.values as (string | number | null)[][],
  }));
}

/** Возвращает последний SELECT-результат (с колонками). */
export function pickResult(results: RunResult[]): RunResult | null {
  const withCols = results.filter((r) => r.columns.length > 0);
  return withCols.length > 0 ? withCols[withCols.length - 1] : null;
}

function normalizeRows(
  rows: (string | number | null)[][],
  order: 'order' | 'set',
): string[] {
  const cleaned = rows.map((r) =>
    r.map((v) => (v === null ? null : String(v).trim())),
  );
  const serialized = cleaned.map((r) => JSON.stringify(r));
  return order === 'set' ? [...serialized].sort() : serialized;
}

export function resultsMatch(
  actual: RunResult,
  expected: { columns: string[]; rows: (string | number | null)[][]; order?: 'order' | 'set' },
): boolean {
  if (actual.columns.length !== expected.columns.length) return false;
  const aCols = actual.columns.map((c) => c.toLowerCase());
  const eCols = expected.columns.map((c) => c.toLowerCase());
  if (JSON.stringify(aCols) !== JSON.stringify(eCols)) return false;

  const order = expected.order ?? 'order';
  const a = normalizeRows(actual.rows, order);
  const e = normalizeRows(expected.rows, order);
  return JSON.stringify(a) === JSON.stringify(e);
}