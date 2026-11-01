import type { Course } from './types';
import { qaCourse } from './qa';
import { dockerCourse } from './docker';
import { k8sCourse } from './kubernetes';
import { agentsCourse } from './agents';
import { pythonCourse } from './python';
import { gitCourse } from './git';
import { linuxCourse } from './linux';
import { networksCourse } from './networks';
import { cicdCourse } from './cicd';
import { sqlCourse } from './sql';
import { designCourse } from './design';
import { validateAllCourses } from './validate';
import { courseSchema } from './schemas'; // <-- импорт схемы для кастомных курсов

// Базовые курсы
const baseCourses: Course[] = [
  gitCourse, linuxCourse, networksCourse, sqlCourse, pythonCourse,
  qaCourse, dockerCourse, k8sCourse, cicdCourse, agentsCourse, designCourse,
];

export const baseSlugs = new Set(baseCourses.map((c) => c.slug));

// Загружаем кастомные курсы из localStorage
function loadCustomCourses(): Course[] {
  try {
    const raw = localStorage.getItem('dev-academy-custom-courses');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    
    const valid: Course[] = [];
    for (const c of parsed) {
      const cleaned: Course = {
        ...c,
        modules: (c.modules || [])
          .map((m: any) => ({
            ...m,
            lessons: (m.lessons || []).filter((l: any) => l.steps && l.steps.length > 0),
          }))
          .filter((m: any) => m.lessons.length > 0),
      };
      
      if (cleaned.modules.length === 0) continue;
      
      const result = courseSchema.safeParse(cleaned);
      if (result.success) valid.push(result.data as Course);
      else console.warn('Кастомный курс не прошёл валидацию:', result.error.issues);
    }
    return valid;
  } catch {
    return [];
  }
}

// 1. Загружаем кастомные
const customCourses = loadCustomCourses();
const customSlugs = new Set(customCourses.map(c => c.slug));

// 2. Берём базовые, которых нет среди кастомных
const activeBaseCourses = baseCourses.filter(c => !customSlugs.has(c.slug));

// 3. Итоговый список: базовые + кастомные (которые заменяют базовые)
export const courses: Course[] = [...activeBaseCourses, ...customCourses];

validateAllCourses(activeBaseCourses);

export function getCourse(slug: string) {
  return courses.find((c) => c.slug === slug);
}

export * from './types';