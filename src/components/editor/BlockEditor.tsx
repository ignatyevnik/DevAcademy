import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { TextBlock } from '@/data';

interface Props {
  block: TextBlock;
  onChange: (b: TextBlock) => void;
  onDelete: () => void;
}

export function BlockEditor({ block, onChange, onDelete }: Props) {
  const field = (key: string, value: any) => onChange({ ...block, [key]: value } as TextBlock);

  return (
    <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Блок: {block.type}
        </span>
        <Button variant="ghost" size="icon-sm" onClick={onDelete} aria-label="Удалить блок">
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      {block.type === 'p' && (
        <textarea
          value={block.text}
          onChange={(e) => field('text', e.target.value)}
          placeholder="Текст абзаца. Для кода используйте `обратные кавычки`"
          className="w-full min-h-[70px] rounded border border-input bg-background p-2 text-sm"
        />
      )}

      {block.type === 'h3' && (
        <Input value={block.text} onChange={(e) => field('text', e.target.value)} placeholder="Заголовок" />
      )}

      {block.type === 'note' && (
        <textarea
          value={block.text}
          onChange={(e) => field('text', e.target.value)}
          placeholder="Текст заметки (важное выделение)"
          className="w-full min-h-[60px] rounded border border-input bg-background p-2 text-sm"
        />
      )}

      {block.type === 'list' && (
        <>
          <p className="text-xs text-muted-foreground">По одному пункту на строку:</p>
          <textarea
            value={block.items.join('\n')}
            onChange={(e) => field('items', e.target.value.split('\n').filter(Boolean))}
            placeholder="Первый пункт&#10;Второй пункт"
            className="w-full min-h-[80px] rounded border border-input bg-background p-2 text-sm"
          />
        </>
      )}

      {block.type === 'code' && (
        <>
          <div className="grid grid-cols-2 gap-2">
            <Input
              value={block.lang}
              onChange={(e) => field('lang', e.target.value)}
              placeholder="Язык (python, sql, bash)"
            />
            <Input
              value={block.caption || ''}
              onChange={(e) => field('caption', e.target.value)}
              placeholder="Подпись (опционально)"
            />
          </div>
          <textarea
            value={block.code}
            onChange={(e) => field('code', e.target.value)}
            placeholder="Код"
            className="w-full min-h-[100px] rounded border border-input bg-[#17211c] p-2 text-sm font-mono text-[#d9e7de]"
            spellCheck={false}
          />
        </>
      )}

      {block.type === 'table' && (
        <>
          <Input
            value={block.caption || ''}
            onChange={(e) => field('caption', e.target.value)}
            placeholder="Подпись таблицы (опционально)"
          />
          <p className="text-xs text-muted-foreground">Заголовки колонок через <code>|</code>:</p>
          <Input
            value={block.head.join(' | ')}
            onChange={(e) => field('head', e.target.value.split('|').map((s) => s.trim()))}
            placeholder="Колонка 1 | Колонка 2"
          />
          <p className="text-xs text-muted-foreground">Строки (значения через <code>|</code>, по строке на строку):</p>
          <textarea
            value={block.rows.map((r) => r.join(' | ')).join('\n')}
            onChange={(e) => field('rows', e.target.value.split('\n').filter(Boolean).map((line) => line.split('|').map((s) => s.trim())))}
            placeholder="Знач 1 | Знач 2&#10;Знач 3 | Знач 4"
            className="w-full min-h-[80px] rounded border border-input bg-background p-2 text-sm font-mono"
          />
        </>
      )}
    </div>
  );
}