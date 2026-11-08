export type CategoryId =
  | 'fundamentals'
  | 'data'
  | 'languages'
  | 'qa'
  | 'containers'
  | 'iac'
  | 'delivery'
  | 'ai'
  | 'architecture';

export interface Category {
  id: CategoryId;
  title: string;
  description: string;
}

/** Порядок категорий на главной */
export const categories: Category[] = [
  { id: 'fundamentals', title: 'Фундамент',          description: 'Git, Linux, сети — нужны везде' },
  { id: 'data',         title: 'Данные',             description: 'SQL и PostgreSQL' },
  { id: 'languages',    title: 'Языки',              description: 'Python от основ до продвинутого' },
  { id: 'qa',           title: 'QA',                 description: 'Тестирование, автоматизация, senior' },
  { id: 'containers',   title: 'Контейнеры',         description: 'Docker и Kubernetes' },
  { id: 'iac',          title: 'IaC и автоматизация',description: 'Terraform и Ansible' },
  { id: 'delivery',     title: 'CI/CD и доставка',   description: 'Пайплайны, GitOps, Kafka' },
  { id: 'ai',           title: 'AI',                 description: 'LLM-агенты' },
  { id: 'architecture', title: 'Архитектура',        description: 'SOLID и паттерны' },
];

/** slug → category. Кастомные курсы без записи попадают в «Мои курсы» */
export const courseCategory: Record<string, CategoryId> = {
  'cs-basics':           'fundamentals',
  'git-basics':          'fundamentals',
  'linux-basics':        'fundamentals',
  'networks-http':       'fundamentals',

  'sql-basics':          'data',
  'sql-advanced':        'data',
  'postgresql-deep':     'data',

  'python-basics':       'languages',
  'python-advanced':     'languages',

  'qa-fundamentals':     'qa',
  'qa-automation':       'qa',
  'qa-senior':           'qa',

  'docker-basics':       'containers',
  'kubernetes-basics':   'containers',
  'kubernetes-advanced': 'containers',

  'terraform-basics':    'iac',
  'ansible-basics':      'iac',

  'cicd-basics':         'delivery',
  'gitops':              'delivery',
  'kafka-basics':        'delivery',

  'ai-agents':           'ai',

  'design-patterns':     'architecture',
};