import { Link, useLocation, useNavigate } from 'react-router';
import { useState, useMemo } from 'react';
import { Search, GraduationCap, Menu, X, Bookmark } from 'lucide-react';
import { useSearch } from '@/components/SearchProvider';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useProgress } from '@/lib/progress';
import { courses, allLessons } from '@/data';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { openSearch } = useSearch();
  const { state } = useProgress(); 

  // Считаем общий прогресс по всем курсам
  const globalPct = useMemo(() => {
    let total = 0;
    let done = 0;
    for (const c of courses) {
      for (const l of allLessons(c)) {
        total += l.steps.length;
        for (const s of l.steps) {
          if (state.done[`${c.slug}:${s.id}`]) done++;
        }
      }
    }
    return total > 0 ? Math.round((done / total) * 100) : 0;
  }, [state.done]);
  const bookmarksCount = Object.keys(state.bookmarks).length;

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
            Dev<span className="text-primary">Академия</span>
          </span>
        </Link>
        
        {globalPct > 0 && (
          <div className="hidden md:flex items-center gap-2 ml-2 pl-4 border-l border-border/50">
            <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary transition-[width] duration-300" style={{ width: `${globalPct}%` }} />
            </div>
            <span className="text-xs font-semibold text-muted-foreground">{globalPct}%</span>
          </div>
        )}

        <button
          type="button"
          onClick={openSearch}
          className="relative hidden flex-1 md:flex h-11 items-center gap-2 rounded-md border border-input bg-transparent px-3 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Search className="h-4 w-4 shrink-0" />
          <span className="flex-1 text-left">Поиск по урокам...</span>
          <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            Ctrl K
          </kbd>
        </button>

        <nav className="ml-auto hidden items-center gap-1 md:flex">
          <button
            type="button"
            onClick={goMyCourses}
            className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Моё обучение
          </button>
          
          {/* ВОЗВРАЩАЕМ ПЕРЕКЛЮЧАТЕЛЬ ТЕМЫ СЮДА */}
          <ThemeToggle />

          <Link
            to="/bookmarks"
            className="relative grid h-9 w-9 place-items-center rounded-md hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Закладки"
          >
            <Bookmark className="h-5 w-5 text-muted-foreground" />
            {bookmarksCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                {bookmarksCount > 9 ? '9+' : bookmarksCount}
              </span>
            )}
          </Link>
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
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              openSearch();
            }}
            className="flex w-full h-11 items-center gap-2 rounded-md border border-input bg-transparent px-3 text-sm text-muted-foreground hover:bg-accent"
          >
            <Search className="h-4 w-4" />
            Поиск по урокам...
          </button>
          <div className="mt-2 flex flex-col">
            <button
              type="button"
              onClick={goMyCourses}
              className="rounded-md px-3 py-3 text-left text-sm font-medium hover:bg-accent"
            >
              Моё обучение
            </button>
            {/* Переключатель в мобильном меню */}
            <div className="flex items-center px-3 py-1">
               <ThemeToggle />
               <span className="ml-2 text-sm font-medium">Сменить тему</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}