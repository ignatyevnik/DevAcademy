/// <reference lib="webworker" />
import type { PyodideInterface } from 'pyodide';

let pyodidePromise: Promise<PyodideInterface> | null = null;

function getWorkerPyodide(): Promise<PyodideInterface> {
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

self.onmessage = async (event: MessageEvent) => {
  const { id, type, code, varName } = event.data;

  if (type === 'init') {
    try {
      await getWorkerPyodide();
      self.postMessage({ id, ok: true });
    } catch (e) {
      self.postMessage({
        id,
        ok: false,
        error: e instanceof Error ? e.message : 'Не удалось загрузить Python',
      });
    }
    return;
  }

  if (type === 'run') {
    let stdout = '';
    let stderr = '';

    try {
      const py = await getWorkerPyodide();
      py.setStdout({ batched: (s) => { stdout += s + '\n'; } });
      py.setStderr({ batched: (s) => { stderr += s + '\n'; } });

      const ns = py.toPy({});
      ns.set('__builtins__', py.globals.get('__builtins__'));
      ns.set('__name__', '__main__');

      try {
        await py.runPythonAsync(code, { globals: ns });

        const variables: Record<string, string> = {};
        if (varName && ns.has(varName)) {
          const val = ns.get(varName);
          variables[varName] = String(val);
          if (val && typeof val.destroy === 'function') {
            val.destroy();
          }
        }

        self.postMessage({
          id,
          result: {
            stdout: stdout.trimEnd(),
            stderr: stderr.trimEnd(),
            error: null,
            variables,
          },
        });
      } finally {
        ns.destroy();
      }
    } catch (e) {
      self.postMessage({
        id,
        result: {
          stdout: stdout.trimEnd(),
          stderr: stderr.trimEnd(),
          error: e instanceof Error ? e.message : String(e),
          variables: {},
        },
      });
    }
  }
};