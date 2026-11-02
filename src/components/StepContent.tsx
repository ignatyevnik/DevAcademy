import { useEffect, useState, useMemo, useRef } from 'react';
import {
  Check, Info, CircleHelp, Lightbulb, ArrowUp, ArrowDown, Code2,
} from 'lucide-react';
import type {
  Step, TextBlock, Quiz, MultipleQuiz, FillQuiz, MatchingQuiz,
  SortingQuiz, TableQuiz, NumberQuiz, ClozeQuiz, CodeQuiz
} from '@/data';
import { useProgress } from '@/lib/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useTheme } from '@/lib/theme';

type ResultType = 'ok' | 'partial' | 'fail';

/** Оборачивает текст между `backticks` в <code> */
function InlineText({ text }: { text: string }) {
  if (!text) return null;
  const parts = text.split(/(`[^`]+`)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code
              key={i}
              className="rounded bg-muted/80 px-1.5 py-0.5 font-mono text-[0.9em] text-primary"
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        return part;
      })}
    </>
  );
}

// Компонент Mermaid
function MermaidDiagram({ code, caption }: { code: string; caption?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { theme } = useTheme(); // Получаем текущую тему

  useEffect(() => {
    let isMounted = true;
    const render = async () => {
      const mermaid = (await import('mermaid')).default;
      
      // Инициализируем с нужной темой
      mermaid.initialize({ 
        startOnLoad: false, 
        theme: theme === 'dark' ? 'dark' : 'default',
        themeVariables: {
          fontFamily: 'inherit', // Чтобы шрифт был как в приложении
        }
      });
      
      if (ref.current && isMounted) {
        try {
          const { svg } = await mermaid.render(`mermaid-${Math.random().toString(36).substr(2, 9)}`, code);
          ref.current.innerHTML = svg;
        } catch (e: any) {
          ref.current.innerHTML = `<div class="text-destructive text-sm p-4 border border-destructive/30 rounded bg-destructive/10">Ошибка в синтаксисе Mermaid: ${e.message || e}</div>`;
        }
      }
    };
    render();
    return () => { isMounted = false; };
  }, [code, theme]); // <-- Добавили theme в зависимости, чтобы перерисовывать при смене

  return (
    <figure className="my-6">
      <div ref={ref} className="flex justify-center overflow-x-auto p-4 bg-muted/10 rounded-lg border border-border" />
      {caption && <figcaption className="mt-2 text-center text-xs text-muted-foreground">{caption}</figcaption>}
    </figure>
  );
}

export function TextBlocks({ blocks }: { blocks: TextBlock[] }) {
  return (
    <div className="space-y-4 text-[15px] leading-[1.75] sm:text-base">
      {blocks.map((b, i) => {
        switch (b.type) {
          case 'p':
            return <p key={i} className="max-w-[70ch]"><InlineText text={b.text} /></p>;
          case 'h3':
            return <h3 key={i} className="pt-2 text-lg font-bold tracking-tight"><InlineText text={b.text} /></h3>;
          case 'list':
            return (
              <ul key={i} className="max-w-[70ch] space-y-2">
                {b.items.map((it, j) => (
                  <li key={j} className="flex gap-3">
                    <span className="mt-[0.65em] h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                    <span><InlineText text={it} /></span>
                  </li>
                ))}
              </ul>
            );
          case 'code':
            return (
              <figure key={i} className="code-block">
                {b.caption && <figcaption className="code-caption"><InlineText text={b.caption} /></figcaption>}
                <pre><code>{b.code}</code></pre>
              </figure>
            );
          case 'note':
            return (
              <div key={i} className="flex gap-3 rounded-lg border border-primary/25 bg-accent/50 p-4">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                <p className="max-w-[65ch] text-sm leading-relaxed sm:text-[15px]"><InlineText text={b.text} /></p>
              </div>
            );
          case 'table':
            return (
              <figure key={i} className="overflow-x-auto rounded-lg border border-border">
                {b.caption && (
                  <figcaption className="border-b border-border bg-muted/40 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <InlineText text={b.caption} />
                  </figcaption>
                )}
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
                    <tr>
                      {b.head.map((h, j) => <th key={j} className="px-4 py-2 font-semibold"><InlineText text={h} /></th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((row, j) => (
                      <tr key={j} className="border-t border-border">
                        {row.map((cell, k) => <td key={k} className="px-4 py-2 align-top"><InlineText text={cell} /></td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </figure>
            );
                    case 'image':
            return (
              <figure key={i} className="my-6">
                <img src={b.src} alt={b.alt} loading="lazy" className="rounded-lg border border-border w-full max-w-2xl mx-auto object-cover" />
                {b.caption && <figcaption className="mt-2 text-center text-xs text-muted-foreground">{b.caption}</figcaption>}
              </figure>
            );
          case 'mermaid':
            return <MermaidDiagram key={i} code={b.code} caption={b.caption} />;
        }
      })}
    </div>
  );
}

interface QuizViewProps {
  slug: string;
  step: Step;
  onResult?: (result: ResultType) => void;
}

export function QuizView({ slug, step, onResult }: QuizViewProps) {
  if (step.type !== 'quiz') return null;
  const quiz = step.quiz;
  switch (quiz.kind) {
    case 'single':
    case 'multiple':
      return <ChoiceQuiz slug={slug} stepId={step.id} quiz={quiz} onResult={onResult} />;
    case 'fill':
      return <FillStep slug={slug} stepId={step.id} quiz={quiz} onResult={onResult} />;
    case 'matching':
      return <MatchingStep slug={slug} stepId={step.id} quiz={quiz} onResult={onResult} />;
    case 'sorting':
      return <SortingStep slug={slug} stepId={step.id} quiz={quiz} onResult={onResult} />;
    case 'table':
      return <TableStep slug={slug} stepId={step.id} quiz={quiz} onResult={onResult} />;
    case 'number':
      return <NumberStep slug={slug} stepId={step.id} quiz={quiz} onResult={onResult} />;
    case 'cloze':
      return <ClozeStep slug={slug} stepId={step.id} quiz={quiz} onResult={onResult} />;
    case 'code':
      return <CodeStep slug={slug} stepId={step.id} quiz={quiz} onResult={onResult} />;
  }
}

function useQuizState(slug: string, stepId: string, onResult?: (result: ResultType) => void) {
  const { quizResult, setQuizResult, completeStep, recordSrsAnswer } = useProgress();
  const prev = quizResult(slug, stepId);
  const finish = (result: ResultType) => {
    setQuizResult(slug, stepId, result);
    recordSrsAnswer(slug, stepId, result === 'ok');
    if (result === 'ok') {
      completeStep(slug, stepId);
      toast.success('Верно! Шаг засчитан');
    } else if (result === 'partial') {
      toast.message('Частично верно — попробуйте ещё раз для полного зачёта');
    }
    onResult?.(result);
  };
  return { prev, finish };
}

function ChoiceQuiz({
  slug,
  stepId,
  quiz,
  onResult,
}: {
  slug: string;
  stepId: string;
  quiz: Quiz & { kind: 'single' | 'multiple' };
  onResult?: (result: ResultType) => void;
}) {
  const { prev, finish } = useQuizState(slug, stepId, onResult);
  const [selected, setSelected] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [result, setResult] = useState<ResultType | null>(null);

  useEffect(() => {
    setSelected([]);
    setChecked(false);
    setResult(null);
  }, [stepId]);

  const multi = quiz.kind === 'multiple';
  const partialEnabled = multi && (quiz as MultipleQuiz).partial;

  const toggle = (id: string) => {
    if (checked && result === 'ok') return;
    setChecked(false);
    setSelected((s) => {
      if (multi) return s.includes(id) ? s.filter((x) => x !== id) : [...s, id];
      return [id];
    });
  };

  const check = () => {
    const correctSet = new Set(quiz.correct);
    const right = selected.filter((id) => correctSet.has(id)).length;
    const wrong = selected.filter((id) => !correctSet.has(id)).length;
    let r: ResultType = 'fail';
    if (right === quiz.correct.length && wrong === 0) r = 'ok';
    else if (partialEnabled && wrong === 0 && right > 0) r = 'partial';
    setResult(r);
    setChecked(true);
    finish(r);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= quiz.options.length) {
        const opt = quiz.options[num - 1];
        if (opt) toggle(opt.id);
      } else if (e.key === 'Enter' && selected.length > 0 && !(checked && result === 'ok')) {
        check();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selected, checked, result, quiz.options]);

  return (
    <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent">
          <CircleHelp className="h-5 w-5 text-primary" aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {multi ? 'Выберите все подходящие варианты' : 'Выберите один вариант'}
          </p>
          <h3 className="mt-1 text-base font-bold leading-snug sm:text-lg"><InlineText text={quiz.question} /></h3>
        </div>
      </div>

      <div className="mt-5 space-y-2.5" role={multi ? 'group' : 'radiogroup'} aria-label={quiz.question}>
        {quiz.options.map((opt) => {
          const active = selected.includes(opt.id);
          const right = quiz.correct.includes(opt.id);
          const showState = checked;
          return (
            <button
              key={opt.id}
              type="button"
              role={multi ? 'checkbox' : 'radio'}
              aria-checked={active}
              onClick={() => toggle(opt.id)}
              className={cn(
                'flex w-full min-h-[48px] items-center gap-3 rounded-lg border px-4 py-3 text-left text-[15px] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                showState && active && right && 'border-primary bg-accent/60',
                showState && active && !right && 'border-destructive bg-destructive/10',
                showState && !active && right && 'border-primary/50 border-dashed',
                (!showState || (!active && !right)) &&
                  (active ? 'border-primary bg-accent/40' : 'border-border bg-card hover:border-primary/40 hover:bg-accent/20')
              )}
            >
              <span
                className={cn(
                  'grid h-5 w-5 shrink-0 place-items-center border transition-colors',
                  multi ? 'rounded-md' : 'rounded-full',
                  active ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/40',
                  showState && active && !right && 'border-destructive bg-destructive'
                )}
                aria-hidden="true"
              >
                {active && <Check className="h-3.5 w-3.5" />}
              </span>
              <span><InlineText text={opt.text} /></span>
            </button>
          );
        })}
      </div>

      {checked && result && (
        <div
          className={cn(
            'mt-4 rounded-lg border p-4 text-sm leading-relaxed',
            result === 'ok' ? 'border-primary/30 bg-accent/50' :
            result === 'partial' ? 'border-amber-500/30 bg-amber-500/10' :
            'border-destructive/30 bg-destructive/5'
          )}
          role="status"
          aria-live="polite"
        >
          <p className={cn(
            'font-bold',
            result === 'ok' ? 'text-primary' :
            result === 'partial' ? 'text-amber-700 dark:text-amber-400' :
            'text-destructive'
          )}>
            {result === 'ok' ? 'Верно!' : result === 'partial' ? 'Частично верно.' : 'Пока неверно.'}
          </p>
          <p className="mt-1.5"><InlineText text={quiz.explanation} /></p>
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button onClick={check} disabled={selected.length === 0 || (checked && result === 'ok')} className="min-h-[44px] px-6">
          Проверить
        </Button>
        {prev && prev !== 'fail' && !checked && (
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
            <Check className="h-4 w-4" aria-hidden="true" />
            {prev === 'ok' ? 'Решено ранее' : 'Был частичный зачёт'}
          </span>
        )}
      </div>
    </div>
  );
}

function FillStep({ slug, stepId, quiz, onResult }: { slug: string; stepId: string; quiz: FillQuiz; onResult?: (result: ResultType) => void }) {
  const { prev, finish } = useQuizState(slug, stepId, onResult);
  const [value, setValue] = useState('');
  const [checked, setChecked] = useState(false);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    setValue('');
    setChecked(false);
    setOk(false);
  }, [stepId]);

  const check = () => {
    const norm = value.trim().toLowerCase();
    const isOk = quiz.accepted.some((a) => a.trim().toLowerCase() === norm);
    setOk(isOk);
    setChecked(true);
    finish(isOk ? 'ok' : 'fail');
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent">
          <CircleHelp className="h-5 w-5 text-primary" aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Введите ответ</p>
          <h3 className="mt-1 text-base font-bold leading-snug sm:text-lg"><InlineText text={quiz.question} /></h3>
          {quiz.hint && (
            <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Lightbulb className="h-3.5 w-3.5" aria-hidden="true" /><InlineText text={quiz.hint} />
            </p>
          )}
        </div>
      </div>

      <form className="mt-5 flex flex-col gap-2 sm:flex-row" onSubmit={(e) => { e.preventDefault(); check(); }}>
        <Input
          value={value}
          onChange={(e) => { setValue(e.target.value); setChecked(false); }}
          placeholder={quiz.placeholder ?? 'Ваш ответ…'}
          aria-label="Ответ"
          className="h-11 min-h-[44px] font-mono"
        />
        <Button type="submit" disabled={!value.trim() || (checked && ok)} className="min-h-[44px] px-6">
          Проверить
        </Button>
      </form>

      {checked && (
        <div className={cn('mt-4 rounded-lg border p-4 text-sm leading-relaxed', ok ? 'border-primary/30 bg-accent/50' : 'border-destructive/30 bg-destructive/5')} role="status" aria-live="polite">
          <p className={cn('font-bold', ok ? 'text-primary' : 'text-destructive')}>{ok ? 'Верно!' : 'Пока неверно.'}</p>
          <p className="mt-1.5"><InlineText text={quiz.explanation} /></p>
        </div>
      )}

      {prev === 'ok' && !checked && (
        <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
          <Check className="h-4 w-4" aria-hidden="true" />Решено ранее
        </p>
      )}
    </div>
  );
}

function MatchingStep({ slug, stepId, quiz, onResult }: { slug: string; stepId: string; quiz: MatchingQuiz; onResult?: (result: ResultType) => void }) {
  const { prev, finish } = useQuizState(slug, stepId, onResult);
  const rights = useMemo(() => {
    const arr = quiz.pairs.map((p) => p.right);
    if (quiz.shuffle === false) return arr;
    return [...arr].sort((a, b) => a.localeCompare(b, 'ru'));
  }, [quiz]);

  const [assign, setAssign] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState<{ right: number; total: number } | null>(null);

  useEffect(() => { setAssign({}); setChecked(false); setScore(null); }, [stepId]);

  const allAssigned = quiz.pairs.every((_, i) => assign[i]);

  const check = () => {
    let right = 0;
    quiz.pairs.forEach((p, i) => { if (assign[i] === p.right) right++; });
    setScore({ right, total: quiz.pairs.length });
    setChecked(true);
    const r = right === quiz.pairs.length ? 'ok' : right >= Math.ceil(quiz.pairs.length * 0.6) ? 'partial' : 'fail';
    finish(r);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && allAssigned && !(checked && score?.right === score?.total)) {
        e.preventDefault();
        check();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [allAssigned, checked, score]);

  return (
    <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent">
          <CircleHelp className="h-5 w-5 text-primary" aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Сопоставьте пары</p>
          <h3 className="mt-1 text-base font-bold leading-snug sm:text-lg"><InlineText text={quiz.question} /></h3>
        </div>
      </div>

      <div className="mt-5 space-y-2.5">
        {quiz.pairs.map((pair, i) => {
          const value = assign[i] ?? '';
          const isRight = checked && value === pair.right;
          const isWrong = checked && value !== pair.right;
          return (
            <div key={i} className={cn('grid grid-cols-1 gap-2 rounded-lg border p-3 sm:grid-cols-2', isRight && 'border-primary/40 bg-accent/40', isWrong && 'border-destructive/40 bg-destructive/5')}>
              <span className="flex items-center text-sm font-medium"><InlineText text={pair.left} /></span>
              <select
                value={value}
                onChange={(e) => { setChecked(false); setAssign((a) => ({ ...a, [i]: e.target.value })); }}
                aria-label={`Соответствие для «${pair.left.replace(/`/g, '')}»`}
                className="h-11 min-h-[44px] w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">— выберите —</option>
                {rights.map((r) => <option key={r} value={r}>{r.replace(/`/g, '')}</option>)}
              </select>
            </div>
          );
        })}
      </div>

      {checked && score && (
        <div className={cn('mt-4 rounded-lg border p-4 text-sm leading-relaxed', score.right === score.total ? 'border-primary/30 bg-accent/50' : score.right > 0 ? 'border-amber-500/30 bg-amber-500/10' : 'border-destructive/30 bg-destructive/5')} role="status" aria-live="polite">
          <p className={cn('font-bold', score.right === score.total ? 'text-primary' : score.right > 0 ? 'text-amber-700 dark:text-amber-400' : 'text-destructive')}>
            Верно {score.right} из {score.total}.
          </p>
          <p className="mt-1.5"><InlineText text={quiz.explanation} /></p>
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button onClick={check} disabled={!allAssigned || (checked && score?.right === score?.total)} className="min-h-[44px] px-6">Проверить</Button>
        {prev && prev !== 'fail' && !checked && (
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
            <Check className="h-4 w-4" aria-hidden="true" />{prev === 'ok' ? 'Решено ранее' : 'Был частичный зачёт'}
          </span>
        )}
      </div>
    </div>
  );
}

function SortingStep({ slug, stepId, quiz, onResult }: { slug: string; stepId: string; quiz: SortingQuiz; onResult?: (result: ResultType) => void }) {
  const { prev, finish } = useQuizState(slug, stepId, onResult);
  const [items, setItems] = useState(() => [...quiz.items]);
  const [checked, setChecked] = useState(false);
  const [ok, setOk] = useState(false);

  const move = (index: number, dir: -1 | 1) => {
    if (index + dir < 0 || index + dir >= items.length) return;
    const next = [...items];
    [next[index], next[index + dir]] = [next[index + dir], next[index]];
    setItems(next);
    setChecked(false);
    setOk(false);
  };

  const check = () => {
    const isOk = items.every((item, i) => item === quiz.correct[i]);
    setOk(isOk);
    setChecked(true);
    finish(isOk ? 'ok' : 'fail');
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <div className="flex items-start gap-3 mb-5">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent">
          <ArrowUp className="h-5 w-5 text-primary" aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Сортировка</p>
          <h3 className="mt-1 text-base font-bold leading-snug sm:text-lg"><InlineText text={quiz.question} /></h3>
        </div>
      </div>

      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={item} className="flex items-center gap-3 rounded-lg border border-border bg-background p-3">
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-accent text-xs font-bold text-primary">{i + 1}</span>
            <span className="flex-1 font-mono text-sm"><InlineText text={item} /></span>
            <div className="flex flex-col gap-1">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="text-muted-foreground hover:text-foreground disabled:opacity-30" aria-label="Выше"><ArrowUp className="h-4 w-4" /></button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} className="text-muted-foreground hover:text-foreground disabled:opacity-30" aria-label="Ниже"><ArrowDown className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>

      {checked && (
        <div className={cn('mt-4 rounded-lg border p-4 text-sm leading-relaxed', ok ? 'border-primary/30 bg-accent/50' : 'border-destructive/30 bg-destructive/5')} role="status">
          <p className={cn('font-bold', ok ? 'text-primary' : 'text-destructive')}>{ok ? 'Верно!' : 'Пока неверно.'}</p>
          <p className="mt-1.5"><InlineText text={quiz.explanation} /></p>
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button onClick={check} disabled={checked && ok} className="min-h-[44px] px-6">Проверить</Button>
        {prev === 'ok' && !checked && <span className="text-sm font-medium text-primary flex items-center gap-1.5"><Check className="h-4 w-4" />Решено ранее</span>}
      </div>
    </div>
  );
}

function TableStep({ slug, stepId, quiz, onResult }: { slug: string; stepId: string; quiz: TableQuiz; onResult?: (result: ResultType) => void }) {
  const { prev, finish } = useQuizState(slug, stepId, onResult);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [checked, setChecked] = useState(false);
  const [ok, setOk] = useState(false);

  const toggle = (rIdx: number, col: string) => {
    if (checked && ok) return;
    const key = `${rIdx}-${col}`;
    const next = new Set(selected);
    if (next.has(key)) next.delete(key); else next.add(key);
    setSelected(next);
    setChecked(false);
    setOk(false);
  };

  const check = () => {
    let isOk = true;
    quiz.rows.forEach((row, rIdx) => {
      quiz.columns.forEach(col => {
        const key = `${rIdx}-${col}`;
        if (selected.has(key) !== row.correct.includes(col)) isOk = false;
      });
    });
    setOk(isOk);
    setChecked(true);
    finish(isOk ? 'ok' : 'fail');
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <div className="flex items-start gap-3 mb-5">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent">
          <CircleHelp className="h-5 w-5 text-primary" aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Таблица</p>
          <h3 className="mt-1 text-base font-bold leading-snug sm:text-lg"><InlineText text={quiz.question} /></h3>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="p-3 font-semibold text-muted-foreground">Свойство</th>
              {quiz.columns.map(c => <th key={c} className="p-3 text-center font-semibold text-muted-foreground"><InlineText text={c} /></th>)}
            </tr>
          </thead>
          <tbody>
            {quiz.rows.map((row, rIdx) => (
              <tr key={row.label} className="border-b border-border last:border-0">
                <td className="p-3"><InlineText text={row.label} /></td>
                {quiz.columns.map(col => (
                  <td key={col} className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={selected.has(`${rIdx}-${col}`)}
                      onChange={() => toggle(rIdx, col)}
                      className="h-5 w-5 rounded border-input text-primary focus:ring-primary cursor-pointer"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {checked && (
        <div className={cn('mt-4 rounded-lg border p-4 text-sm leading-relaxed', ok ? 'border-primary/30 bg-accent/50' : 'border-destructive/30 bg-destructive/5')} role="status">
          <p className={cn('font-bold', ok ? 'text-primary' : 'text-destructive')}>{ok ? 'Верно!' : 'Пока неверно.'}</p>
          <p className="mt-1.5"><InlineText text={quiz.explanation} /></p>
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button onClick={check} disabled={checked && ok} className="min-h-[44px] px-6">Проверить</Button>
        {prev === 'ok' && !checked && <span className="text-sm font-medium text-primary flex items-center gap-1.5"><Check className="h-4 w-4" />Решено ранее</span>}
      </div>
    </div>
  );
}

function NumberStep({ slug, stepId, quiz, onResult }: { slug: string; stepId: string; quiz: NumberQuiz; onResult?: (result: ResultType) => void }) {
  const { prev, finish } = useQuizState(slug, stepId, onResult);
  const [val, setVal] = useState('');
  const [checked, setChecked] = useState(false);
  const [ok, setOk] = useState(false);

  const check = () => {
    const num = parseFloat(val.replace(',', '.'));
    if (isNaN(num)) return;
    const tol = quiz.tolerance ?? 0;
    const isOk = Math.abs(num - quiz.correct) <= tol;
    setOk(isOk);
    setChecked(true);
    finish(isOk ? 'ok' : 'fail');
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <div className="flex items-start gap-3 mb-5">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent">
          <CircleHelp className="h-5 w-5 text-primary" aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Числовой ответ</p>
          <h3 className="mt-1 text-base font-bold leading-snug sm:text-lg"><InlineText text={quiz.question} /></h3>
        </div>
      </div>

      <form onSubmit={e => { e.preventDefault(); check(); }} className="mt-5 flex gap-2 max-w-sm">
        <input
          type="text"
          inputMode="decimal"
          value={val}
          onChange={e => { setVal(e.target.value); setChecked(false); setOk(false); }}
          placeholder={quiz.placeholder ?? 'Введите число…'}
          className="h-11 min-h-[44px] w-full rounded-md border border-input bg-transparent px-3 py-1 font-mono text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <Button type="submit" disabled={!val.trim() || (checked && ok)} className="min-h-[44px] px-6">Проверить</Button>
      </form>

      {checked && (
        <div className={cn('mt-4 rounded-lg border p-4 text-sm leading-relaxed max-w-md', ok ? 'border-primary/30 bg-accent/50' : 'border-destructive/30 bg-destructive/5')} role="status">
          <p className={cn('font-bold', ok ? 'text-primary' : 'text-destructive')}>{ok ? 'Верно!' : `Неверно. Правильный ответ: ${quiz.correct}`}</p>
          <p className="mt-1.5"><InlineText text={quiz.explanation} /></p>
        </div>
      )}

      {prev === 'ok' && !checked && <p className="mt-3 text-sm font-medium text-primary flex items-center gap-1.5"><Check className="h-4 w-4" />Решено ранее</p>}
    </div>
  );
}

function ClozeStep({ slug, stepId, quiz, onResult }: { slug: string; stepId: string; quiz: ClozeQuiz; onResult?: (result: ResultType) => void }) {
  const { prev, finish } = useQuizState(slug, stepId, onResult);
  const [vals, setVals] = useState<string[]>(() => Array(quiz.blanks.length).fill(''));
  const [checked, setChecked] = useState(false);
  const [ok, setOk] = useState(false);
  const parts = quiz.text.split('____');

  const check = () => {
    const isOk = quiz.blanks.every((b, i) => 
      b.accepted.some(a => a.trim().toLowerCase() === vals[i].trim().toLowerCase())
    );
    setOk(isOk);
    setChecked(true);
    finish(isOk ? 'ok' : 'fail');
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <div className="flex items-start gap-3 mb-5">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent">
          <CircleHelp className="h-5 w-5 text-primary" aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Заполните пропуски</p>
          <h3 className="mt-1 text-base font-bold leading-snug sm:text-lg"><InlineText text={quiz.question} /></h3>
        </div>
      </div>

      <div className="text-[15px] leading-loose bg-muted/30 p-4 rounded-lg">
        {parts.map((part, i) => (
          <span key={i}>
            <InlineText text={part} />
            {i < quiz.blanks.length && (
              <input
                type="text"
                value={vals[i]}
                onChange={e => { const n = [...vals]; n[i] = e.target.value; setVals(n); setChecked(false); setOk(false); }}
                placeholder={quiz.blanks[i].hint || '...'}
                className="mx-1 inline-block w-24 rounded border-b-2 border-primary bg-transparent px-1 text-center font-mono text-sm outline-none focus:bg-background"
                aria-label={`Пропуск ${i + 1}`}
              />
            )}
          </span>
        ))}
      </div>

      {checked && (
        <div className={cn('mt-4 rounded-lg border p-4 text-sm leading-relaxed', ok ? 'border-primary/30 bg-accent/50' : 'border-destructive/30 bg-destructive/5')} role="status">
          <p className={cn('font-bold', ok ? 'text-primary' : 'text-destructive')}>{ok ? 'Верно!' : 'Пока неверно.'}</p>
          <p className="mt-1.5"><InlineText text={quiz.explanation} /></p>
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button onClick={check} disabled={checked && ok} className="min-h-[44px] px-6">Проверить</Button>
        {prev === 'ok' && !checked && <span className="text-sm font-medium text-primary flex items-center gap-1.5"><Check className="h-4 w-4" />Решено ранее</span>}
      </div>
    </div>
  );
}

function CodeStep({ slug, stepId, quiz, onResult }: { slug: string; stepId: string; quiz: CodeQuiz; onResult?: (result: ResultType) => void }) {
  const { prev, finish } = useQuizState(slug, stepId, onResult);
  const [code, setCode] = useState(quiz.starterCode || '');
  const [checked, setChecked] = useState(false);
  const [ok, setOk] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const check = () => {
    let error = '';
    try {
      for (const rule of quiz.mustInclude) {
        if (!new RegExp(rule.pattern, 'm').test(code)) { error = rule.message; break; }
      }
      if (!error && quiz.mustNotInclude) {
        for (const rule of quiz.mustNotInclude) {
          if (new RegExp(rule.pattern, 'm').test(code)) { error = rule.message; break; }
        }
      }
    } catch {
      error = 'Ошибка в паттерне проверки (обратитесь к автору курса)';
    }
    setOk(!error);
    setErrorMsg(error);
    setChecked(true);
    finish(!error ? 'ok' : 'fail');
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <div className="flex items-start gap-3 mb-5">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent">
          <Code2 className="h-5 w-5 text-primary" aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Написание кода</p>
          <h3 className="mt-1 text-base font-bold leading-snug sm:text-lg"><InlineText text={quiz.question} /></h3>
        </div>
      </div>

      <textarea
        value={code}
        onChange={e => { setCode(e.target.value); setChecked(false); setOk(false); }}
        placeholder={quiz.placeholder ?? 'Напишите код…'}
        className="w-full min-h-[180px] rounded-lg border border-input bg-[#17211c] p-4 font-mono text-sm text-[#d9e7de] shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        spellCheck={false}
      />

      {checked && (
        <div className={cn('mt-4 rounded-lg border p-4 text-sm leading-relaxed', ok ? 'border-primary/30 bg-accent/50' : 'border-destructive/30 bg-destructive/5')} role="status">
          <p className={cn('font-bold', ok ? 'text-primary' : 'text-destructive')}>{ok ? 'Верно!' : errorMsg}</p>
          <p className="mt-1.5"><InlineText text={quiz.explanation} /></p>
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button onClick={check} disabled={!code.trim() || (checked && ok)} className="min-h-[44px] px-6">Проверить</Button>
        {prev === 'ok' && !checked && <span className="text-sm font-medium text-primary flex items-center gap-1.5"><Check className="h-4 w-4" />Решено ранее</span>}
      </div>
    </div>
  );
}