import type { PyodideInterface } from 'pyodide';
import type { PythonBlock } from '@/data/types';

let pyodidePromise: Promise<PyodideInterface> | null = null;
let worker: Worker | null = null;
let workerInitPromise: Promise<void> | null = null;

export async function getPyodide(): Promise<PyodideInterface> {
  if (!pyodidePromise) {
    pyodidePromise = (async () => {
      const { loadPyodide } = await import('pyodide');
      return loadPyodide({
        indexURL: `${import.meta.env.BASE_URL}assets/pyodide/`,
      });
    })().catch((e) => {
      pyodidePromise = null;
      throw e;
    });
  }
  return pyodidePromise;
}

type PyProxy = ReturnType<PyodideInterface['toPy']>;

export interface PythonRunResult {
  stdout: string;
  stderr: string;
  error: string | null;
  /** Отдельный namespace запуска (для прямого запуска без воркера). */
  namespace: PyProxy | null;
  /** Извлечённые переменные при запуске через Web Worker. */
  variables?: Record<string, string>;
}

export async function runPython(
  py: PyodideInterface,
  code: string,
): Promise<PythonRunResult> {
  let stdout = '';
  let stderr = '';
  py.setStdout({ batched: (s) => { stdout += s + '\n'; } });
  py.setStderr({ batched: (s) => { stderr += s + '\n'; } });

  const ns = py.toPy({});
  ns.set('__builtins__', py.globals.get('__builtins__'));
  ns.set('__name__', '__main__');

  try {
    await py.runPythonAsync(code, { globals: ns });
    return {
      stdout: stdout.trimEnd(),
      stderr: stderr.trimEnd(),
      error: null,
      namespace: ns,
    };
  } catch (e) {
    return {
      stdout: stdout.trimEnd(),
      stderr: stderr.trimEnd(),
      error: e instanceof Error ? e.message : String(e),
      namespace: ns,
    };
  }
}

function normalizeStdout(value: string, mode: 'trim' | 'lines' = 'trim'): string {
  const trimmed = value.trimEnd();
  if (mode === 'lines') {
    return trimmed.split('\n').map((l) => l.trimEnd()).join('\n');
  }
  return trimmed;
}

export function checkForbidden(code: string, forbidden: string[] = []): string | null {
  for (const pattern of forbidden) {
    try {
      if (new RegExp(pattern, 'i').test(code)) {
        return `Код содержит запрещённую конструкцию (${pattern}).`;
      }
    } catch {
      // некорректный regex в forbidden — игнорируем
    }
  }
  return null;
}

export function checkPythonResult(
  result: PythonRunResult,
  expected: PythonBlock['expected'],
): boolean {
  if (result.error) return false;

  if (expected.type === 'stdout') {
    return (
      normalizeStdout(result.stdout, expected.normalize) ===
      normalizeStdout(expected.value, expected.normalize)
    );
  }

  // 1. Если запуск был в Web Worker — проверяем сериализованный словарь variables
  if (result.variables && expected.name in result.variables) {
    return result.variables[expected.name] === String(expected.value);
  }

  // 2. Fallback для прямого запуска с PyProxy namespace
  if (!result.namespace) return false;
  try {
    const actual = result.namespace.get(expected.name);
    return String(actual) === String(expected.value);
  } catch {
    return false;
  }
}

function getWorker(): Worker {
  if (!worker) {
    worker = new Worker(new URL('./pyodide.worker.ts', import.meta.url), {
      type: 'module',
    });
  }
  return worker;
}

export function terminatePythonWorker(): void {
  if (worker) {
    worker.terminate();
    worker = null;
    workerInitPromise = null;
  }
}

export function initPythonWorker(): Promise<void> {
  if (!workerInitPromise) {
    workerInitPromise = new Promise<void>((resolve, reject) => {
      const w = getWorker();
      const id = `init-${Math.random().toString(36).slice(2)}`;

      const handler = (e: MessageEvent) => {
        if (e.data.id !== id) return;
        w.removeEventListener('message', handler);
        if (e.data.ok) resolve();
        else {
          workerInitPromise = null;
          reject(new Error(e.data.error || 'Ошибка инициализации Pyodide Worker'));
        }
      };

      w.addEventListener('message', handler);
      w.postMessage({ id, type: 'init' });
    });
  }
  return workerInitPromise;
}

export function runPythonInWorker(
  code: string,
  expected?: PythonBlock['expected'],
  timeoutMs = 5000,
): Promise<PythonRunResult> {
  return new Promise((resolve) => {
    const w = getWorker();
    const id = `run-${Math.random().toString(36).slice(2)}`;
    const varName = expected?.type === 'variable' ? expected.name : undefined;

    const timer = setTimeout(() => {
      terminatePythonWorker();
      resolve({
        stdout: '',
        stderr: '',
        error: `TimeoutError: Выполнение превысило лимит ${timeoutMs / 1000} сек. Проверьте код на бесконечные циклы.`,
        namespace: null,
      });
    }, timeoutMs);

    const handler = (e: MessageEvent) => {
      if (e.data.id !== id) return;
      clearTimeout(timer);
      w.removeEventListener('message', handler);
      resolve({
        ...e.data.result,
        namespace: null,
      });
    };

    w.addEventListener('message', handler);
    w.postMessage({ id, type: 'run', code, varName });
  });
}