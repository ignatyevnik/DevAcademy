import type { PyodideInterface } from 'pyodide';
import type { PythonBlock } from '@/data/types';

let pyodidePromise: Promise<PyodideInterface> | null = null;

export async function getPyodide(): Promise<PyodideInterface> {
  if (!pyodidePromise) {
    pyodidePromise = (async () => {
      const { loadPyodide } = await import('pyodide');
      return loadPyodide({
        indexURL: `${import.meta.env.BASE_URL}assets/pyodide/`,
      });
    })().catch((e) => {
      // Сбросить, чтобы следующая попытка могла загрузить заново
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
  /** Отдельный namespace запуска. Уничтожать после использования: result.namespace?.destroy() */
  namespace: PyProxy | null;
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
      // некорректный regex в forbidden — игнорируем, это баг автора шага
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

  // variable
  if (!result.namespace) return false;
  try {
    const actual = result.namespace.get(expected.name);
    return String(actual) === String(expected.value);
  } catch {
    return false;
  }
}