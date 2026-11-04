import { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { sql, SQLite } from '@codemirror/lang-sql';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import { keymap } from '@codemirror/view';

// Лениво грузим только сам React-компонент CodeMirror
const CodeMirror = lazy(() => import('@uiw/react-codemirror'));

interface Props {
  value: string;
  onChange: (val: string) => void;
  language: 'sql' | 'python';
  theme: 'light' | 'dark';
  onSubmit?: () => void;
  minHeight?: string;
}

export function LazyCodeMirror({
  value,
  onChange,
  language,
  theme,
  onSubmit,
  minHeight = '160px',
}: Props) {
  // Базовые расширения для языка
  const languageExt = language === 'sql' ? sql({ dialect: SQLite }) : python();

  // Перехват Ctrl+Enter / Cmd+Enter средствами CodeMirror
  const keymapExt = keymap.of([
    {
      key: 'Ctrl-Enter',
      mac: 'Cmd-Enter',
      run: () => {
        if (onSubmit) onSubmit();
        return true; // Предотвращаем стандартное поведение (перенос строки)
      },
    },
  ]);

  return (
    <Suspense
      fallback={
        <div
          className="flex items-center gap-2 p-4 text-sm text-muted-foreground border border-border rounded-lg bg-background"
          style={{ minHeight }}
        >
          <Loader2 className="h-4 w-4 animate-spin" /> Загрузка редактора…
        </div>
      }
    >
      <CodeMirror
        value={value}
        onChange={onChange}
        extensions={[languageExt, keymapExt]}
        theme={theme === 'dark' ? oneDark : 'light'}
        minHeight={minHeight}
        basicSetup={{
          lineNumbers: true,
          foldGutter: true,
          highlightActiveLine: true,
          autocompletion: true,
        }}
        className="text-sm font-mono border border-input rounded-lg overflow-hidden"
      />
    </Suspense>
  );
}