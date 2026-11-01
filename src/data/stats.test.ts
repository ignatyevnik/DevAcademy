import { describe, it, expect } from 'vitest';
import { courses, getCourse, courseStats, findLesson, allLessons } from './index';

describe('courses', () => {
  it('все slug уникальны', () => {
    const slugs = courses.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('getCourse возвращает курс по slug', () => {
    expect(getCourse('python-basics')?.slug).toBe('python-basics');
  });

  it('getCourse возвращает undefined для несуществующего', () => {
    expect(getCourse('nonexistent-slug')).toBeUndefined();
  });
});

describe('courseStats', () => {
  it('считает уроки и шаги для реального курса', () => {
    const course = getCourse('python-basics')!;
    const { lessons, steps } = courseStats(course);
    expect(lessons).toBeGreaterThan(0);
    expect(steps).toBeGreaterThanOrEqual(lessons);
  });

  it('курс без модулей → 0 / 0', () => {
    const course = getCourse('python-basics')!;
    expect(courseStats({ ...course, modules: [] })).toEqual({ lessons: 0, steps: 0 });
  });
});

describe('allLessons', () => {
  it('возвращает все уроки из всех модулей', () => {
    const course = getCourse('python-basics')!;
    expect(allLessons(course).length).toBe(
      course.modules.flatMap((m) => m.lessons).length,
    );
  });
});

describe('findLesson', () => {
  it('находит существующий урок', () => {
    const course = getCourse('python-basics')!;
    const first = allLessons(course)[0];
    expect(findLesson(course, first.id)?.lesson.id).toBe(first.id);
  });

  it('возвращает null для несуществующего', () => {
    const course = getCourse('python-basics')!;
    expect(findLesson(course, 'nonexistent-lesson')).toBeNull();
  });
});