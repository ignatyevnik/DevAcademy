import { Routes, Route, useLocation } from 'react-router';
import { useEffect } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { ProgressProvider } from '@/lib/progress';
import Home from './pages/Home';
import CoursePage from './pages/CoursePage';
import LessonPage from './pages/LessonPage';

function ScrollToTop() {
  const { pathname, search } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname, search]);
  return null;
}

export default function App() {
  return (
    <ProgressProvider>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/course/:slug" element={<CoursePage />} />
        <Route path="/course/:slug/lesson/:lessonId" element={<LessonPage />} />
        <Route path="*" element={<Home />} />
      </Routes>
      <Toaster theme="light" position="top-center" richColors closeButton />
    </ProgressProvider>
  );
}