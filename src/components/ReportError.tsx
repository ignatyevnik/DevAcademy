import { Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Course, Lesson, Step } from '@/data';
import { cn } from '@/lib/utils';

interface Props {
  course?: Course;
  lesson?: Lesson;
  step?: Step;
  stepIndex?: number;
  context?: string;
  className?: string; // <-- Добавили className
}

export function ReportError({ course, lesson, step, stepIndex, context, className }: Props) {
  const handleReport = () => {
    let title = '';
    let body = '';

    if (course && lesson && step) {
      title = `Ошибка в курсе: ${course.title} / ${lesson.title}`;
      body = `**Курс:** ${course.title}\n**Урок:** ${lesson.title}\n**Шаг:** ${step.title} (индекс: ${stepIndex})\n\n**Описание ошибки:**\n<!-- Опишите, что не так -->\n\n**Предложение:**\n<!-- Как правильно? -->`;
    } else {
      title = `Ошибка на сайте ${context ? `(${context})` : ''}`;
      body = `**Где:** ${context || 'Общий интерфейс'}\n\n**Описание ошибки:**\n<!-- Опишите, что не так -->`;
    }
    
    const repoUrl = 'https://github.com/ignatyevnik/DevAcademy/issues/new';
    const url = `${repoUrl}?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
    window.open(url, '_blank');
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleReport}
      className={cn(
        "text-muted-foreground hover:text-destructive hover:border-destructive/40 hover:bg-destructive/5 h-auto py-2 px-3 text-xs transition-colors",
        className
      )}
    >
      <Flag className="h-3.5 w-3.5 mr-1.5" />
      {context ? `Ошибка (${context})` : 'Сообщить об ошибке'}
    </Button>
  );
}