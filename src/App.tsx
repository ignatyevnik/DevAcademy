import { SearchProvider } from '@/components/SearchProvider';
import { Routes, Route, useLocation } from 'react-router';
import { useEffect } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { ProgressProvider } from '@/lib/progress';
import { ThemeProvider, useTheme } from '@/lib/theme';
import Home from './pages/Home';
import CoursePage from './pages/CoursePage';
import LessonPage from './pages/LessonPage';
import ReviewPage from './pages/ReviewPage';

function ScrollToTop() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);
  return null;
}

function AppContent() {
  const { theme } = useTheme();
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/course/:slug" element={<CoursePage />} />
        <Route path="/course/:slug/lesson/:lessonId" element={<LessonPage />} />
        <Route path="*" element={<Home />} />
        <Route path="/review" element={<ReviewPage />} />
      </Routes>
      <Toaster theme={theme} position="top-center" richColors closeButton />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ProgressProvider>
        <SearchProvider>
        <AppContent />
        </SearchProvider>
      </ProgressProvider>
    </ThemeProvider>
  );
}