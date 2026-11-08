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
    z.object({
    type: z.literal('image'),
    src: z.string().min(1),
    alt: z.string().min(1, 'Для изображения нужен alt-текст'),
    caption: z.string().optional(),
  }),
  z.object({
    type: z.literal('mermaid'),
    code: z.string().min(1, 'Нужен код диаграммы'),
    caption: z.string().optional(),
  }),
z.object({
  type: z.literal('sandbox'),
  sandbox: z.object({
    schema: z.string().min(1, 'sandbox.schema пустой'),
    task: z.string().min(1, 'sandbox.task пустой'),
    solution: z.string().min(1, 'sandbox.solution пустой'),
    expected: z
      .object({
        columns: z.array(z.string().min(1)).min(1),
        rows: z.array(z.array(z.union([z.string(), z.number(), z.null()]))),
        order: z.enum(['order', 'set']).optional(),
      })
      .optional(),
    forbidden: z.array(z.string()).optional(),
    hint: z.string().optional(),
    caption: z.string().optional(),
  }),
}),
z.object({
  type: z.literal("python"),
  python: z.object({
    starterCode: z.string().optional(),
    task: z.string().min(1, "python.task пустой"),
    solution: z.string().min(1, "python.solution пустой"),
    expected: z.discriminatedUnion("type", [
      z.object({
        type: z.literal("stdout"),
        value: z.string(),
        normalize: z.enum(["trim", "lines"]).optional(),
      }),
      z.object({
        type: z.literal("variable"),
        name: z.string().min(1),
        value: z.union([z.string(), z.number(), z.boolean()]),
      }),
    ]),
    hint: z.string().optional(),
    forbidden: z.array(z.string()).optional(),
    caption: z.string().optional(),
  }),
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

const sortingQuizSchema = z.object({
  kind: z.literal('sorting'),
  question: z.string().min(1),
  items: z.array(z.string().min(1)).min(2),
  correct: z.array(z.string().min(1)).min(2),
  explanation: z.string().min(1),
}).superRefine((q, ctx) => {
  if (q.items.length !== q.correct.length) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['correct'], message: 'items и correct должны быть одинаковой длины' });
  }
  if (JSON.stringify([...q.items].sort()) !== JSON.stringify([...q.correct].sort())) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['correct'], message: 'correct должен содержать те же элементы, что и items' });
  }
});

const tableQuizSchema = z.object({
  kind: z.literal('table'),
  question: z.string().min(1),
  columns: z.array(z.string().min(1)).min(1, 'table: нужна хотя бы 1 колонка'),
  rows: z.array(z.object({
    label: z.string().min(1),
    correct: z.array(z.string()),
  })).min(1, 'table: нужна хотя бы 1 строка'),
  explanation: z.string().min(1),
}).superRefine((q, ctx) => {
  const colSet = new Set(q.columns);
  for (let i = 0; i < q.rows.length; i++) {
    for (const c of q.rows[i].correct) {
      if (!colSet.has(c)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['rows', i, 'correct'],
          message: `rows[${i}].correct содержит "${c}", которого нет в columns. Доступные: ${q.columns.join(', ')}`,
        });
      }
    }
  }
});

const numberQuizSchema = z.object({
  kind: z.literal('number'),
  question: z.string().min(1),
  correct: z.number(),
  tolerance: z.number().nonnegative().optional(),
  placeholder: z.string().optional(),
  explanation: z.string().min(1),
});

const clozeQuizSchema = z.object({
  kind: z.literal('cloze'),
  question: z.string().min(1),
  text: z.string().min(1),
  blanks: z.array(z.object({
    accepted: z.array(z.string().min(1)).min(1),
    hint: z.string().optional(),
  })).min(1),
  explanation: z.string().min(1),
}).superRefine((q, ctx) => {
  const parts = q.text.split('____');
  if (parts.length - 1 !== q.blanks.length) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['text'], message: `Количество ____ (${parts.length - 1}) не совпадает с количеством blanks (${q.blanks.length})` });
  }
});

const codeQuizSchema = z.object({
  kind: z.literal('code'),
  question: z.string().min(1),
  starterCode: z.string().optional(),
  placeholder: z.string().optional(),
  mustInclude: z.array(z.object({
    pattern: z.string(),
    message: z.string(),
  })).min(1),
  mustNotInclude: z.array(z.object({
    pattern: z.string(),
    message: z.string(),
  })).optional(),
  explanation: z.string().min(1),
});

const quizSchema = z.discriminatedUnion('kind', [
  singleQuizSchema,
  multipleQuizSchema,
  fillQuizSchema,
  matchingQuizSchema,
  sortingQuizSchema,
  tableQuizSchema,
  numberQuizSchema,
  clozeQuizSchema,
  codeQuizSchema,
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
icon: z.enum(
  [
    'flask',
    'docker',
    'helm',
    'helm-advanced',
    'bot',
    'python',
    'python-advanced',
    'git',
    'linux',
    'network',
    'cicd', 
    'gitops',
    'terraform',
    'ansible',
    'kafka', 
    'sql',
    'sql-advanced',
    'design',
    'qa-automation',
    'qa-senior',
    'cs',
  ],
  {
    message:
      'icon должен быть: flask | docker | helm | helm-advanced | bot | python | python-advanced | git | ansible | kafka | linux | network | cicd | gitops | terraform | sql | sql-advanced | design | qa-automation | qa-senior',
  },
),
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