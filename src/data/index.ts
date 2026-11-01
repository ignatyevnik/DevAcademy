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

export const courses: Course[] = [gitCourse, linuxCourse, networksCourse, sqlCourse, pythonCourse, qaCourse, dockerCourse, k8sCourse, cicdCourse, agentsCourse, designCourse];

// Валидация при загрузке модуля — упадёт с понятной ошибкой, если контент сломан
validateAllCourses(courses);

export function getCourse(slug: string) {
  return courses.find((c) => c.slug === slug);
}

export * from './types';
