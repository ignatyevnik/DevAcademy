import { describe, it, expect } from 'vitest';
import { pickQuestions } from './ExamPage';
import type { Lesson, Module, Step } from '@/data/types';

function makeQuizStep(id: string): Step {
  return {
    id,
    title: `Шаг ${id}`,
    type: 'quiz',
    quiz: {
      kind: 'single',
      question: 'Вопрос?',
      options: [
        { id: 'a', text: 'Да' },
        { id: 'b', text: 'Нет' },
      ],
      correct: ['a'] as [string],
      explanation: '',
    },
  };
}

function makeLesson(id: string, quizCount: number): Lesson {
  const steps: Step[] = [];
  for (let i = 0; i < quizCount; i++) {
    steps.push(makeQuizStep(`${id}-s${i}`));
  }
  return {
    id,
    title: `Урок ${id}`,
    minutes: 10,
    steps,
  };
}

function makeModules(lessons: Lesson[]): Module[] {
  return [{ id: 'mod-1', title: 'Модуль', lessons }];
}

describe('pickQuestions', () => {
  it('возвращает все вопросы, если их меньше или равно 20', () => {
    const result = pickQuestions(makeModules([makeLesson('les-1', 5)]));
    expect(result).toHaveLength(5);
    expect(result.every((q) => q.step.type === 'quiz')).toBe(true);
  });

  it('возвращает ровно 20 вопросов, если их больше 20', () => {
    const lessons = Array.from({ length: 5 }, (_, i) =>
      makeLesson(`les-${i}`, 10),
    );
    const result = pickQuestions(makeModules(lessons));
    expect(result).toHaveLength(20);
  });

  it('перемешивает вопросы (порядок не совпадает с исходным)', () => {
    const lessons = Array.from({ length: 5 }, (_, i) =>
      makeLesson(`les-${i}`, 10),
    );
    const result1 = pickQuestions(makeModules(lessons));
    const result2 = pickQuestions(makeModules(lessons));
    expect(result1.map((q) => q.step.id)).not.toEqual(
      result2.map((q) => q.step.id),
    );
  });

  it('не включает шаги типа theory', () => {
    const lessons: Lesson[] = [
      {
        id: 'les-1',
        title: 'Урок',
        minutes: 10,
        steps: [
          {
            id: 'theory-1',
            title: 'Теория',
            type: 'theory',
            blocks: [{ type: 'p', text: 'Текст' }],
          },
          makeQuizStep('quiz-1'),
        ],
      },
    ];
    const result = pickQuestions(makeModules(lessons));
    expect(result).toHaveLength(1);
    expect(result[0].step.id).toBe('quiz-1');
  });
});