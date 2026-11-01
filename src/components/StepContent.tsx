import { useEffect, useMemo, useState } from 'react';
import { Check, Info, CircleHelp, Lightbulb } from 'lucide-react';
import type { Step, TextBlock, Quiz, MultipleQuiz, FillQuiz, MatchingQuiz } from '@/data';
import { useProgress } from '@/lib/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { CodeBlock } from '@/components/CodeBlock';

export function TextBlocks({ blocks }: { blocks: TextBlock[] }) {
  return (
    <div className="space-y-4 text-[15px] leading-[1.75] sm:text-base">
      {blocks.map((b, i) => {
        switch (b.type) {
          case 'p':
            return <p key={i} className="max-w-[70ch]">{b.text}</p>;
          case 'h3':
            return <h3 key={i} className="pt-2 text-lg font-bold tracking-tight">{b.text}</h3>;
          case 'list':
            return (
              <ul key={i} className="max-w-[70ch] space-y-2">
                {b.items.map((it, j) => (
                  <li key={j} className="flex gap-3">
                    <span className="mt-[0.65em] h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            );
          case 'code':
            return (
              <CodeBlock
                key={i}
                code={b.code}
                lang={b.lang}
                caption={b.caption}
              />
            );
          case 'note':
            return (
              <div key={i} className="flex gap-3 rounded-lg border border-primary/25 bg-accent/50 p-4">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                <p className="max-w-[65ch] text-sm leading-relaxed sm:text-[15px]">{b.text}</p>
              </div>
            );
          case 'table':
            return (
              <figure key={i} className="overflow-x-auto rounded-lg border border-border">
                {b.caption && (
                  <figcaption className="border-b border-border bg-muted/40 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {b.caption}
                  </figcaption>
                )}
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
                    <tr>
                      {b.head.map((h, j) => <th key={j} className="px-4 py-2 font-semibold">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((row, j) => (
                      <tr key={j} className="border-t border-border">
                        {row.map((cell, k) => <td key={k} className="px-4 py-2 align-top">{cell}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </figure>
            );
        }
      })}
    </div>
  );
}

interface QuizViewProps {
  slug: string;
  step: Step;
}

export function QuizView({ slug, step }: QuizViewProps) {
  if (step.type !== 'quiz') return null;
  const quiz = step.quiz;
  switch (quiz.kind) {
    case 'single':
    case 'multiple':
      return <ChoiceQuiz slug={slug} stepId={step.id} quiz={quiz} />;
    case 'fill':
      return <FillStep slug={slug} stepId={step.id} quiz={quiz} />;
    case 'matching':
      return <MatchingStep slug={slug} stepId={step.id} quiz={quiz} />;
  }
}

function useQuizState(slug: string, stepId: string) {
  const { quizResult, setQuizResult, completeStep } = useProgress();
  const prev = quizResult(slug, stepId);
  const finish = (result: 'ok' | 'partial' | 'fail') => {
    setQuizResult(slug, stepId, result);
    if (result === 'ok') {
      completeStep(slug, stepId);
      toast.success('Верно! Шаг засчитан');
    } else if (result === 'partial') {
      toast.message('Частично верно — попробуйте ещё раз для полного зачёта');
    }
  };
  return { prev, finish };
}

function ChoiceQuiz({
  slug,
  stepId,
  quiz,
}: {
  slug: string;
  stepId: string;
  quiz: Quiz & { kind: 'single' | 'multiple' };
}) {
  const { prev, finish } = useQuizState(slug, stepId);
  const [selected, setSelected] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [result, setResult] = useState<'ok' | 'partial' | 'fail' | null>(null);

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
    let r: 'ok' | 'partial' | 'fail' = 'fail';
    if (right === quiz.correct.length && wrong === 0) r = 'ok';
    else if (partialEnabled && wrong === 0 && right > 0) r = 'partial';
    setResult(r);
    setChecked(true);
    finish(r);
  };

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
          <h3 className="mt-1 text-base font-bold leading-snug sm:text-lg">{quiz.question}</h3>
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
              <span>{opt.text}</span>
            </button>
          );
        })}
      </div>

      {checked && result && (
        <div
          className={cn(
            'mt-4 rounded-lg border p-4 text-sm leading-relaxed',
            result === 'ok' ? 'border-primary/30 bg-accent/50' :
            result === 'partial' ? 'border-amber-400/50 bg-amber-50' :
            'border-destructive/30 bg-destructive/5'
          )}
          role="status"
          aria-live="polite"
        >
          <p className={cn(
            'font-bold',
            result === 'ok' ? 'text-primary' :
            result === 'partial' ? 'text-amber-700' :
            'text-destructive'
          )}>
            {result === 'ok' ? 'Верно!' : result === 'partial' ? 'Частично верно.' : 'Пока неверно.'}
          </p>
          <p className="mt-1.5">{quiz.explanation}</p>
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

function FillStep({ slug, stepId, quiz }: { slug: string; stepId: string; quiz: FillQuiz }) {
  const { prev, finish } = useQuizState(slug, stepId);
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
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Введите ответ
          </p>
          <h3 className="mt-1 text-base font-bold leading-snug sm:text-lg">{quiz.question}</h3>
          {quiz.hint && (
            <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Lightbulb className="h-3.5 w-3.5" aria-hidden="true" />{quiz.hint}
            </p>
          )}
        </div>
      </div>

      <form
        className="mt-5 flex flex-col gap-2 sm:flex-row"
        onSubmit={(e) => { e.preventDefault(); check(); }}
      >
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
        <div
          className={cn(
            'mt-4 rounded-lg border p-4 text-sm leading-relaxed',
            ok ? 'border-primary/30 bg-accent/50' : 'border-destructive/30 bg-destructive/5'
          )}
          role="status"
          aria-live="polite"
        >
          <p className={cn('font-bold', ok ? 'text-primary' : 'text-destructive')}>
            {ok ? 'Верно!' : 'Пока неверно.'}
          </p>
          <p className="mt-1.5">{quiz.explanation}</p>
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

function MatchingStep({ slug, stepId, quiz }: { slug: string; stepId: string; quiz: MatchingQuiz }) {
  const { prev, finish } = useQuizState(slug, stepId);
  const rights = useMemo(() => {
    const arr = quiz.pairs.map((p) => p.right);
    if (quiz.shuffle === false) return arr;
    // детерминированная перестановка — стабильна между рендерами
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

  return (
    <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent">
          <CircleHelp className="h-5 w-5 text-primary" aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Сопоставьте пары
          </p>
          <h3 className="mt-1 text-base font-bold leading-snug sm:text-lg">{quiz.question}</h3>
        </div>
      </div>

      <div className="mt-5 space-y-2.5">
        {quiz.pairs.map((pair, i) => {
          const value = assign[i] ?? '';
          const isRight = checked && value === pair.right;
          const isWrong = checked && value !== pair.right;
          return (
            <div
              key={i}
              className={cn(
                'grid grid-cols-1 gap-2 rounded-lg border p-3 sm:grid-cols-2',
                isRight && 'border-primary/40 bg-accent/40',
                isWrong && 'border-destructive/40 bg-destructive/5'
              )}
            >
              <span className="flex items-center text-sm font-medium">{pair.left}</span>
              <select
                value={value}
                onChange={(e) => { setChecked(false); setAssign((a) => ({ ...a, [i]: e.target.value })); }}
                aria-label={`Соответствие для «${pair.left}»`}
                className="h-11 min-h-[44px] w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">— выберите —</option>
                {rights.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          );
        })}
      </div>

      {checked && score && (
        <div
          className={cn(
            'mt-4 rounded-lg border p-4 text-sm leading-relaxed',
            score.right === score.total ? 'border-primary/30 bg-accent/50' :
            score.right > 0 ? 'border-amber-400/50 bg-amber-50' :
            'border-destructive/30 bg-destructive/5'
          )}
          role="status"
          aria-live="polite"
        >
          <p className="font-bold">
            Верно {score.right} из {score.total}.
          </p>
          <p className="mt-1.5">{quiz.explanation}</p>
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button onClick={check} disabled={!allAssigned || (checked && score?.right === score?.total)} className="min-h-[44px] px-6">
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