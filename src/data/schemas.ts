import { z } from 'zod';

// ─────────────────────────────────────────────
// TextBlock — блоки теории
// ─────────────────────────────────────────────
const textBlockSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('p'),
    text: z.string().min(1, 'p.text не может быть пустым'),
  }),
  z.object({
    type: z.literal('h3'),
    text: z.string().min(1, 'h3.text не может быть пустым'),
  }),
  z.object({
    type: z.literal('list'),
    items: z.array(z.string().min(1, 'list: пустой пункт')).min(1, 'list: нужен хотя бы 1 пункт'),
  }),
  z.object({
    type: z.literal('code'),
    lang: z.string().min(1, 'code.lang не может быть пустым'),
    code: z.string().min(1, 'code.code не может быть пустым'),
    caption: z.string().optional(),
  }),
  z.object({
    type: z.literal('note'),
    text: z.string().min(1, 'note.text не может быть пустым'),
  }),
  z.object({
    type: z.literal('table'),
    head: z.array(z.string().min(1, 'table.head: пустая колонка')).min(1, 'table: нужен хотя бы 1 столбец'),
    rows: z.array(z.array(z.string())).min(1, 'table: нужна хотя бы 1 строка'),
    caption: z.string().optional(),
  }),
]);

// ─────────────────────────────────────────────
// Quiz — проверка `correct ∈ options`
// ─────────────────────────────────────────────
function refineCorrectInOptions(
  q: { options: { id: string; text: string }[]; correct: string[] },
  ctx: z.RefinementCtx,
) {
  const ids = q.options.map((o) => o.id);
  const idSet = new Set(ids);

  if (idSet.size !== ids.length) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['options'],
      message: `option.id должны быть уникальны (найдено ${ids.length}, уникальных ${idSet.size}): ${ids.join(', ')}`,
    });
  }

  for (const c of q.correct) {
    if (!idSet.has(c)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['correct'],
        message: `correct "${c}" отсутствует в options. Доступные id: ${ids.join(', ') || '(нет)'}`,
      });
    }
  }
}

const optionsListSchema = z
  .array(z.object({ id: z.string().min(1), text: z.string().min(1) }))
  .min(2, 'нужно минимум 2 варианта');

const singleQuizSchema = z
  .object({
    kind: z.literal('single'),
    question: z.string().min(1, 'question не может быть пустым'),
    options: optionsListSchema,
    correct: z.array(z.string()).length(1, 'single: ровно 1 правильный ответ в correct'),
    explanation: z.string().min(1, 'explanation не может быть пустым'),
  })
  .superRefine(refineCorrectInOptions);

const multipleQuizSchema = z
  .object({
    kind: z.literal('multiple'),
    question: z.string().min(1, 'question не может быть пустым'),
    options: optionsListSchema,
    correct: z.array(z.string()).min(1, 'multiple: нужен хотя бы 1 правильный ответ в correct'),
    explanation: z.string().min(1, 'explanation не может быть пустым'),
    partial: z.boolean().optional(),
  })
  .superRefine(refineCorrectInOptions);

const fillQuizSchema = z.object({
  kind: z.literal('fill'),
  question: z.string().min(1, 'question не может быть пустым'),
  accepted: z.array(z.string().min(1, 'fill.accepted: пустой вариант')).min(1, 'fill: нужен хотя бы 1 accepted'),
  placeholder: z.string().optional(),
  hint: z.string().optional(),
  explanation: z.string().min(1, 'explanation не может быть пустым'),
});

const matchingQuizSchema = z
  .object({
    kind: z.literal('matching'),
    question: z.string().min(1, 'question не может быть пустым'),
    pairs: z
      .array(
        z.object({
          left: z.string().min(1, 'matching.pairs.left пустой'),
          right: z.string().min(1, 'matching.pairs.right пустой'),
        }),
      )
      .min(2, 'matching: нужно минимум 2 пары'),
    shuffle: z.boolean().optional(),
    explanation: z.string().min(1, 'explanation не может быть пустым'),
  })
  .superRefine((q, ctx) => {
    const rights = q.pairs.map((p) => p.right);
    if (new Set(rights).size !== rights.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['pairs'],
        message: 'matching.pairs.right должны быть уникальны (иначе при выборе в select один «правильный» вариант подойдёт к нескольким)',
      });
    }
  });

const quizSchema = z.discriminatedUnion('kind', [
  singleQuizSchema,
  multipleQuizSchema,
  fillQuizSchema,
  matchingQuizSchema,
]);

// ─────────────────────────────────────────────
// Step — discriminated union по `type`
// ─────────────────────────────────────────────
const stepSchema = z.discriminatedUnion('type', [
  z.object({
    id: z.string().min(1, 'step.id пустой'),
    title: z.string().min(1, 'step.title пустой'),
    type: z.literal('theory'),
    blocks: z.array(textBlockSchema).min(1, 'theory: нужен хотя бы 1 блок'),
  }),
  z.object({
    id: z.string().min(1, 'step.id пустой'),
    title: z.string().min(1, 'step.title пустой'),
    type: z.literal('quiz'),
    quiz: quizSchema,
  }),
]);

const lessonSchema = z
  .object({
    id: z.string().min(1, 'lesson.id пустой'),
    title: z.string().min(1, 'lesson.title пустой'),
    minutes: z.number().int('minutes — целое число').positive('minutes > 0'),
    steps: z.array(stepSchema).min(1, 'lesson: нужен хотя бы 1 шаг'),
  })
  .superRefine((l, ctx) => {
    const ids = l.steps.map((s) => s.id);
    if (new Set(ids).size !== ids.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['steps'],
        message: `step.id должны быть уникальны в уроке ${l.id}: ${ids.join(', ')}`,
      });
    }
  });

const moduleSchema = z
  .object({
    id: z.string().min(1, 'module.id пустой'),
    title: z.string().min(1, 'module.title пустой'),
    lessons: z.array(lessonSchema).min(1, 'module: нужен хотя бы 1 урок'),
  })
  .superRefine((m, ctx) => {
    const ids = m.lessons.map((l) => l.id);
    if (new Set(ids).size !== ids.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['lessons'],
        message: `lesson.id должны быть уникальны в модуле ${m.id}: ${ids.join(', ')}`,
      });
    }
  });

// ─────────────────────────────────────────────
// Course — верхний уровень
// ─────────────────────────────────────────────
export const courseSchema = z
  .object({
    slug: z
      .string()
      .min(1, 'slug пустой')
      .regex(/^[a-z0-9-]+$/, 'slug: только a-z, 0-9 и дефис'),
    title: z.string().min(1, 'title пустой'),
    subtitle: z.string().min(1, 'subtitle пустой'),
    description: z.string().min(1, 'description пустой'),
    level: z.enum(['Новичок', 'Средний', 'Продвинутый'], {
      message: 'level должен быть: Новичок | Средний | Продвинутый',
    }),
    tags: z.array(z.string().min(1, 'tags: пустой тег')).min(1, 'tags: нужен хотя бы 1 тег'),
    accent: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'accent: hex-цвет формата #RRGGBB'),
    icon: z.enum(['flask', 'docker', 'helm', 'bot', 'python', 'git', 'linux', 'network', 'cicd', 'sql', 'design'], {
      message: 'icon должен быть: flask | docker | helm | bot | python | git | linux | network | cicd | sql | design',
    }),
    modules: z.array(moduleSchema).min(1, 'course: нужен хотя бы 1 модуль'),
    outcomes: z.array(z.string().min(1, 'outcomes: пустой пункт')).min(1, 'outcomes: нужен хотя бы 1 пункт'),
    requirements: z
      .array(z.string().min(1, 'requirements: пустой пункт'))
      .min(1, 'requirements: нужен хотя бы 1 пункт'),
  })
  .superRefine((c, ctx) => {
    const ids = c.modules.map((m) => m.id);
    if (new Set(ids).size !== ids.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['modules'],
        message: `module.id должны быть уникальны: ${ids.join(', ')}`,
      });
    }
  });