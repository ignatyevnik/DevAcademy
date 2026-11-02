export type TextBlock =
  | { type: 'p'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'code'; lang: string; code: string; caption?: string }
  | { type: 'note'; text: string }
  | { type: 'table'; head: string[]; rows: string[][]; caption?: string }
    | { type: 'image'; src: string; alt: string; caption?: string }
  | { type: 'mermaid'; code: string; caption?: string };

export interface QuizBase {
  question: string;
  explanation: string;
}

export interface SingleQuiz extends QuizBase {
  kind: 'single';
  options: { id: string; text: string }[];
  correct: [string];
}

export interface MultipleQuiz extends QuizBase {
  kind: 'multiple';
  options: { id: string; text: string }[];
  correct: string[];
  /** если true — частично верный ответ (без ложных выборов) даёт partial, а не fail */
  partial?: boolean;
}

export interface FillQuiz extends QuizBase {
  kind: 'fill';
  accepted: string[];
  placeholder?: string;
  hint?: string;
}

export interface MatchingQuiz extends QuizBase {
  kind: 'matching';
  pairs: { left: string; right: string }[];
  /** перемешивать правую колонку (по умолчанию true) */
  shuffle?: boolean;
}

export type Quiz =
  | SingleQuiz
  | MultipleQuiz
  | FillQuiz
  | MatchingQuiz
  | SortingQuiz
  | TableQuiz
  | NumberQuiz
  | ClozeQuiz
  | CodeQuiz;

export type Step =
  | { id: string; title: string; type: 'theory'; blocks: TextBlock[] }
  | { id: string; title: string; type: 'quiz'; quiz: Quiz };

export interface Lesson {
  id: string;
  title: string;
  minutes: number;
  steps: Step[];
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export type CourseIcon = 'flask' | 'docker' | 'helm' | 'bot' | 'python' | 'git' | 'linux' | 'network' | 'cicd' | 'sql' | 'design';

export interface Course {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  level: 'Новичок' | 'Средний' | 'Продвинутый';
  tags: string[];
  accent: string;
  icon: CourseIcon;
  modules: Module[];
  outcomes: string[];
  requirements: string[];
}

export function courseStats(course: Course) {
  let lessons = 0;
  let steps = 0;
  for (const m of course.modules) {
    lessons += m.lessons.length;
    for (const l of m.lessons) steps += l.steps.length;
  }
  return { lessons, steps };
}

export function findLesson(course: Course, lessonId: string) {
  for (const m of course.modules) {
    const lesson = m.lessons.find((l) => l.id === lessonId);
    if (lesson) return { module: m, lesson };
  }
  return null;
}

export function allLessons(course: Course): Lesson[] {
  return course.modules.flatMap((m) => m.lessons);
}

export interface SortingQuiz extends QuizBase {
  kind: 'sorting';
  items: string[];
  correct: string[];
}

export interface TableQuiz extends QuizBase {
  kind: 'table';
  columns: string[];
  rows: { label: string; correct: string[] }[];
}

export interface NumberQuiz extends QuizBase {
  kind: 'number';
  correct: number;
  tolerance?: number;
  placeholder?: string;
}

export interface ClozeQuiz extends QuizBase {
  kind: 'cloze';
  text: string; // содержит ____ для пропусков
  blanks: { accepted: string[]; hint?: string }[];
}

export interface CodeQuiz extends QuizBase {
  kind: 'code';
  starterCode?: string;
  placeholder?: string;
  mustInclude: { pattern: string; message: string }[];
  mustNotInclude?: { pattern: string; message: string }[];
}

