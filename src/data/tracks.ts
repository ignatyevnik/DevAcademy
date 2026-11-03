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
    title: 'QA: с нуля',
    description: 'Ручное тестирование, тест-дизайн, баг-репорты, первый автотест',
    courses: [
      { slug: 'git-basics', label: 'Git' },
      { slug: 'linux-basics', label: 'Linux' },
      { slug: 'networks-http', label: 'Сети' },
      { slug: 'sql-basics', label: 'SQL' },
      { slug: 'sql-advanced', label: 'SQL: продвинуто' },
      { slug: 'qa-fundamentals', label: 'QA: основы' },
    ],
  },
  {
    slug: 'qa-automation',
    title: 'QA Automation',
    description: 'Pytest, Playwright, API, SQL, нагрузка и безопасность',
// qa-automation:
courses: [
  { slug: 'git-basics', label: 'Git' },
  { slug: 'linux-basics', label: 'Linux' },
  { slug: 'networks-http', label: 'Сети' },
  { slug: 'sql-basics', label: 'SQL' },
  { slug: 'sql-advanced', label: 'SQL: продвинуто' },
  { slug: 'python-basics', label: 'Python: база' },
  { slug: 'python-advanced', label: 'Python: продвинуто' },
  { slug: 'qa-fundamentals', label: 'QA: основы' },
  { slug: 'qa-automation', label: 'QA: автоматизация' },
],
  },
  {
    slug: 'qa-senior',
    title: 'QA Senior',
    description: 'Стратегия, метрики, observability, менторство',
    courses: [
      { slug: 'qa-fundamentals', label: 'QA: основы' },
      { slug: 'qa-automation', label: 'QA: автоматизация' },
      { slug: 'qa-senior', label: 'QA: сеньор' },
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
    { slug: 'sql-advanced', label: 'SQL: продвинуто' },
    { slug: 'postgresql-deep', label: 'PostgreSQL: глубоко' },
    { slug: 'docker-basics', label: 'Docker' },
    { slug: 'kubernetes-basics', label: 'K8s: основы' },
    { slug: 'kubernetes-advanced', label: 'K8s: продвинуто' },
    { slug: 'terraform-basics', label: 'Terraform: IaC' },
    { slug: 'ansible-basics', label: 'Ansible' },
    { slug: 'kafka-basics', label: 'Kafka' }, 
    { slug: 'cicd-basics', label: 'CI/CD: основы' },
    { slug: 'gitops', label: 'GitOps и деплой' },
  ],
},
  {
    slug: 'backend-python',
    title: 'Backend Python',
    description: 'Python, API, контейнеры — для backend-разработки',
// backend-python:
courses: [
  { slug: 'git-basics', label: 'Git' },
  { slug: 'linux-basics', label: 'Linux' },
  { slug: 'python-basics', label: 'Python: база' },
  { slug: 'python-advanced', label: 'Python: продвинуто' },
  { slug: 'networks-http', label: 'Сети' },
  { slug: 'sql-basics', label: 'SQL' },
  { slug: 'sql-advanced', label: 'SQL: продвинуто' },
  { slug: 'postgresql-deep', label: 'PostgreSQL: глубоко' },
  { slug: 'docker-basics', label: 'Docker' },
  { slug: 'design-patterns', label: 'Проектирование' },
  { slug: 'terraform-basics', label: 'Terraform: IaC' },
  { slug: 'kafka-basics', label: 'Kafka' },
],
  },
  {
    slug: 'ai-engineer',
    title: 'AI Engineer',
    description: 'Python, LLM, RAG, MCP — для AI-инженера',
// ai-engineer:
courses: [
  { slug: 'git-basics', label: 'Git' },
  { slug: 'linux-basics', label: 'Linux' },
  { slug: 'python-basics', label: 'Python: база' },
  { slug: 'python-advanced', label: 'Python: продвинуто' },
  { slug: 'networks-http', label: 'Сети' },
  { slug: 'sql-basics', label: 'SQL' },
  { slug: 'sql-advanced', label: 'SQL: продвинуто' },
  { slug: 'docker-basics', label: 'Docker' },
  { slug: 'ai-agents', label: 'AI-агенты' },
],
  },
];