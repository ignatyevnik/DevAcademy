import { describe, it, expect, vi } from 'vitest';
import { searchContent } from './search';

const { mockCourses } = vi.hoisted(() => ({
  mockCourses: [
    {
      slug: 'test-course',
      title: 'Тестовый курс',
      subtitle: '',
      description: '',
      level: 'Новичок',
      tags: [],
      accent: '#000',
      icon: 'python',
      outcomes: [],
      requirements: [],
      modules: [
        {
          id: 'mod-1',
          title: 'Модуль 1',
          lessons: [
            {
              id: 'les-1',
              title: 'Урок про Docker',
              minutes: 10,
              steps: [
                {
                  id: 'step-1',
                  title: 'Теория',
                  type: 'theory',
                  blocks: [
                    {
                      type: 'p',
                      text: 'Docker — это платформа контейнеризации.',
                    },
                  ],
                },
                {
                  id: 'step-2',
                  title: 'Квиз',
                  type: 'quiz',
                  quiz: {
                    kind: 'single',
                    question: 'Что такое Docker?',
                    options: [
                      { id: 'a', text: 'Платформа контейнеризации' },
                      { id: 'b', text: 'База данных' },
                    ],
                    correct: ['a'],
                    explanation: '',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}));

vi.mock('@/data', () => ({
  courses: mockCourses,
}));

describe('searchContent', () => {
  it('возвращает пустой массив для запроса короче 2 символов', () => {
    expect(searchContent('')).toEqual([]);
    expect(searchContent('a')).toEqual([]);
  });

  it('находит совпадение в тексте теории', () => {
    const results = searchContent('контейнеризации');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].matchType).toBe('theory');
    expect(results[0].courseSlug).toBe('test-course');
  });

  it('находит совпадение в квизе', () => {
    const results = searchContent('Docker');
    const quizResult = results.find((r) => r.matchType === 'quiz');
    expect(quizResult).toBeDefined();
    expect(quizResult?.lessonTitle).toBe('Урок про Docker');
  });

  it('находит совпадение по заголовку урока', () => {
    const results = searchContent('урок');
    const titleResult = results.find((r) => r.matchType === 'title');
    expect(titleResult).toBeDefined();
    expect(titleResult?.stepIndex).toBe(0);
  });

  it('возвращает не более 30 результатов', () => {
    const results = searchContent('Docker');
    expect(results.length).toBeLessThanOrEqual(30);
  });
});