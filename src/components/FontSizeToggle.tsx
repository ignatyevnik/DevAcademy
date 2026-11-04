import { Type } from 'lucide-react';
import { useFontSize, type FontSize } from '@/lib/font-size';
import { cn } from '@/lib/utils';

export function FontSizeToggle() {
  const { size, setSize } = useFontSize();
  const sizes: FontSize[] = ['s', 'm', 'l'];

  return (
    <div className="flex items-center gap-0.5 rounded-md border border-border bg-card p-0.5">
      <Type className="h-4 w-4 text-muted-foreground ml-1.5 mr-1" aria-hidden="true" />
      {sizes.map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => setSize(s)}
          aria-label={`Размер шрифта ${s.toUpperCase()}`}
          className={cn(
            'h-7 w-7 rounded text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            size === s
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-accent hover:text-foreground'
          )}
        >
          {s.toUpperCase()}
        </button>
      ))}
    </div>
  );
}