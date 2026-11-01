import { z } from 'zod';
import type { Course } from './types';
import { courseSchema } from './schemas';

function formatIssue(slug: string, issue: z.ZodIssue): string {
  const path = issue.path.length > 0 ? issue.path.join('.') : '(корень)';
  return `  • [${slug}] ${path}\n      ${issue.message}`;
}

/**
 * Проверяет все курсы. Бросает Error с подробным списком проблем,
 * если хотя бы один курс не прошёл валидацию.
 */
export function validateAllCourses(courses: Course[]): void {
  const errors: string[] = [];

  for (const course of courses) {
    const result = courseSchema.safeParse(course);
    if (!result.success) {
      const slug = (course as { slug?: string })?.slug ?? '(без slug)';
      for (const issue of result.error.issues) {
        errors.push(formatIssue(slug, issue));
      }
    }
  }

  // Уникальность slug между курсами
  const slugs = courses.map((c) => c.slug);
  const seen = new Set<string>();
  const dups = new Set<string>();
  for (const s of slugs) {
    if (seen.has(s)) dups.add(s);
    seen.add(s);
  }
  if (dups.size > 0) {
    errors.push(`  • (глобально) Дубли slug между курсами: ${[...dups].join(', ')}`);
  }

  if (errors.length === 0) return;

  const header = `\n\n❌ Ошибки валидации контента (${errors.length}):\n`;
  const footer = `\n\nИсправьте данные в src/data/*.ts и перезагрузите страницу.\n`;
  throw new Error(header + errors.join('\n') + footer);
}