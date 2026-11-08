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

// ─────────────────────────────────────────────
// Правило проекта: минимум 5 шагов в уроке
// Исключение: вводные уроки (*-l0) — могут быть короче
// ─────────────────────────────────────────────

describe('минимум 5 шагов в уроке', () => {
  it('все уроки, кроме вводных (*-l0), имеют ≥5 шагов', () => {
    const violations: string[] = [];

    for (const course of courses) {
      for (const mod of course.modules) {
        for (const lesson of mod.lessons) {
          if (lesson.id.endsWith('-l0')) continue;
          if (lesson.steps.length < 5) {
            violations.push(
              `  • ${course.slug} → ${mod.id} → ${lesson.id} («${lesson.title}»): ${lesson.steps.length} шагов`,
            );
          }
        }
      }
    }

    if (violations.length > 0) {
      throw new Error(
        `\n\n❌ Уроки с < 5 шагов (${violations.length}):\n` +
          violations.join('\n') +
          '\n\nДобавьте шаги или пометьте урок как вводный (*-l0).\n',
      );
    }

    expect(violations).toEqual([]);
  });
});