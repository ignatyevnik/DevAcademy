import type { QueryExecResult } from 'sql.js';

export interface RunResult {
  columns: string[];
  rows: unknown[][];
}

export interface SandboxHandle {
  id: string;
}

// ─── Singleton worker + request/response protocol ────────────────────────────

let workerPromise: Promise<Worker> | null = null;
let msgId = 0;
const pending = new Map<number, { resolve: (v: any) => void; reject: (e: Error) => void }>();

function sendRaw(w: Worker, msg: Record<string, unknown>): Promise<any> {
  const id = ++msgId;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    w.postMessage({ ...msg, id });
  });
}

function getWorker(): Promise<Worker> {
  if (!workerPromise) {
    workerPromise = (async () => {
      const w = new Worker(new URL('./sql.worker.ts', import.meta.url), {
        type: 'module',
      });

      w.onmessage = (e) => {
        const { id, ok, error, ...rest } = e.data;
        const p = pending.get(id);
        if (!p) return;
        pending.delete(id);
        if (ok) p.resolve(rest);
        else p.reject(new Error(error ?? 'worker error'));
      };

      w.onerror = (e) => {
        const err = new Error(e.message || 'worker error');
        for (const [, p] of pending) p.reject(err);
        pending.clear();
      };

      try {
        await sendRaw(w, { type: 'init' });
      } catch (e) {
        w.terminate();
        workerPromise = null; // дать шанс на ретрай
        throw e;
      }
      return w;
    })();
  }
  return workerPromise;
}

async function send(msg: Record<string, unknown>): Promise<any> {
  const w = await getWorker();
  return sendRaw(w, msg);
}

// ─── Public API ──────────────────────────────────────────────────────────────

export async function createSandbox(schema: string): Promise<SandboxHandle> {
  const id = `sb-${Math.random().toString(36).slice(2, 10)}`;
  await send({ type: 'create', handle: id, schema });
  return { id };
}

export async function runQuery(
  handle: SandboxHandle,
  sql: string,
  forbidden?: string[],
): Promise<QueryExecResult[]> {
  const res = await send({ type: 'run', handle: handle.id, sql, forbidden });
  return res.results as QueryExecResult[];
}

export async function evaluateWithSchema(
  schema: string,
  sql: string,
): Promise<QueryExecResult[]> {
  const res = await send({ type: 'evaluate', schema, sql });
  return res.results as QueryExecResult[];
}

export async function closeSandbox(handle: SandboxHandle): Promise<void> {
  await send({ type: 'close', handle: handle.id });
}

// ─── Pure helpers (остаются синхронными, работают на главном потоке) ────────

export function pickResult(results: QueryExecResult[]): RunResult | null {
  if (!results || results.length === 0) return null;
  const last = results[results.length - 1];
  if (!last || !last.columns) return null;
  return { columns: last.columns, rows: last.values as unknown[][] };
}

export function resultsMatch(
  actual: RunResult,
  expected: RunResult & { order?: 'order' | 'set' },
): boolean {
  if (actual.columns.length !== expected.columns.length) return false;
  if (actual.rows.length !== expected.rows.length) return false;

  // 'set' — сравниваем как множества строк, порядок не важен.
  // 'order' или отсутствие — строгий порядок.
  if (expected.order === 'set') {
    const norm = (rows: unknown[][]) =>
      rows.map((r) => JSON.stringify(r)).sort();
    const a = norm(actual.rows);
    const e = norm(expected.rows);
    return a.every((v, i) => v === e[i]);
  }

  for (let i = 0; i < actual.rows.length; i++) {
    if (JSON.stringify(actual.rows[i]) !== JSON.stringify(expected.rows[i])) {
      return false;
    }
  }
  return true;
}