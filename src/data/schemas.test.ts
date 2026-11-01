import { describe, it, expect } from 'vitest';
import { courses } from './index';
import { courseSchema } from './schemas';

describe('схемы контента', () => {
  for (const course of courses) {
    it(`курс "${course.slug}" проходит валидацию`, () => {
      const result = courseSchema.safeParse(course);
      if (!result.success) {
        const problems = result.error.issues
          .map((i) => `  ${i.path.join('.')}: ${i.message}`)
          .join('\n');
        throw new Error(`Валидация не прошла:\n${problems}`);
      }
      expect(result.success).toBe(true);
    });
  }
});