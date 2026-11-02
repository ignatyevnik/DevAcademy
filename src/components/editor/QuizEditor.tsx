import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type {
  Quiz, SingleQuiz, MultipleQuiz, FillQuiz, MatchingQuiz,
  SortingQuiz, TableQuiz, NumberQuiz, ClozeQuiz, CodeQuiz,
} from '@/data';

interface Props { quiz: Quiz; onChange: (q: Quiz) => void; }

const DEFAULT_QUIZ: Record<Quiz['kind'], (q: Partial<Quiz>) => Quiz> = {
  single: (q) => ({ 
    kind: 'single', 
    question: q.question || '', 
    explanation: q.explanation || '', 
    options: [{ id: 'a', text: 'Вариант A' }, { id: 'b', text: 'Вариант B' }], 
    correct: ['a'] 
  }) as SingleQuiz,
  multiple: (q) => ({ kind: 'multiple', question: q.question || '', explanation: q.explanation || '', options: [{ id: 'a', text: 'Вариант A' }, { id: 'b', text: 'Вариант B' }], correct: [] }) as MultipleQuiz,
  fill: (q) => ({ kind: 'fill', question: q.question || '', explanation: q.explanation || '', accepted: ['ответ'] }) as FillQuiz,
  matching: (q) => ({ kind: 'matching', question: q.question || '', explanation: q.explanation || '', pairs: [{ left: 'Слева 1', right: 'Справа 1' }, { left: 'Слева 2', right: 'Справа 2' }] }) as MatchingQuiz,
  sorting: (q) => ({ kind: 'sorting', question: q.question || '', explanation: q.explanation || '', items: ['А', 'Б', 'В'], correct: ['А', 'Б', 'В'] }) as SortingQuiz,
  table: (q) => ({ kind: 'table', question: q.question || '', explanation: q.explanation || '', columns: ['Колонка 1', 'Колонка 2'], rows: [{ label: 'Строка 1', correct: [] }] }) as TableQuiz,
  number: (q) => ({ kind: 'number', question: q.question || '', explanation: q.explanation || '', correct: 0 }) as NumberQuiz,
  cloze: (q) => ({ kind: 'cloze', question: q.question || '', explanation: q.explanation || '', text: 'git ____ main', blanks: [{ accepted: ['checkout'], hint: 'переключиться' }] }) as ClozeQuiz,
  code: (q) => ({ kind: 'code', question: q.question || '', explanation: q.explanation || '', starterCode: '', mustInclude: [{ pattern: '.*', message: 'Условие' }] }) as CodeQuiz,
};

export function QuizEditor({ quiz, onChange }: Props) {
  const changeKind = (kind: Quiz['kind']) => {
    if (kind === quiz.kind) return;
    onChange(DEFAULT_QUIZ[kind]({ question: quiz.question, explanation: quiz.explanation }));
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <select
          value={quiz.kind}
          onChange={(e) => changeKind(e.target.value as Quiz['kind'])}
          className="h-9 rounded border border-input bg-background px-3 text-sm"
        >
          <option value="single">Один ответ</option>
          <option value="multiple">Несколько ответов</option>
          <option value="fill">Текстовый ввод</option>
          <option value="matching">Сопоставление</option>
          <option value="sorting">Сортировка</option>
          <option value="table">Таблица</option>
          <option value="number">Число</option>
          <option value="cloze">Пропуски</option>
          <option value="code">Код</option>
        </select>
      </div>

      <div>
        <Input
          value={quiz.question}
          onChange={(e) => onChange({ ...quiz, question: e.target.value })}
          placeholder="Вопрос (можно использовать `код`)"
          className="bg-background"
        />
        <div className="text-[10px] text-muted-foreground text-right mt-1">
          {quiz.question.length} символов
        </div>
      </div>

      {(quiz.kind === 'single' || quiz.kind === 'multiple') && (
        <div className="space-y-2">
          {quiz.options.map((opt, i) => (
            <div key={opt.id} className="flex items-center gap-2">
              <Input
                value={opt.id}
                onChange={(e) => {
                  const newOpts = [...quiz.options];
                  const oldId = newOpts[i].id;
                  newOpts[i].id = e.target.value;
                  const newCorrect = quiz.correct.map((c) => (c === oldId ? e.target.value : c));
                  // Приводим тип к Quiz, чтобы TS не ругался на массив вместо кортежа
                  onChange({ ...quiz, options: newOpts, correct: newCorrect } as Quiz);
                }}
                className="w-14 text-center font-mono"
              />
              <Input
                value={opt.text}
                onChange={(e) => {
                  const newOpts = [...quiz.options];
                  newOpts[i].text = e.target.value;
                  onChange({ ...quiz, options: newOpts } as Quiz);
                }}
                className="flex-1"
                placeholder="Текст варианта"
              />
              <label className="flex items-center gap-1 text-xs whitespace-nowrap">
                <input
                  type={quiz.kind === 'single' ? 'radio' : 'checkbox'}
                  checked={quiz.correct.includes(opt.id)}
                  onChange={(e) => {
                    if (quiz.kind === 'single') onChange({ ...quiz, correct: [opt.id] });
                    else onChange({ ...quiz, correct: e.target.checked ? [...quiz.correct, opt.id] : quiz.correct.filter((c) => c !== opt.id) });
                  }}
                />
                верный
              </label>
              <Button variant="ghost" size="icon-sm" onClick={() => onChange({ ...quiz, options: quiz.options.filter((_, j) => j !== i), correct: quiz.correct.filter((c) => c !== opt.id) } as Quiz)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => {
            const newId = String.fromCharCode(97 + quiz.options.length);
            onChange({ ...quiz, options: [...quiz.options, { id: newId, text: '' }] } as Quiz);
          }}>
            <Plus className="h-3 w-3" /> Добавить вариант
          </Button>
        </div>
      )}

      {quiz.kind === 'fill' && (
        <>
          <p className="text-xs text-muted-foreground">Принимаемые ответы (по одному на строку):</p>
          <textarea
            value={quiz.accepted.join('\n')}
            onChange={(e) => onChange({ ...quiz, accepted: e.target.value.split('\n').filter(Boolean) })}
            className="w-full rounded border border-input bg-background p-2 text-sm font-mono"
            rows={3}
          />
          <div className="grid grid-cols-2 gap-2">
            <Input value={quiz.hint || ''} onChange={(e) => onChange({ ...quiz, hint: e.target.value })} placeholder="Подсказка" />
            <Input value={quiz.placeholder || ''} onChange={(e) => onChange({ ...quiz, placeholder: e.target.value })} placeholder="Placeholder в поле ввода" />
          </div>
        </>
      )}

      {quiz.kind === 'matching' && (
        <div className="space-y-2">
          {quiz.pairs.map((pair, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input value={pair.left} onChange={(e) => { const n = [...quiz.pairs]; n[i].left = e.target.value; onChange({ ...quiz, pairs: n }); }} placeholder="Слева" />
              <span className="text-muted-foreground">→</span>
              <Input value={pair.right} onChange={(e) => { const n = [...quiz.pairs]; n[i].right = e.target.value; onChange({ ...quiz, pairs: n }); }} placeholder="Справа" />
              <Button variant="ghost" size="icon-sm" onClick={() => onChange({ ...quiz, pairs: quiz.pairs.filter((_, j) => j !== i) })}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => onChange({ ...quiz, pairs: [...quiz.pairs, { left: '', right: '' }] })}>
            <Plus className="h-3 w-3" /> Добавить пару
          </Button>
        </div>
      )}

      {quiz.kind === 'sorting' && (
        <>
          <p className="text-xs text-muted-foreground">Элементы (по одному на строку) — в правильном порядке:</p>
          <textarea
            value={quiz.correct.join('\n')}
            onChange={(e) => { const arr = e.target.value.split('\n').filter(Boolean); onChange({ ...quiz, items: arr, correct: arr }); }}
            className="w-full rounded border border-input bg-background p-2 text-sm font-mono"
            rows={4}
          />
          <p className="text-xs text-muted-foreground">При показе элементы перемешаются автоматически.</p>
        </>
      )}

      {quiz.kind === 'table' && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Колонки через <code>|</code>:</p>
          <Input
            value={quiz.columns.join(' | ')}
            onChange={(e) => onChange({ ...quiz, columns: e.target.value.split('|').map((s) => s.trim()) })}
          />
          <p className="text-xs text-muted-foreground">Строки. Формат: <code>подпись: верные колонки через запятую</code></p>
          <textarea
            value={quiz.rows.map((r) => `${r.label}: ${r.correct.join(', ')}`).join('\n')}
            onChange={(e) => {
              const rows = e.target.value.split('\n').filter(Boolean).map((line) => {
                const [label, rest] = line.split(':').map((s) => s.trim());
                return { label: label || '', correct: (rest || '').split(',').map((s) => s.trim()).filter(Boolean) };
              });
              onChange({ ...quiz, rows });
            }}
            className="w-full rounded border border-input bg-background p-2 text-sm font-mono"
            rows={4}
            placeholder="Делит ядро: Docker&#10;Тяжёлый: VM"
          />
        </div>
      )}

      {quiz.kind === 'number' && (
        <div className="grid grid-cols-2 gap-2">
          <Input type="number" value={quiz.correct} onChange={(e) => onChange({ ...quiz, correct: Number(e.target.value) })} placeholder="Правильный ответ" />
          <Input type="number" value={quiz.tolerance ?? 0} onChange={(e) => onChange({ ...quiz, tolerance: Number(e.target.value) })} placeholder="Допуск (±)" />
        </div>
      )}

      {quiz.kind === 'cloze' && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            Текст с пропусками (<code>____</code> — четыре подчёркивания). Пропусков: <strong>{quiz.blanks.length}</strong>
          </p>
          <textarea
            value={quiz.text}
            onChange={(e) => {
              const count = (e.target.value.match(/____/g) || []).length;
              const newBlanks = Array(count).fill(null).map((_, i) => quiz.blanks[i] || { accepted: [''], hint: '' });
              onChange({ ...quiz, text: e.target.value, blanks: newBlanks });
            }}
            className="w-full rounded border border-input bg-background p-2 text-sm font-mono"
            rows={3}
          />
          {quiz.blanks.map((b, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr] gap-2 text-xs">
              <Input
                value={b.accepted.join(', ')}
                onChange={(e) => { const n = [...quiz.blanks]; n[i].accepted = e.target.value.split(',').map((s) => s.trim()).filter(Boolean); onChange({ ...quiz, blanks: n }); }}
                placeholder={`Ответ ${i + 1} (варианты через запятую)`}
              />
              <Input
                value={b.hint || ''}
                onChange={(e) => { const n = [...quiz.blanks]; n[i].hint = e.target.value; onChange({ ...quiz, blanks: n }); }}
                placeholder="Подсказка"
              />
            </div>
          ))}
        </div>
      )}

      {quiz.kind === 'code' && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Стартовый код:</p>
          <textarea
            value={quiz.starterCode || ''}
            onChange={(e) => onChange({ ...quiz, starterCode: e.target.value })}
            className="w-full rounded border border-input bg-[#17211c] p-2 text-sm font-mono text-[#d9e7de]"
            rows={4}
          />
          <p className="text-xs text-muted-foreground">Правила проверки (regex → сообщение):</p>
          {quiz.mustInclude.map((rule, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2">
              <Input
                value={rule.pattern}
                onChange={(e) => { const n = [...quiz.mustInclude]; n[i].pattern = e.target.value; onChange({ ...quiz, mustInclude: n }); }}
                placeholder="regex"
                className="font-mono text-xs"
              />
              <Input
                value={rule.message}
                onChange={(e) => { const n = [...quiz.mustInclude]; n[i].message = e.target.value; onChange({ ...quiz, mustInclude: n }); }}
                placeholder="Сообщение при провале"
              />
              <Button variant="ghost" size="icon-sm" onClick={() => onChange({ ...quiz, mustInclude: quiz.mustInclude.filter((_, j) => j !== i) })}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => onChange({ ...quiz, mustInclude: [...quiz.mustInclude, { pattern: '', message: '' }] })}>
            <Plus className="h-3 w-3" /> Правило
          </Button>
        </div>
      )}

        <div>
        <label className="text-xs font-medium block mb-1">Объяснение (показывается после ответа):</label>
        <textarea
          value={quiz.explanation}
          onChange={(e) => onChange({ ...quiz, explanation: e.target.value })}
          className="w-full min-h-[60px] rounded-md border border-input bg-background p-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="Почему этот ответ верный?"
        />
        <div className="text-[10px] text-muted-foreground text-right mt-1">
          {quiz.explanation.length} символов
        </div>
      </div>
    </div>
  );
}