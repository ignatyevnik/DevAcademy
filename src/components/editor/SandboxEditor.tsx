import { useState } from 'react';
import { Input } from '@/components/ui/input';
import type { SandboxBlock } from '@/data/types';

interface Props {
  sandbox: SandboxBlock;
  onChange: (next: SandboxBlock) => void;
}

export function SandboxEditor({ sandbox, onChange }: Props) {
  const patch = (p: Partial<SandboxBlock>) => onChange({ ...sandbox, ...p });

  const [expectedText, setExpectedText] = useState(() =>
    sandbox.expected ? JSON.stringify(sandbox.expected, null, 2) : '',
  );
  const [expectedError, setExpectedError] = useState<string | null>(null);

  const updateExpected = (text: string) => {
    setExpectedText(text);
    if (!text.trim()) {
      setExpectedError(null);
      patch({ expected: undefined });
      return;
    }
    try {
      const parsed = JSON.parse(text);
      if (
        !Array.isArray(parsed.columns) ||
        !Array.isArray(parsed.rows)
      ) {
        throw new Error('Нужны поля columns (массив) и rows (массив массивов)');
      }
      setExpectedError(null);
      patch({ expected: parsed });
    } catch (e) {
      setExpectedError(e instanceof Error ? e.message : 'Невалидный JSON');
    }
  };

  return (
    <div className="space-y-3 rounded-lg border border-border bg-card p-3">
      <div>
        <label className="mb-1 block text-xs font-semibold">Схема (CREATE + INSERT)</label>
        <textarea
          value={sandbox.schema}
          onChange={(e) => patch({ schema: e.target.value })}
          rows={5}
          spellCheck={false}
          placeholder={'CREATE TABLE ...;\nINSERT INTO ...;'}
          className="w-full resize-y rounded border border-input bg-background p-2 font-mono text-xs"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold">Задание</label>
        <textarea
          value={sandbox.task}
          onChange={(e) => patch({ task: e.target.value })}
          rows={2}
          placeholder="Что должен сделать пользователь?"
          className="w-full resize-y rounded border border-input bg-background p-2 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold">Эталонный запрос (solution)</label>
        <textarea
          value={sandbox.solution}
          onChange={(e) => patch({ solution: e.target.value })}
          rows={3}
          spellCheck={false}
          placeholder="SELECT ..."
          className="w-full resize-y rounded border border-input bg-background p-2 font-mono text-xs"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold">
          Ожидаемый результат (JSON, опционально)
        </label>
        <textarea
          value={expectedText}
          onChange={(e) => updateExpected(e.target.value)}
          rows={6}
          spellCheck={false}
          placeholder={'{\n  "columns": ["email"],\n  "rows": [["a@x.com"]],\n  "order": "set"\n}'}
          className="w-full resize-y rounded border border-input bg-background p-2 font-mono text-xs"
        />
        {expectedError ? (
          <p className="mt-1 text-xs text-destructive">{expectedError}</p>
        ) : (
          <p className="mt-1 text-xs text-muted-foreground">
            Оставьте пустым — сверка пойдёт по результату solution.
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="mb-1 block text-xs font-semibold">Подсказка</label>
          <Input
            value={sandbox.hint ?? ''}
            onChange={(e) => patch({ hint: e.target.value || undefined })}
            placeholder="Например: используйте WHERE"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold">Forbidden (regex, через запятую)</label>
          <Input
            value={(sandbox.forbidden ?? []).join(', ')}
            onChange={(e) => {
              const raw = e.target.value
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean);
              patch({ forbidden: raw.length > 0 ? raw : undefined });
            }}
            placeholder="JOIN, ORDER BY"
          />
        </div>
      </div>
    </div>
  );
}