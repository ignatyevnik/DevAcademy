import { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Play, Square } from 'lucide-react';
import type { PythonBlock } from '@/data/types';
import type { QuizResult } from '@/lib/progress';
import {
  initPythonWorker,
  runPythonInWorker,
  terminatePythonWorker,
  checkPythonResult,
  checkForbidden,
  type PythonRunResult,
} from '@/lib/pyodide-sandbox';
import { Button } from '@/components/ui/button';
import { LazyCodeMirror } from '@/components/LazyCodeMirror';
import { useTheme } from '@/lib/theme';

interface Props {
  python: PythonBlock;
  onResult?: (result: QuizResult) => void;
}

export function PythonView({ python, onResult }: Props) {
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const [code, setCode] = useState(python.starterCode ?? '');
  const [result, setResult] = useState<PythonRunResult | null>(null);
  const [check, setCheck] = useState<'ok' | 'fail' | null>(null);
  const [failed, setFailed] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await initPythonWorker();
        if (cancelled) return;
        setLoading(false);
      } catch (e) {
        if (cancelled) return;
        setInitError(e instanceof Error ? e.message : 'Не удалось загрузить Python');
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  function handleStop() {
    terminatePythonWorker();
    setRunning(false);
    setResult({
      stdout: '',
      stderr: '',
      error: 'Выполнение принудительно остановлено пользователем.',
      namespace: null,
    });
  }

  async function handleRun() {
    if (!code.trim() || running) return;
    setCheck(null);
    setRunning(true);
    try {
      const r = await runPythonInWorker(code, python.expected);
      setResult(r);
    } finally {
      setRunning(false);
    }
  }

  async function handleCheck() {
    if (!code.trim() || running) return;

    const forbiddenError = checkForbidden(code, python.forbidden);
    if (forbiddenError) {
      setResult({ stdout: '', stderr: '', error: forbiddenError, namespace: null });
      setCheck('fail');
      setFailed((n) => n + 1);
      onResult?.('fail');
      return;
    }

    setRunning(true);
    try {
      const r = await runPythonInWorker(code, python.expected);
      setResult(r);
      const ok = checkPythonResult(r, python.expected);
      setCheck(ok ? 'ok' : 'fail');
      if (ok) onResult?.('ok');
      else {
        setFailed((n) => n + 1);
        onResult?.('fail');
      }
    } finally {
      setRunning(false);
    }
  }

  if (loading) {
    return (
      <div className="my-6 flex items-center gap-3 rounded-xl border border-border bg-card p-5">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <span className="text-sm text-muted-foreground">
          Загружаем Python в фоновом потоке (первый раз ~10–15 сек)…
        </span>
      </div>
    );
  }

  if (initError) {
    return (
      <div className="my-6 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
        <p className="font-semibold text-destructive">Не удалось загрузить Python</p>
        <p className="mt-1 text-sm text-muted-foreground">{initError}</p>
      </div>
    );
  }

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-border bg-card">
      <div className="border-b border-border p-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">
          Python-песочница
        </p>
        <p className="text-sm leading-relaxed">{python.task}</p>
        {python.caption && (
          <p className="mt-2 text-xs text-muted-foreground">{python.caption}</p>
        )}
      </div>

      <div className="space-y-3 p-5">
        <LazyCodeMirror
          value={code}
          onChange={setCode}
          language="python"
          theme={theme}
          minHeight="200px"
          onSubmit={handleCheck}
        />

        <div className="flex flex-wrap gap-2">
          <Button onClick={handleRun} variant="outline" disabled={!code.trim() || running}>
            {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            Выполнить
          </Button>
          <Button onClick={handleCheck} disabled={!code.trim() || running}>
            {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            Проверить
          </Button>
          {running && (
            <Button variant="destructive" onClick={handleStop}>
              <Square className="h-4 w-4" /> Остановить
            </Button>
          )}
          {failed >= 2 && !showSolution && (
            <Button variant="ghost" onClick={() => setShowSolution(true)}>
              Показать решение
            </Button>
          )}
        </div>

        {result?.error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            <pre className="whitespace-pre-wrap font-mono">{result.error}</pre>
          </div>
        )}

        {check === 'ok' && (
          <div className="rounded-lg border border-primary/40 bg-primary/5 p-3 text-sm">
            <span className="font-semibold text-primary">Верно.</span> Результат совпал с ожидаемым.
          </div>
        )}
        {check === 'fail' && !result?.error && (
          <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm">
            <span className="font-semibold">Пока не совпадает.</span> Сверьте вывод или значение переменной.
          </div>
        )}

        {result && !result.error && (
          <div className="rounded-lg border border-border bg-background p-3">
            <p className="mb-1 text-xs font-semibold text-muted-foreground">stdout</p>
            <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-sm">
              {result.stdout || '(пусто)'}
            </pre>
            {result.stderr && (
              <>
                <p className="mb-1 mt-3 text-xs font-semibold text-muted-foreground">stderr</p>
                <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-sm text-amber-600">
                  {result.stderr}
                </pre>
              </>
            )}
          </div>
        )}

        {showSolution && (
          <div className="rounded-lg border border-border bg-background p-3">
            <p className="mb-2 text-xs font-semibold text-muted-foreground">Эталонный код</p>
            <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-sm">
              {python.solution}
            </pre>
            {python.hint && (
              <p className="mt-2 text-xs text-muted-foreground">Подсказка: {python.hint}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}