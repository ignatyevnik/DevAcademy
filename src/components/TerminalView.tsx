import { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, RotateCcw, CheckCircle2, HelpCircle } from 'lucide-react';
import type { TerminalBlock } from '@/data/types';
import type { QuizResult } from '@/lib/progress';
import { Button } from '@/components/ui/button';

interface Props {
  terminal: TerminalBlock;
  onResult?: (result: QuizResult) => void;
}

interface HistoryEntry {
  command: string;
  output?: string;
  status: 'ok' | 'mistake' | 'error' | 'info';
  prompt: string;
}

export function TerminalView({ terminal, onResult }: Props) {
  const promptText = terminal.prompt ?? 'student@devacademy:~$';
  const [stepIdx, setStepIdx] = useState(0);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyCursor, setHistoryCursor] = useState<number>(-1);
  const [failed, setFailed] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [completed, setCompleted] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentRule = terminal.commands[stepIdx];
  const totalSteps = terminal.commands.length;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  function handleReset() {
    setStepIdx(0);
    setInput('');
    setHistory([]);
    setCompleted(false);
  }

  function handleCommand(rawCmd: string) {
    const cmd = rawCmd.trim();
    if (!cmd) return;

    setCmdHistory((prev) => [...prev, cmd]);
    setHistoryCursor(-1);

    // Встроенные сервисные команды
    if (cmd === 'clear') {
      setHistory([]);
      return;
    }
    if (cmd === 'help') {
      setHistory((prev) => [
        ...prev,
        {
          command: cmd,
          prompt: promptText,
          status: 'info',
          output:
            'Доступные сервисные команды: clear (очистить экран), pwd, whoami.\nВведите команду согласно заданию урока.',
        },
      ]);
      return;
    }
    if (cmd === 'whoami') {
      setHistory((prev) => [
        ...prev,
        { command: cmd, prompt: promptText, status: 'info', output: 'student' },
      ]);
      return;
    }
    if (cmd === 'pwd') {
      setHistory((prev) => [
        ...prev,
        { command: cmd, prompt: promptText, status: 'info', output: '/home/student/workspace' },
      ]);
      return;
    }

    if (!currentRule || completed) return;

    // 1. Проверяем правильные паттерны текущего шага
    const isMatched = currentRule.acceptedPatterns.some((pattern) => {
      try {
        return new RegExp(pattern).test(cmd);
      } catch {
        return cmd === pattern;
      }
    });

    if (isMatched) {
      const nextStep = stepIdx + 1;
      const isAllDone = nextStep >= totalSteps;

      setHistory((prev) => [
        ...prev,
        {
          command: cmd,
          prompt: promptText,
          status: 'ok',
          output: currentRule.output ?? (isAllDone ? '✓ Команда выполнена успешно.' : undefined),
        },
      ]);

      if (isAllDone) {
        setCompleted(true);
        onResult?.('ok');
      } else {
        setStepIdx(nextStep);
      }
      return;
    }

    // 2. Проверяем частые ошибки (commonMistakes) для умной подсказки
    const mistake = currentRule.commonMistakes?.find((m) => {
      try {
        return new RegExp(m.pattern).test(cmd);
      } catch {
        return false;
      }
    });

    if (mistake) {
      setHistory((prev) => [
        ...prev,
        {
          command: cmd,
          prompt: promptText,
          status: 'mistake',
          output: mistake.output,
        },
      ]);
      setFailed((n) => n + 1);
      onResult?.('fail');
      return;
    }

    // 3. Неизвестная или неверная команда
    const bin = cmd.split(/\s+/)[0];
    setHistory((prev) => [
      ...prev,
      {
        command: cmd,
        prompt: promptText,
        status: 'error',
        output: `Команда «${bin}» с указанными аргументами не решает текущую задачу. Попробуйте ещё раз.`,
      },
    ]);
    setFailed((n) => n + 1);
    onResult?.('fail');
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const nextCursor =
        historyCursor === -1 ? cmdHistory.length - 1 : Math.max(0, historyCursor - 1);
      setHistoryCursor(nextCursor);
      setInput(cmdHistory[nextCursor]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyCursor === -1) return;
      const nextCursor = historyCursor + 1;
      if (nextCursor >= cmdHistory.length) {
        setHistoryCursor(-1);
        setInput('');
      } else {
        setHistoryCursor(nextCursor);
        setInput(cmdHistory[nextCursor]);
      }
    }
  }

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-border bg-card">
      {/* Шапка задания */}
      <div className="border-b border-border p-5">
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
            <TerminalIcon className="h-4 w-4" /> Терминальный тренажёр
          </p>
          {totalSteps > 1 && (
            <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-primary">
              Шаг {Math.min(stepIdx + 1, totalSteps)} из {totalSteps}
            </span>
          )}
        </div>
        <p className="text-sm leading-relaxed">{terminal.task}</p>
        {currentRule?.instruction && !completed && (
          <p className="mt-2 rounded-md border border-primary/20 bg-accent/40 px-3 py-1.5 text-xs font-medium text-foreground">
            Текущая цель: {currentRule.instruction}
          </p>
        )}
        {terminal.caption && (
          <p className="mt-2 text-xs text-muted-foreground">{terminal.caption}</p>
        )}
      </div>

      {/* Окно эмулятора терминала */}
      <div
        ref={scrollRef}
        onClick={() => inputRef.current?.focus()}
        className="max-h-[340px] min-h-[200px] cursor-text overflow-y-auto bg-zinc-950 p-4 font-mono text-sm text-zinc-100"
      >
        <div className="mb-3 text-xs text-zinc-500">
          DevAcademy CLI Sandbox (введите команду и нажмите Enter, стрелки ↑/↓ — история, clear — очистить)
        </div>

        <div className="space-y-2.5">
          {history.map((item, i) => (
            <div key={i} className="space-y-1">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="select-none font-semibold text-emerald-400">{item.prompt}</span>
                <span className="break-all text-zinc-100">{item.command}</span>
              </div>
              {item.output && (
                <pre
                  className={
                    item.status === 'error'
                      ? 'whitespace-pre-wrap text-xs text-red-400'
                      : item.status === 'mistake'
                      ? 'whitespace-pre-wrap text-xs text-amber-400'
                      : item.status === 'ok'
                      ? 'whitespace-pre-wrap text-xs text-zinc-300'
                      : 'whitespace-pre-wrap text-xs text-zinc-400'
                  }
                >
                  {item.output}
                </pre>
              )}
            </div>
          ))}

          {!completed && (
            <div className="flex items-center gap-2">
              <span className="select-none font-semibold text-emerald-400">{promptText}</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="введите команду…"
                spellCheck={false}
                autoCapitalize="off"
                autoComplete="off"
                aria-label="Ввод команды терминала"
                className="flex-1 bg-transparent text-zinc-100 placeholder:text-zinc-600 focus:outline-none"
              />
            </div>
          )}
        </div>
      </div>

      {/* Панель управления и подсказки */}
      <div className="space-y-3 border-t border-border p-4">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            onClick={() => {
              handleCommand(input);
              setInput('');
            }}
            disabled={!input.trim() || completed}
          >
            <CheckCircle2 className="h-4 w-4" /> Выполнить
          </Button>
          <Button size="sm" variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4" /> Сбросить
          </Button>
          {failed >= 2 && !showSolution && (
            <Button size="sm" variant="ghost" onClick={() => setShowSolution(true)}>
              <HelpCircle className="h-4 w-4" /> Показать решение
            </Button>
          )}
        </div>

        {completed && (
          <div className="rounded-lg border border-primary/40 bg-primary/5 p-3 text-sm">
            <span className="font-semibold text-primary">Отлично!</span> Все команды выполнены верно.
          </div>
        )}

        {showSolution && (
          <div className="rounded-lg border border-border bg-background p-3">
            <p className="mb-1.5 text-xs font-semibold text-muted-foreground">Эталонное решение</p>
            <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-sm">
              {terminal.solution}
            </pre>
            {terminal.hint && (
              <p className="mt-2 text-xs text-muted-foreground">Подсказка: {terminal.hint}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}