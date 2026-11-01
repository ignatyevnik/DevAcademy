import { Link, useLocation, useNavigate } from 'react-router';
import { useState } from 'react';
import { Search, GraduationCap, Menu, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  query?: string;
  onSearch?: (q: string) => void;
}

export function Header({ query = '', onSearch }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [localQuery, setLocalQuery] = useState(query);

  // Синхронизация с внешним query (URL)
  if (query !== localQuery) setLocalQuery(query);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(localQuery);
    else navigate(`/?q=${encodeURIComponent(localQuery)}`);
  };

  const goMyCourses = () => {
    setMobileOpen(false);
    const scroll = () => {
      const el = document.getElementById('my-courses') ?? document.getElementById('catalog');
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(scroll, 120);
    } else {
      scroll();
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:gap-6">
        <Link to="/" className="flex min-h-[44px] items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary">
            <GraduationCap className="h-5 w-5 text-primary-foreground" aria-hidden="true" />
          </span>
          <span className="text-lg font-bold tracking-tight">
            Дев<span className="text-primary">Академия</span>
          </span>
        </Link>

        {onSearch && (
          <form onSubmit={submit} className="relative hidden flex-1 md:block" role="search">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              value={localQuery}
              onChange={(e) => { setLocalQuery(e.target.value); onSearch(e.target.value); }}
              placeholder="Поиск по курсам и темам…"
              className="h-11 pl-9"
              aria-label="Поиск по курсам"
            />
          </form>
        )}

        <nav className="ml-auto hidden items-center gap-1 md:flex">
          <Link to="/" className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            Каталог
          </Link>
          <button type="button" onClick={goMyCourses} className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            Моё обучение
          </button>
        </nav>

        <button
          type="button"
          className="ml-auto grid h-11 w-11 place-items-center rounded-md hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-card px-4 pb-4 pt-3 md:hidden">
          {onSearch && (
            <form onSubmit={submit} className="relative" role="search">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input
                value={localQuery}
                onChange={(e) => { setLocalQuery(e.target.value); onSearch(e.target.value); }}
                placeholder="Поиск по курсам и темам…"
                className="h-11 pl-9"
                aria-label="Поиск по курсам"
              />
            </form>
          )}
          <div className="mt-2 flex flex-col">
            <Link to="/" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-3 text-sm font-medium hover:bg-accent">
              Каталог
            </Link>
            <button type="button" onClick={goMyCourses} className="rounded-md px-3 py-3 text-left text-sm font-medium hover:bg-accent">
              Моё обучение
            </button>
          </div>
        </div>
      )}
    </header>
  );
}