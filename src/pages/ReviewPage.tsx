import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useProgress } from '@/lib/progress';
import { QuizView } from '@/components/StepContent';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ReviewPage() {
  const { getDueReviews } = useProgress();
  const [cards] = useState(() => getDueReviews());
  const [index, setIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const navigate = useNavigate();

  const current = cards[index];

  const handleNext = () => {
    if (index < cards.length - 1) {
      setIndex(i => i + 1);
      setAnswered(false);
    } else {
      toast.success('Отличная работа! Все повторено.');
      navigate('/');
    }
  };

  if (!current) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center p-4">
        <CheckCircle2 className="h-16 w-16 text-primary mb-4" />
        <h1 className="text-2xl font-bold">Все повторено!</h1>
        <p className="text-muted-foreground mt-2">Возвращайтесь завтра.</p>
        <Button asChild className="mt-6"><Link to="/">На главную</Link></Button>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-3xl items-center gap-2 px-4">
          <button onClick={() => navigate('/')} className="grid h-10 w-10 place-items-center rounded-md hover:bg-accent">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Повторение</p>
            <p className="text-sm font-bold truncate">{current.courseTitle}</p>
          </div>
          <div className="text-sm font-medium text-muted-foreground">
            {index + 1} / {cards.length}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 pb-24">
        <QuizView 
          slug={current.slug} 
          step={current.step} 
          onResult={() => setAnswered(true)} 
        />
        
        {answered && (
          <div className="mt-6 flex justify-end">
            <Button onClick={handleNext} className="min-h-[44px]">
              {index < cards.length - 1 ? 'Следующий' : 'Завершить'}
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}