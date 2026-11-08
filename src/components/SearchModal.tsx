import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Search, X, BookOpen, HelpCircle } from 'lucide-react';
import { searchContent } from '@/lib/search';
import { useDeferredValue } from 'react';
import { cn } from '@/lib/utils';

function highlightMatch(text: string, query: string) {
  if (!query.trim()) return text;
  const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${safeQuery})`, 'gi');
  const parts = text.split(regex);
  
  return parts.map((part, i) => 
    regex.test(part) 
      ? <mark key={i} className="bg-yellow-200/80 text-black rounded-sm px-0.5">{part}</mark> 
      : part
  );
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const results = searchContent(deferredQuery);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setActiveIndex(0);
  }, [deferredQuery]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const res = results[activeIndex];
        if (res) {
          navigate(`/course/${res.courseSlug}/lesson/${res.lessonId}?step=${res.stepIndex}`);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, activeIndex, navigate, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-[10vh] px-4" role="dialog" aria-modal="true" aria-label="Поиск">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      
      <div className="relative w-full max-w-2xl overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
        <div className="flex items-center border-b border-border px-4">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по всем урокам и заданиям..."
            className="flex-1 bg-transparent px-4 py-4 text-base outline-none placeholder:text-muted-foreground"
          />
          <button onClick={onClose} className="rounded p-1 hover:bg-accent text-muted-foreground" aria-label="Закрыть">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {deferredQuery.length < 2 ? (
            <p className="p-4 text-center text-sm text-muted-foreground">
              Введите минимум 2 символа для поиска
            </p>
          ) : results.length === 0 ? (
            <p className="p-4 text-center text-sm text-muted-foreground">
              Ничего не найдено по запросу «{query}»
            </p>
          ) : (
            <ul className="space-y-1">
              {results.map((r, i) => (
                <li key={`${r.courseSlug}-${r.lessonId}-${r.stepIndex}`}>
                  <button
                    type="button"
                    onClick={() => {
                      navigate(`/course/${r.courseSlug}/lesson/${r.lessonId}?step=${r.stepIndex}`);
                      onClose();
                    }}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={cn(
                      'flex w-full flex-col gap-1 rounded-lg px-4 py-3 text-left transition-colors',
                      activeIndex === i ? 'bg-accent/60' : 'hover:bg-accent/30'
                    )}
                  >
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {r.matchType === 'quiz' ? (
                        <HelpCircle className="h-3.5 w-3.5 text-primary" />
                      ) : (
                        <BookOpen className="h-3.5 w-3.5 text-primary" />
                      )}
                      <span className="truncate">{r.courseTitle}</span>
                      <span>•</span>
                      <span className="truncate">{r.lessonTitle}</span>
                    </div>
                    <div className="text-sm font-medium">{r.stepTitle}</div>
                    <div className="text-xs text-muted-foreground line-clamp-2">
                      {highlightMatch(r.snippet, query)}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div className="border-t border-border bg-muted/30 px-4 py-2 text-xs text-muted-foreground flex justify-between">
          <span>↑ ↓ — навигация</span>
          <span>Enter — перейти</span>
          <span>Esc — закрыть</span>
        </div>
      </div>
    </div>
  );
}