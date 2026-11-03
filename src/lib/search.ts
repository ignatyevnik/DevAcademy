import { courses } from '@/data';
import type { TextBlock } from '@/data';

export interface SearchResult {
  courseSlug: string;
  courseTitle: string;
  lessonId: string;
  lessonTitle: string;
  stepIndex: number;
  stepTitle: string;
  snippet: string;
  matchType: 'theory' | 'quiz' | 'title';
}

/** Рекурсивно собирает весь текст из блоков теории */
function extractText(blocks: TextBlock[]): string {
  return blocks
    .map((b) => {
      switch (b.type) {
        case 'p':
        case 'h3':
        case 'note':
          return b.text;
        case 'list':
          return b.items.join(' ');
        case 'code':
          return b.code;
        case 'sandbox':                                        // ← добавить
          return `${b.sandbox.task} ${b.sandbox.solution}`; 
        case "python":
          return `${b.python.task} ${b.python.solution}`;
        case 'table':
          return [...b.head, ...b.rows.flat()].join(' ');
        default:
          return '';
      }
    })
    .join(' ');
}

function getSnippet(text: string, query: string): string {
  const idx = text.toLowerCase().indexOf(query);
  if (idx === -1) return text.slice(0, 80) + '...';
  const start = Math.max(0, idx - 30);
  const end = Math.min(text.length, idx + query.length + 50);
  return (start > 0 ? '...' : '') + text.slice(start, end) + (end < text.length ? '...' : '');
}

export function searchContent(query: string): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];

  const results: SearchResult[] = [];

  for (const course of courses) {
    for (const mod of course.modules) {
      for (const lesson of mod.lessons) {
        lesson.steps.forEach((step, stepIndex) => {
          let searchableText = '';
          let matchType: SearchResult['matchType'] = 'theory';

          if (step.type === 'theory') {
            searchableText = extractText(step.blocks);
          } else if (step.type === 'quiz') {
            matchType = 'quiz';
            if (step.quiz.kind === 'fill') {
              searchableText = step.quiz.question + ' ' + step.quiz.accepted.join(' ');
            } else if (step.quiz.kind === 'cloze') {
              searchableText = step.quiz.question + ' ' + step.quiz.text + ' ' + step.quiz.blanks.map((b) => b.accepted.join(' ')).join(' ');
            } else if (step.quiz.kind === 'code') {
              searchableText = step.quiz.question + ' ' + (step.quiz.starterCode || '');
            } else if (step.quiz.kind === 'number') {
              searchableText = step.quiz.question + ' ' + step.quiz.correct;
            } else if ('options' in step.quiz) {
              searchableText = step.quiz.question + ' ' + step.quiz.options.map((o) => o.text).join(' ');
            } else if ('pairs' in step.quiz) {
              searchableText = step.quiz.question + ' ' + step.quiz.pairs.map((p) => `${p.left} ${p.right}`).join(' ');
            } else if ('items' in step.quiz) {
              searchableText = step.quiz.question + ' ' + step.quiz.items.join(' ');
            }
          }

          if (searchableText.toLowerCase().includes(q)) {
            results.push({
              courseSlug: course.slug,
              courseTitle: course.title,
              lessonId: lesson.id,
              lessonTitle: lesson.title,
              stepIndex,
              stepTitle: step.title,
              snippet: getSnippet(searchableText, q),
              matchType,
            });
          } else if (lesson.title.toLowerCase().includes(q) && stepIndex === 0) {
            results.push({
              courseSlug: course.slug,
              courseTitle: course.title,
              lessonId: lesson.id,
              lessonTitle: lesson.title,
              stepIndex: 0,
              stepTitle: step.title,
              snippet: lesson.title,
              matchType: 'title',
            });
          }
        });
      }
    }
  }

  const unique = new Map<string, SearchResult>();
  for (const r of results) {
    const key = `${r.courseSlug}-${r.lessonId}-${r.stepIndex}`;
    if (!unique.has(key)) unique.set(key, r);
  }

  return Array.from(unique.values()).slice(0, 30);
}