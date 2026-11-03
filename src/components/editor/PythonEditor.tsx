import { useState } from 'react';
import { Input } from '@/components/ui/input';
import type { PythonBlock } from '@/data/types';

interface Props {
  python: PythonBlock;
  onChange: (next: PythonBlock) => void;
}

export function PythonEditor({ python, onChange }: Props) {
  const patch = (p: Partial<PythonBlock>) => onChange({ ...python, ...p });
  const [expectedJson, setExpectedJson] = useState(() =>
    JSON.stringify(python.expected, null, 2),
  );
  const [expectedError, setExpectedError] = useState<string | null>(null);

  const updateExpected = (text: string) => {
    setExpectedJson(text);
    try {
      const parsed = JSON.parse(text);
      if (parsed.type !== 'stdout' && parsed.type !== 'variable') {
        throw new Error('type должен быть "stdout" или "variable"');
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
        <label className="mb-1 block text-xs font-semibold">Стартовый код</label>
        <textarea
          value={python.starterCode ?? ''}
          onChange={(e) => patch({ starterCode: e.target.value })}
          rows={4}
          spellCheck={false}
          placeholder="# ваш код"
          className="w-full resize-y rounded border border-input bg-[#17211c] p-2 font-mono text-xs text-[#d9e7de]"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold">Задание</label>
        <textarea
          value={python.task}
          onChange={(e) => patch({ task: e.target.value })}
          rows={2}
          placeholder="Что должен сделать пользователь?"
          className="w-full resize-y rounded border border-input bg-background p-2 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold">Эталонный код (solution)</label>
        <textarea
          value={python.solution}
          onChange={(e) => patch({ solution: e.target.value })}
          rows={4}
          spellCheck={false}
          placeholder="print('Hello')"
          className="w-full resize-y rounded border border-input bg-background p-2 font-mono text-xs"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold">Ожидаемый результат (JSON)</label>
        <textarea
          value={expectedJson}
          onChange={(e) => updateExpected(e.target.value)}
          rows={4}
          spellCheck={false}
          placeholder={'{ "type": "stdout", "value": "Hello" }'}
          className="w-full resize-y rounded border border-input bg-background p-2 font-mono text-xs"
        />
        {expectedError ? (
          <p className="mt-1 text-xs text-destructive">{expectedError}</p>
        ) : (
          <p className="mt-1 text-xs text-muted-foreground">
            stdout: <code>{'{ "type": "stdout", "value": "...", "normalize": "trim" }'}</code> или
            variable: <code>{'{ "type": "variable", "name": "x", "value": 42 }'}</code>
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="mb-1 block text-xs font-semibold">Подсказка</label>
          <Input
            value={python.hint ?? ''}
            onChange={(e) => patch({ hint: e.target.value || undefined })}
            placeholder="Например: используйте print()"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold">Forbidden (regex, через запятую)</label>
          <Input
            value={(python.forbidden ?? []).join(', ')}
            onChange={(e) => {
              const raw = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
              patch({ forbidden: raw.length > 0 ? raw : undefined });
            }}
            placeholder="import os, open("
          />
        </div>
      </div>
    </div>
  );
}