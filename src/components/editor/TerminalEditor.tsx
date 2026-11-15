import { Plus, Trash2 } from 'lucide-react';
import type { TerminalBlock, TerminalStepRule } from '@/data/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Props {
  value: TerminalBlock;
  onChange: (val: TerminalBlock) => void;
}

export function TerminalEditor({ value, onChange }: Props) {
  const update = (patch: Partial<TerminalBlock>) => {
    onChange({ ...value, ...patch });
  };

  const updateStep = (idx: number, patch: Partial<TerminalStepRule>) => {
    const next = [...value.commands];
    next[idx] = { ...next[idx], ...patch };
    update({ commands: next });
  };

  const addStep = () => {
    update({
      commands: [
        ...value.commands,
        {
          instruction: '',
          acceptedPatterns: ['^ls\\s+-la$'],
          output: '',
          commonMistakes: [],
        },
      ],
    });
  };

  const removeStep = (idx: number) => {
    if (value.commands.length <= 1) return;
    update({ commands: value.commands.filter((_, i) => i !== idx) });
  };

  return (
    <div className="space-y-4 rounded-lg border border-border bg-muted/20 p-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            Prompt (приглашение строки)
          </label>
          <Input
            value={value.prompt ?? ''}
            onChange={(e) => update({ prompt: e.target.value || undefined })}
            placeholder="student@devacademy:~$"
            className="font-mono text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            Подпись (caption, опционально)
          </label>
          <Input
            value={value.caption ?? ''}
            onChange={(e) => update({ caption: e.target.value || undefined })}
            placeholder="Практика в терминале"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-muted-foreground">
          Задание (task) *
        </label>
        <textarea
          value={value.task}
          onChange={(e) => update({ task: e.target.value })}
          rows={2}
          className="w-full rounded-md border border-input bg-background p-2 text-sm"
          placeholder="Опишите, что нужно сделать в терминале…"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Шаги сценария ({value.commands.length})
          </span>
          <Button type="button" size="sm" variant="outline" onClick={addStep}>
            <Plus className="h-3.5 w-3.5" /> Добавить шаг
          </Button>
        </div>

        {value.commands.map((cmd, idx) => (
          <div key={idx} className="space-y-2.5 rounded-md border border-border bg-card p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold">Шаг #{idx + 1}</span>
              {value.commands.length > 1 && (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => removeStep(idx)}
                  className="h-7 px-2 text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>

            <div>
              <label className="mb-1 block text-xs text-muted-foreground">
                Подсказка текущего шага (instruction, опционально)
              </label>
              <Input
                value={cmd.instruction ?? ''}
                onChange={(e) => updateStep(idx, { instruction: e.target.value || undefined })}
                placeholder="Например: Шаг 1 — перейдите в папку /var/log"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-muted-foreground">
                Допустимые Regex-паттерны (по одному на строку) *
              </label>
              <textarea
                value={cmd.acceptedPatterns.join('\n')}
                onChange={(e) =>
                  updateStep(idx, {
                    acceptedPatterns: e.target.value
                      .split('\n')
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
                rows={2}
                className="w-full rounded-md border border-input bg-background p-2 font-mono text-xs"
                placeholder="^ls\s+-la$"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-muted-foreground">
                Вывод терминала при успехе (output)
              </label>
              <textarea
                value={cmd.output ?? ''}
                onChange={(e) => updateStep(idx, { output: e.target.value || undefined })}
                rows={2}
                className="w-full rounded-md border border-input bg-background p-2 font-mono text-xs"
                placeholder="drwxr-xr-x 2 root root 4096 ..."
              />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            Эталонное решение (solution) *
          </label>
          <textarea
            value={value.solution}
            onChange={(e) => update({ solution: e.target.value })}
            rows={2}
            className="w-full rounded-md border border-input bg-background p-2 font-mono text-xs"
            placeholder="cd /var/log&#10;ls -la"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            Подсказка (hint, опционально)
          </label>
          <textarea
            value={value.hint ?? ''}
            onChange={(e) => update({ hint: e.target.value || undefined })}
            rows={2}
            className="w-full rounded-md border border-input bg-background p-2 text-xs"
            placeholder="Используйте флаг -la…"
          />
        </div>
      </div>
    </div>
  );
}