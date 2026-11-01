export interface TrackCourse {
  slug: string;
  label: string;
}

export interface Track {
  slug: string;
  title: string;
  description: string;
  courses: TrackCourse[];
}

export const tracks: Track[] = [
  {
    slug: 'qa',
    title: 'QA',
    description: 'Ручное тестирование, тест-дизайн, баг-репорты, API и UI-автотесты',
    courses: [
      { slug: 'git-basics', label: 'Git' },
      { slug: 'linux-basics', label: 'Linux' },
      { slug: 'networks-http', label: 'Сети' },
      { slug: 'sql-basics', label: 'SQL' },
      { slug: 'qa-testing', label: 'QA' },
    ],
  },
  {
    slug: 'qa-automation',
    title: 'QA Automation',
    description: 'QA + Python + Playwright: автотесты с нуля',
    courses: [
      { slug: 'git-basics', label: 'Git' },
      { slug: 'linux-basics', label: 'Linux' },
      { slug: 'networks-http', label: 'Сети' },
      { slug: 'sql-basics', label: 'SQL' },
      { slug: 'python-basics', label: 'Python' },
      { slug: 'qa-testing', label: 'QA' },
    ],
  },
  {
    slug: 'devops',
    title: 'DevOps',
    description: 'Linux, Docker, Kubernetes, CI/CD — от контейнера до продакшена',
    courses: [
      { slug: 'git-basics', label: 'Git' },
      { slug: 'linux-basics', label: 'Linux' },
      { slug: 'networks-http', label: 'Сети' },
      { slug: 'sql-basics', label: 'SQL' },
      { slug: 'docker-basics', label: 'Docker' },
      { slug: 'kubernetes-essentials', label: 'K8s' },
      { slug: 'cicd', label: 'CI/CD' },
    ],
  },
  {
    slug: 'backend-python',
    title: 'Backend Python',
    description: 'Python, API, контейнеры — для backend-разработки',
    courses: [
      { slug: 'git-basics', label: 'Git' },
      { slug: 'linux-basics', label: 'Linux' },
      { slug: 'python-basics', label: 'Python' },
      { slug: 'networks-http', label: 'Сети' },
      { slug: 'sql-basics', label: 'SQL' },
      { slug: 'docker-basics', label: 'Docker' },
      { slug: 'design-patterns', label: 'Проектирование' },
    ],
  },
  {
    slug: 'ai-engineer',
    title: 'AI Engineer',
    description: 'Python, LLM, RAG, MCP — для AI-инженера',
    courses: [
      { slug: 'git-basics', label: 'Git' },
      { slug: 'linux-basics', label: 'Linux' },
      { slug: 'python-basics', label: 'Python' },
      { slug: 'networks-http', label: 'Сети' },
      { slug: 'sql-basics', label: 'SQL' },
      { slug: 'docker-basics', label: 'Docker' },
      { slug: 'ai-agents', label: 'AI-агенты' },
    ],
  },
];