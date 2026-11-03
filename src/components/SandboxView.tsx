import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Eye, Loader2, Play } from 'lucide-react';
import type { Database } from 'sql.js';
import type { SandboxBlock } from '@/data/types';
import type { QuizResult } from '@/lib/progress';
import {
  getSql,
  pickResult,
  resultsMatch,
  runQuery,
  type RunResult,
} from '@/lib/sql-sandbox';
import { Button } from '@/components/ui/button';

const DANGEROUS =
  /\b(DROP|DELETE|UPDATE|INSERT|ALTER|ATTACH|DETACH|PRAGMA|VACUUM|REINDEX|CREATE)\b/i;

interface Props {
  sandbox: SandboxBlock;
  onResult?: (result: QuizResult) => void;
}

export function SandboxView({ sandbox, onResult }: Props) {
  const dbRef = useRef<Database | null>(null);
  const [loading, setLoading] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);

  const [sql, setSql] = useState('');
  const [result, setResult] = useState<RunResult | null>(null);
  const [runError, setRunError] = useState<string | null>(null);
  const [check, setCheck] = useState<'ok' | 'fail' | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const SQL = await getSql();
        if (cancelled) return;
        const db = new SQL.Database();
        db.run(sandbox.schema);
        dbRef.current = db;
        setLoading(false);
      } catch (e) {
        if (cancelled) return;
        setInitError(e instanceof Error ? e.message : 'Не удалось загрузить SQL-движок');
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
      if (dbRef.current) {
        dbRef.current.close();
        dbRef.current = null;
      }
    };
  }, [sandbox.schema]);

  function assertSafe(text: string) {
    if (DANGEROUS.test(text)) {
      throw new Error('В песочнице разрешены только SELECT-запросы (без DDL/DML).');
    }
    for (const pattern of sandbox.forbidden ?? []) {
      if (new RegExp(pattern, 'i').test(text)) {
        throw new Error('Запрос содержит запрещённую конструкцию.');
      }
    }
  }

  function handleRun() {
    setRunError(null);
    setCheck(null);
    if (!dbRef.current) return;
    try {
      assertSafe(sql);
      const results = runQuery(dbRef.current, sql);
      setResult(pickResult(results));
    } catch (e) {
      setResult(null);
      setRunError(e instanceof Error ? e.message : String(e));
    }
  }

  async function handleCheck() {
    if (!dbRef.current) return;
    setRunError(null);
    try {
      assertSafe(sql);
      const actual = pickResult(runQuery(dbRef.current, sql));
      if (!actual) {
        setCheck('fail');
        setRunError('Запрос не вернул результата. Нужен SELECT.');
        return;
      }

      let expected = sandbox.expected;
      if (!expected) {
        const SQL = await getSql();
        const solDb = new SQL.Database();
        solDb.run(sandbox.schema);
        const sol = pickResult(runQuery(solDb, sandbox.solution));
        solDb.close();
        if (!sol) {
          setCheck('fail');
          setRunError('Не удалось вычислить эталонный результат.');
          return;
        }
        expected = { columns: sol.columns, rows: sol.rows };
      }

      const ok = resultsMatch(actual, expected);
      setCheck(ok ? 'ok' : 'fail');
      if (ok) {
        onResult?.('ok');
      } else {
        setFailedAttempts((n) => n + 1);
        onResult?.('fail');
      }
    } catch (e) {
      setCheck('fail');
      setRunError(e instanceof Error ? e.message : String(e));
    }
  }

  if (loading) {
    return (
      <div className="my-6 flex items-center gap-3 rounded-xl border border-border bg-card p-5">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <span className="text-sm text-muted-foreground">Загружаем SQL-движок…</span>
      </div>
    );
  }

  if (initError) {
    return (
      <div className="my-6 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
        <p className="font-semibold text-destructive">Не удалось загрузить SQL-песочницу</p>
        <p className="mt-1 text-sm text-muted-foreground">{initError}</p>
      </div>
    );
  }

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-border bg-card">
      <div className="border-b border-border p-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">
          SQL-песочница
        </p>
        <p className="text-sm leading-relaxed">{sandbox.task}</p>
        {sandbox.caption && (
          <p className="mt-2 text-xs text-muted-foreground">{sandbox.caption}</p>
        )}
      </div>

      <div className="space-y-3 p-5">
          <textarea
            value={sql}
            onChange={(e) => setSql(e.target.value)}
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && sql.trim()) {
                e.preventDefault();
                handleCheck();
              }
            }}
            spellCheck={false}
            placeholder="SELECT ..."
            rows={5}
            className="w-full resize-y rounded-lg border border-input bg-background p-3 font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />

        <div className="flex flex-wrap gap-2">
          <Button onClick={handleRun} variant="outline" disabled={!sql.trim()}>
            <Play className="h-4 w-4" /> Выполнить
          </Button>
          <Button onClick={handleCheck} disabled={!sql.trim()}>
            <CheckCircle2 className="h-4 w-4" /> Проверить
          </Button>
          {failedAttempts >= 2 && !showSolution && (
            <Button variant="ghost" onClick={() => setShowSolution(true)}>
              <Eye className="h-4 w-4" /> Показать решение
            </Button>
          )}
        </div>

        {runError && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            {runError}
          </div>
        )}

        {check === 'ok' && (
          <div className="rounded-lg border border-primary/40 bg-primary/5 p-3 text-sm">
            <span className="font-semibold text-primary">Верно.</span> Результат совпал с ожидаемым.
          </div>
        )}
        {check === 'fail' && !runError && (
          <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm">
            <span className="font-semibold">Пока не совпадает.</span> Сверьте колонки и строки.
          </div>
        )}

        {showSolution && (
          <div className="rounded-lg border border-border bg-background p-3">
            <p className="mb-2 text-xs font-semibold text-muted-foreground">Эталонный запрос</p>
            <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-sm">
              {sandbox.solution}
            </pre>
            {sandbox.hint && (
              <p className="mt-2 text-xs text-muted-foreground">Подсказка: {sandbox.hint}</p>
            )}
          </div>
        )}

        {result && (
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  {result.columns.map((c) => (
                    <th key={c} className="px-3 py-2 text-left font-semibold">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={result.columns.length || 1}
                      className="px-3 py-2 text-muted-foreground"
                    >
                      (пусто)
                    </td>
                  </tr>
                ) : (
                  result.rows.map((row, i) => (
                    <tr key={i} className="border-t border-border">
                      {row.map((v, j) => (
                        <td key={j} className="px-3 py-1.5 font-mono">
                          {v === null ? (
                            <span className="text-muted-foreground">NULL</span>
                          ) : (
                            String(v)
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}