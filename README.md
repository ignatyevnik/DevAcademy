# DevAcademy

> Инженерная база знаний: тестирование, Python, Docker, Kubernetes, IaC и ИИ-агенты. Работает полностью офлайн, прогресс хранится локально на устройстве.

[![CI](https://github.com/ignatyevnik/DevAcademy/actions/workflows/ci.yml/badge.svg)](https://github.com/ignatyevnik/DevAcademy/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=fff)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=000)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=fff)](https://vite.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## Оглавление

- [О проекте](#о-проекте)
- [Возможности](#возможности)
- [Каталог курсов](#каталог-курсов)
- [Треки обучения](#треки-обучения)
- [Технологический стек](#технологический-стек)
- [Быстрый старт](#быстрый-старт)
- [Структура проекта](#структура-проекта)
- [Как внести вклад](#как-внести-вклад)
- [Как добавить урок](#как-добавить-урок)
- [Как добавить курс](#как-добавить-курс)
- [Как добавить новый блок или тип квиза](#как-добавить-новый-блок-или-тип-квиза)
- [Валидация и тесты](#валидация-и-тесты)
- [Сообщить об ошибке](#сообщить-об-ошибке)
- [Лицензия](#лицензия)

## О проекте

**DevAcademy** — открытая некоммерческая платформа для инженеров, которые хотят системно освоить базу: тестирование, Python, Docker, Kubernetes, IaC и ИИ-агенты. Курсы построены по принципу «теория → проверка»: короткие шаги, практика на реальных песочницах, вопросы на закрепление.

Особенности:

- **Полностью офлайн.** PWA: приложение можно установить и использовать без интернета.
- **Офлайн-песочницы.** SQL — через `sql.js` (SQLite в WebAssembly), Python — через `Pyodide` (CPython в WebAssembly). Прямо в браузере, без сервера.
- **Прогресс — локально.** Никаких аккаунтов и бэкенда: всё в `localStorage`. Экспорт/импорт в JSON для переноса между устройствами.
- **Валидированный контент.** Zod-схемы гарантируют, что каждый урок корректен: уникальные `id`, правильные `correct` в квизах, валидные `pairs.right` и т.д.
- **Встроенный редактор.** Можно создавать и редактировать курсы прямо в браузере (`/editor`) — с превью и автосохранением.

## Возможности

- 📚 **21 курс** в 9 категориях, **400 уроков**
- 🎯 **9 типов заданий:** single, multiple, fill, matching, sorting, table, number, cloze, code
- 🧪 **2 типа песочниц:** SQL (SQLite) и Python (Pyodide)
- 🧠 **Интервальное повторение** по алгоритму SM-2: квизы, которые пора повторить, показываются на главной
- 📝 **Заметки** к каждому шагу + экспорт всех заметок в Markdown
- 🔖 **Закладки** на уроки
- 🏆 **Экзамен** по курсу (случайные 20 квизов из всех уроков)
- 🔥 **Стрик** (дней подряд) + цель 15 минут в день
- 🌙 **Тёмная и светлая темы**, регулировка размера шрифта
- 📴 **Экспорт/импорт** прогресса в JSON
- ⚡ **Ленивая загрузка** тяжёлых виджетов (CodeMirror, Pyodide, sql.js) — страница открывается быстро

## Каталог курсов

**21 курс, 400 уроков** в 9 категориях. Точное число и прогресс — в приложении (на главной).

### Фундамент

| Курс | Уроков | О чём |
|------|-------:|-------|
| Git и командная работа | ≈18 | Ветки, merge, rebase, reset, reflog, хуки, worktree, bisect, submodules |
| Linux: с нуля до уверенного пользователя | 26 | Терминал, FHS, права, процессы, systemd, journalctl, сеть, bash, cron |
| Сети и HTTP | 11 | OSI, TCP/IP, DNS, HTTP/2-3, TLS, WebSocket, прокси, диагностика |

### Данные

| Курс | Уроков | О чём |
|------|-------:|-------|
| SQL: основы | 19 | SELECT, JOIN, агрегаты, строки, даты, UNION, CASE |
| SQL: продвинуто | 13 | Подзапросы, CTE, индексы, транзакции, EXPLAIN, окна, JSONB, миграции |
| PostgreSQL: глубоко | 20 | MVCC, WAL, VACUUM, EXPLAIN BUFFERS, партиционирование, репликация, PgBouncer |

### Языки

| Курс | Уроков | О чём |
|------|-------:|-------|
| Python: основы | 16 | Синтаксис, коллекции, функции, файлы, comprehension, sorted |
| Python: продвинуто | 20 | ООП, декораторы, генераторы, async, типизация, многопоточность |

### QA

| Курс | Уроков | О чём |
|------|-------:|-------|
| QA: основы | 18 | ISTQB, тест-дизайн, баг-репорты, API, pytest |
| QA Automation | 40 | Pytest, Playwright, SQL, нагрузка, безопасность, мобилки, a11y |
| QA Senior | 20 | Стратегия, CoQ, DORA, Screenplay, Testcontainers, SAST/DAST, BDD, Observability |

### Контейнеры

| Курс | Уроков | О чём |
|------|-------:|-------|
| Docker с нуля | 25 | Контейнеры, Dockerfile, compose, безопасность, registry, buildx |
| Kubernetes: основы | 29 | Поды, деплойменты, сервисы, конфигурация, probes, контроллеры |
| Kubernetes: продвинуто | ≈15 | Ingress, NetworkPolicy, PV/PVC, RBAC, securityContext, Helm, Kustomize |

### IaC

| Курс | Уроков | О чём |
|------|-------:|-------|
| Terraform: IaC | 18 | HCL, state, модули, провайдеры, remote backend, CI/CD |
| Ansible | 16 | Inventory, playbooks, роли, Jinja2, vault, collections, molecule |

### CI/CD и доставка

| Курс | Уроков | О чём |
|------|-------:|-------|
| CI/CD: основы | 12 | GitHub Actions, GitLab CI, Jenkins, тесты, Docker в CI |
| GitOps и деплой | 8 | ArgoCD, Flux, canary, blue-green, supply chain, Vault, DORA |
| Kafka | 18 | Topics, partitions, consumer groups, producer, репликация, Connect, Schema Registry |

### AI

| Курс | Уроков | О чём |
|------|-------:|-------|
| Настройка ИИ-агентов | 25 | Промпты, function calling, память, RAG, MCP, оценка, безопасность |

### Архитектура

| Курс | Уроков | О чём |
|------|-------:|-------|
| Проектирование и паттерны | 13 | SOLID, GoF, Repository, UoW, монолит vs микросервисы, CQRS |

## Треки обучения

Готовые маршруты под разные роли — см. `src/data/tracks.ts`.

| Трек | Курсы |
|------|-------|
| **QA: с нуля** | Git → Linux → Сети → SQL → SQL: продвинуто → QA: основы |
| **QA Automation** | Git → Linux → Сети → SQL → SQL: продвинуто → Python: база → Python: продвинуто → QA: основы → QA: автоматизация |
| **QA Senior** | QA: основы → QA: автоматизация → QA: сеньор |
| **DevOps** | Git → Linux → Сети → SQL → SQL: продвинуто → PostgreSQL: глубоко → Docker → K8s: основы → K8s: продвинуто → Terraform → Ansible → Kafka → CI/CD: основы → GitOps |
| **Backend Python** | Git → Linux → Python: база → Python: продвинуто → Сети → SQL → SQL: продвинуто → PostgreSQL: глубоко → Docker → Проектирование → Terraform → Kafka |
| **AI Engineer** | Git → Linux → Python: база → Python: продвинуто → Сети → SQL → SQL: продвинуто → Docker → AI-агенты |

## Технологический стек

- **Frontend:** React 19, React Router 7, TypeScript 5.9, Vite 7
- **UI:** Tailwind CSS 3.4, Radix UI, lucide-react, sonner (toasts)
- **Контент:** Zod 4 — валидация схем курсов и уроков
- **Песочницы:** `sql.js` (SQLite → WASM), `pyodide` (CPython → WASM)
- **Редактор кода:** CodeMirror 6 (`@uiw/react-codemirror`)
- **Подсветка:** prism-react-renderer, mermaid (диаграммы)
- **Тесты:** Vitest 5, Testing Library
- **Сборка:** Vite, PWA (`vite-plugin-pwa`)

## Быстрый старт

```bash
# Клонировать
git clone https://github.com/ignatyevnik/DevAcademy.git
cd DevAcademy

# Установить зависимости
npm install

# Запустить dev-сервер
npm run dev
```

Откройте `http://localhost:5173`.

### Скрипты

```bash
npm run dev         # dev-сервер
npm run build       # прод-сборка
npm run preview     # предпросмотр сборки
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
npm run test        # vitest (один прогон)
npm run test:watch  # vitest watch
```

## Структура проекта

```
DevAcademy/
├── src/
│   ├── components/           # переиспользуемые компоненты
│   │   ├── ui/               # shadcn-компоненты (button, input, badge, ...)
│   │   ├── editor/           # редактор курсов (BlockEditor, QuizEditor, ...)
│   │   ├── StepContent.tsx   # рендер шага: теория + 9 типов квизов
│   │   ├── SandboxView.tsx   # SQL-песочница
│   │   ├── PythonView.tsx    # Python-песочница
│   │   └── ...               # Header, CourseCard, TrackCard, Search, Theme, ...
│   ├── data/
│   │   ├── *.ts              # курсы (git.ts, linux.ts, docker.ts, ...)
│   │   ├── index.ts          # сборка baseCourses + кастомные из localStorage
│   │   ├── types.ts          # типы: Course, Module, Lesson, Step, Quiz, TextBlock
│   │   ├── schemas.ts        # Zod-схемы для валидации контента
│   │   ├── validate.ts       # validateAllCourses
│   │   ├── categories.ts     # 9 категорий + маппинг slug → категория
│   │   └── tracks.ts         # 6 треков
│   ├── lib/
│   │   ├── progress.tsx      # прогресс, SRS, заметки, закладки
│   │   ├── sql-sandbox.ts    # SQLite через sql.js
│   │   ├── pyodide-sandbox.ts
│   │   ├── search.ts         # поиск по контенту
│   │   ├── streak.ts         # стрик
│   │   ├── theme.tsx         # тёмная/светлая тема
│   │   ├── font-size.ts      # размер шрифта
│   │   ├── exam-mode.tsx
│   │   └── ...
│   ├── pages/                # Home, CoursePage, LessonPage, ExamPage, ...
│   └── test/                 # тесты (vitest)
├── public/
│   └── assets/pyodide/       # Pyodide WASM (копируется при сборке)
├── scripts/
│   └── ...
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── README.md
```

## Как внести вклад

Мы рады любой помощи: исправления опечаток, новые уроки, новые типы квизов, улучшение UX, переводы, фиксы багов. Перед большими изменениями — откройте issue, чтобы обсудить.

### Требования к контенту

1. **Минимум 5 шагов в уроке.** Исключение — вводные уроки (`...-l0`) и практикумы (там 10–12 шагов).
2. **Каждый шаг — либо `theory` (с `blocks`), либо `quiz`.** Никаких пустых шагов.
3. **Уникальные `id`** в пределах урока (`step.id`) и в пределах модуля (`lesson.id`).
4. **Квиз-ответы:**
   - `single`: `correct` — ровно 1 элемент, и он есть в `options`.
   - `multiple`: `correct` — минимум 1, все есть в `options`.
   - `matching`: `pairs.right` — уникальны.
   - `sorting`: `items.length === correct.length` и `items` = `correct` (те же элементы).
   - `cloze`: количество `____` в `text` = количеству `blanks`.
   - `table`: `rows[i].correct` содержит только значения из `columns`.
5. **Стиль:** на «вы», без воды, с примерами. В `code` — одинарные кавычки с `\n`, если внутри есть `${{ ... }}` (чтобы не ломался TypeScript template literal и не терялись данные).
6. **Заметки (`note`)** — для важных предупреждений и «на собеседовании спросят».

### Как добавить урок

1. Откройте файл курса, например `src/data/linux.ts`.
2. Найдите нужный модуль (например, `ln-m1`).
3. Добавьте урок в `lessons: [...]`:

```ts
{
  id: 'ln-l27',              // уникальный, с префиксом курса
  title: 'Название урока',
  minutes: 25,
  steps: [
    {
      id: 'ln-l27-s1',
      title: 'Теория',
      type: 'theory',
      blocks: [
        { type: 'p', text: 'Абзац. Можно **жирный** и `код`.' },
        { type: 'code', lang: 'bash', code: 'ls -la', caption: 'Пример' },
        { type: 'note', text: 'Важное замечание.' },
      ],
    },
    {
      id: 'ln-l27-s2',
      title: 'Проверь себя',
      type: 'quiz',
      quiz: {
        kind: 'single',
        question: '...',
        options: [
          { id: 'a', text: '...' },
          { id: 'b', text: '...' },
        ],
        correct: ['a'],
        explanation: '...',
      },
    },
    // ... минимум 5 шагов
  ],
}
```

4. Запустите `npm run dev` — приложение покажет ошибку валидации, если что-то не так (в консоли).
5. Запустите `npm run test` — `schemas.test.ts` проверит все курсы.

### Как добавить курс

1. Создайте `src/data/my-course.ts`:

```ts
import type { Course } from './types';

export const myCourse: Course = {
  slug: 'my-course',          // только a-z, 0-9, дефис
  title: 'Мой курс',
  subtitle: 'Короткое описание',
  description: 'Подробное описание',
  level: 'Средний',           // Новичок | Средний | Продвинутый
  tags: ['Custom'],
  accent: '#4a90d9',          // hex-цвет
  icon: 'python',             // см. CourseIcon: flask, docker, python, sql, design, ...
  modules: [ /* ... */ ],
  outcomes: ['Чему научитесь 1', 'Чему научитесь 2'],
  requirements: ['Требование 1'],
};
```

2. В `src/data/index.ts` добавьте импорт и в `baseCourses`:

```ts
import { myCourse } from './my-course';
// ...
const baseCourses: Course[] = [
  // ...
  myCourse,
];
```

3. В `src/data/categories.ts` добавьте в `courseCategory`:
   `'my-course': 'languages',` (или другая категория из 9).

4. (Опционально) В `src/data/tracks.ts` добавьте курс в трек.

5. Запустите `npm run dev` и `npm run test`.

### Как добавить новый блок или тип квиза

**Новый тип квиза:**

1. Добавьте интерфейс в `src/data/types.ts` и в union `Quiz`.
2. Добавьте схему в `src/data/schemas.ts` (в `quizSchema`).
3. Добавьте рендер в `src/components/StepContent.tsx` (функция `QuizView`, switch по `kind`).
4. Добавьте редактор в `src/components/editor/QuizEditor.tsx` (и в `DEFAULT_QUIZ`).

**Новый тип блока теории:**

1. Добавьте в union `TextBlock` (`src/data/types.ts`).
2. Добавьте схему в `textBlockSchema` (`src/data/schemas.ts`).
3. Добавьте рендер в `TextBlocks` (`src/components/StepContent.tsx`).
4. Добавьте редактор в `BlockEditor.tsx` и кнопку в `EditorPage.tsx`.

### Валидация и тесты

Перед PR обязательно:

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
npm run test        # vitest
npm run build       # прод-сборка (проверит, что всё собирается)
```

Что проверяют тесты:

- `schemas.test.ts` — все курсы проходят Zod-валидацию.
- `stats.test.ts` — `getCourse`, `courseStats`, `findLesson`.
- `tracks.test.ts` — все курсы в треках существуют, без дублей, ≥2 курса.
- `progress.test.tsx` — прогресс, SRS, закладки, битый localStorage.
- `progress-io.test.ts` — экспорт/импорт прогресса (roundtrip).
- `pluralize.test.ts` — склонения («урок / урока / уроков»).

Если тест упал — в консоли будет точный путь (`course.slug` → `module.id` → `step.id`) и текст ошибки.

### Workflow PR

1. Fork репозитория.
2. Создайте ветку: `git switch -c feat/my-new-lesson`.
3. Внесите изменения, запустите `npm run test && npm run build`.
4. Закоммитьте (`feat: add lesson about X`), запушьте, откройте PR.
5. Дождитесь ревью.

## Сообщить об ошибке

- В приложении на каждом шаге есть кнопка **«Сообщить об ошибке»** — она открывает GitHub Issue с предзаполненным шаблоном (курс, урок, шаг, индекс).
- Или создайте Issue вручную: [github.com/ignatyevnik/DevAcademy/issues](https://github.com/ignatyevnik/DevAcademy/issues).

## Лицензия

MIT. См. [LICENSE](LICENSE).