import { useState } from 'react';
import { Highlight, Prism, type PrismTheme } from 'prism-react-renderer';
import { Check, Copy } from 'lucide-react';
import { toast } from 'sonner';

// В базовом пакете нет грамматики Dockerfile — регистрируем вручную
if (!Prism.languages.dockerfile) {
  Prism.languages.dockerfile = {
    comment: /#.*/,
    string: {
      pattern: /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
      greedy: true,
    },
    keyword:
      /\b(?:ADD|ARG|CMD|COPY|ENTRYPOINT|ENV|EXPOSE|FROM|HEALTHCHECK|LABEL|MAINTAINER|ONBUILD|RUN|SHELL|STOPSIGNAL|USER|VOLUME|WORKDIR)\b/i,
    variable: /\$(?:\w+|\{[^}]+\})/,
    punctuation: /[\\[\]{}]/,
  };
}

// Инициализация INI-грамматики (pytest.ini, mypy.ini, setup.cfg)
if (!Prism.languages.ini) {
  Prism.languages.ini = {
    comment: /^\s*[;#].*$/m,
    section: {
      pattern: /^\s*\[[^\]]+\]/m,
      alias: 'keyword',
    },
    key: {
      pattern: /^\s*[^\s=:]+(?=\s*[=:])/m,
      alias: 'attr-name',
    },
    value: {
      pattern: /(?<==|:)\s*[^\n]*/,
      alias: 'string',
    },
    punctuation: /[=:]/,
  };
}

// Маппинг «наших» имён языков → идентификаторы Prism
const LANG_MAP: Record<string, string> = {
  python: 'python',
  py: 'python',
  yaml: 'yaml',
  yml: 'yaml',
  bash: 'bash',
  sh: 'bash',
  shell: 'bash',
  zsh: 'bash',
  json: 'json',
  dockerfile: 'dockerfile',
  docker: 'dockerfile',
  markdown: 'markdown',
  md: 'markdown',
  html: 'markup',
  xml: 'markup',
  js: 'javascript',
  javascript: 'javascript',
  ts: 'typescript',
  typescript: 'typescript',
  sql: 'sql',
  ini: 'ini',
  text: 'text',
  txt: 'text',
};

// Тёмная тема под текущую палитру (bg #17211c)
const codeTheme: PrismTheme = {
  plain: { color: '#d9e7de', backgroundColor: '#17211c' },
  styles: [
    {
      types: ['comment', 'prolog', 'doctype', 'cdata'],
      style: { color: '#7a9986', fontStyle: 'italic' },
    },
    { types: ['punctuation'], style: { color: '#8fae9c' } },
    { types: ['namespace'], style: { opacity: 0.7 } },
    { types: ['deleted', 'tag'], style: { color: '#ff7b72' } },
    { types: ['boolean', 'number', 'constant'], style: { color: '#79c0ff' } },
    {
      types: ['selector', 'attr-name', 'string', 'char', 'builtin', 'inserted'],
      style: { color: '#a5d6a7' },
    },
    { types: ['operator', 'entity', 'url'], style: { color: '#b8c4d8' } },
    { types: ['atrule', 'attr-value', 'keyword'], style: { color: '#ff7b72' } },
    { types: ['function', 'class-name'], style: { color: '#d2a8ff' } },
    { types: ['regex', 'important', 'variable'], style: { color: '#ffa657' } },
    { types: ['property'], style: { color: '#b8c4d8' } },
  ],
};

interface CodeBlockProps {
  code: string;
  lang: string;
  caption?: string;
}

export function CodeBlock({ code, lang, caption }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const prismLang = LANG_MAP[lang] ?? 'text';
  const isPlain = prismLang === 'text';

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success('Код скопирован');
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error('Не удалось скопировать');
    }
  };

  return (
    <figure className="code-block">
      <div className="flex items-center justify-between gap-2 border-b border-white/10 px-4 py-2">
        <span className="text-[11px] font-medium uppercase tracking-wider text-[#8fae9c]">
          {caption ?? (isPlain ? 'текст' : lang)}
        </span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium text-[#8fae9c] transition-colors hover:bg-white/5 hover:text-[#d9e7de] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          aria-label="Скопировать код"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
              Скопировано
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" aria-hidden="true" />
              Копировать
            </>
          )}
        </button>
      </div>

      {isPlain ? (
        <pre>
          {(() => {
            const lines = code.split('\n');
            const showNumbers = lines.length >= 5;
            if (!showNumbers) {
              return <code>{code}</code>;
            }
            return lines.map((line, i) => (
              <div key={i} className="whitespace-pre">
                <span
                  className="sticky left-0 inline-block w-9 shrink-0 select-none bg-[#17211c] pr-2 text-right text-[#4a5f52] tabular-nums"
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                {line}
              </div>
            ));
          })()}
        </pre>
      ) : (
        <Highlight prism={Prism} code={code} language={prismLang} theme={codeTheme}>
          {({ tokens, getLineProps, getTokenProps }) => {
            const showNumbers = tokens.length >= 5;
            return (
              <pre>
                {tokens.map((line, i) => {
                  const lineProps = getLineProps({ line });
                  return (
                    <div key={i} {...lineProps}>
                      {showNumbers && (
                        <span
                          className="sticky left-0 inline-block w-9 shrink-0 select-none bg-[#17211c] pr-2 text-right text-[#4a5f52] tabular-nums"
                          aria-hidden="true"
                        >
                          {i + 1}
                        </span>
                      )}
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({ token })} />
                      ))}
                    </div>
                  );
                })}
              </pre>
            );
          }}
        </Highlight>
      )}
    </figure>
  );
}