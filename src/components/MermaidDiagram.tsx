import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { cn } from '@/lib/utils';

// Инициализация ровно один раз при загрузке модуля
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
  fontFamily: 'inherit',
});

export function MermaidDiagram({ 
  code, 
  caption, 
  className 
}: { 
  code: string; 
  caption?: string; 
  className?: string 
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current || !code) return;

    const renderDiagram = async () => {
      try {
        setError(null);
        // Генерируем уникальный ID для каждого рендера
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        
        const { svg } = await mermaid.render(id, code);
        
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (err) {
        console.error('Mermaid render error:', err);
        setError('Не удалось отобразить диаграмму');
        if (containerRef.current) containerRef.current.innerHTML = '';
      }
    };

    renderDiagram();
  }, [code]);

  return (
    <div className={cn('my-6 flex flex-col items-center w-full', className)}>
      {error ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      ) : (
        <div 
          ref={containerRef} 
          className="w-full flex justify-center overflow-x-auto [&>svg]:max-w-full" 
        />
      )}
      {caption && (
        <p className="mt-2 text-center text-xs text-muted-foreground">
          {caption}
        </p>
      )}
    </div>
  );
}