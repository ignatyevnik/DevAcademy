import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SandboxEditor } from '@/components/editor/SandboxEditor';
import { PythonEditor } from '@/components/editor/PythonEditor'; 
import type { TextBlock } from '@/data';

interface Props {
  block: TextBlock;
  onChange: (b: TextBlock) => void;
  onDelete: () => void;
}

export function BlockEditor({ block, onChange, onDelete }: Props) {
  const field = (key: string, value: any) => onChange({ ...block, [key]: value } as TextBlock);

  const CharCount = ({ current, max = 2000 }: { current: number; max?: number }) => (
    <div className="text-[10px] text-muted-foreground text-right mt-1">
      {current} {max && `/ ${max}`}
    </div>
  );

  return (
    <div className="rounded-lg border border-border bg-muted/10 p-3 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">
          Блок: {block.type}
        </span>
        <Button variant="ghost" size="sm" onClick={onDelete} aria-label="Удалить блок" className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive">
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      {block.type === 'p' && (
        <>
          <textarea
            value={block.text}
            onChange={(e) => field('text', e.target.value)}
            placeholder="Текст абзаца. Для кода используйте `обратные кавычки`"
            className="w-full min-h-[70px] rounded-md border border-input bg-background p-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <CharCount current={block.text.length} />
        </>
      )}

      {block.type === 'h3' && (
        <>
          <Input value={block.text} onChange={(e) => field('text', e.target.value)} placeholder="Заголовок" className="bg-background" />
          <CharCount current={block.text.length} max={100} />
        </>
      )}

      {block.type === 'note' && (
        <>
          <textarea
            value={block.text}
            onChange={(e) => field('text', e.target.value)}
            placeholder="Текст заметки (важное выделение)"
            className="w-full min-h-[60px] rounded-md border border-input bg-background p-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <CharCount current={block.text.length} />
        </>
      )}

      {block.type === 'list' && (
        <>
          <p className="text-xs text-muted-foreground">По одному пункту на строку:</p>
          <textarea
            value={block.items.join('\n')}
            onChange={(e) => field('items', e.target.value.split('\n').filter(Boolean))}
            placeholder="Первый пункт&#10;Второй пункт"
            className="w-full min-h-[80px] rounded-md border border-input bg-background p-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
              className="bg-background"
            />
            <Input
              value={block.caption || ''}
              onChange={(e) => field('caption', e.target.value)}
              placeholder="Подпись (опционально)"
              className="bg-background"
            />
          </div>
          <textarea
            value={block.code}
            onChange={(e) => field('code', e.target.value)}
            placeholder="Код"
            className="w-full min-h-[100px] rounded-md border border-input bg-background p-2 text-sm font-mono text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
            className="bg-background"
          />
          <p className="text-xs text-muted-foreground">Заголовки колонок через <code className="bg-muted px-1 rounded">|</code>:</p>
          <Input
            value={block.head.join(' | ')}
            onChange={(e) => field('head', e.target.value.split('|').map((s) => s.trim()))}
            placeholder="Колонка 1 | Колонка 2"
            className="bg-background"
          />
          <p className="text-xs text-muted-foreground">Строки (значения через <code className="bg-muted px-1 rounded">|</code>, по строке на строку):</p>
          <textarea
            value={block.rows.map((r) => r.join(' | ')).join('\n')}
            onChange={(e) => field('rows', e.target.value.split('\n').filter(Boolean).map((line) => line.split('|').map((s) => s.trim())))}
            placeholder="Знач 1 | Знач 2&#10;Знач 3 | Знач 4"
            className="w-full min-h-[80px] rounded-md border border-input bg-background p-2 text-sm font-mono text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </>
      )}

            {block.type === 'image' && (
        <>
          <Input value={block.src} onChange={(e) => field('src', e.target.value)} placeholder="URL картинки или путь (/images/docker.png)" className="bg-background" />
          <Input value={block.alt} onChange={(e) => field('alt', e.target.value)} placeholder="Описание (alt-текст) для доступности" className="bg-background" />
          <Input value={block.caption || ''} onChange={(e) => field('caption', e.target.value)} placeholder="Подпись (опционально)" className="bg-background" />
        </>
      )}

      {block.type === 'mermaid' && (
        <>
          <p className="text-xs text-muted-foreground mb-1">Код Mermaid (например, graph TD; A--&gt;B;)</p>
          <textarea
            value={block.code}
            onChange={(e) => field('code', e.target.value)}
            className="w-full min-h-[100px] rounded-md border border-input bg-background p-2 text-sm font-mono text-foreground"
            rows={5}
          />
          <Input value={block.caption || ''} onChange={(e) => field('caption', e.target.value)} placeholder="Подпись (опционально)" className="bg-background" />
        </>
      )}

      {block.type === 'sandbox' && (
  <SandboxEditor
    sandbox={block.sandbox}
    onChange={(next) => field('sandbox', next)}
  />
        )}

        {block.type === 'python' && (
  <PythonEditor
    python={block.python}
    onChange={(next) => field("python", next)}
  />
)}
    </div>
  );
}