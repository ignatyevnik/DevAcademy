import type { Course } from './types';

export const cicdCourse: Course = {
  slug: 'cicd',
  title: 'CI/CD: автоматизация от коммита до продакшена',
  subtitle: 'GitHub Actions, GitLab CI, тесты, Docker и безопасные стратегии деплоя',
  description:
    'Курс для тех, кто хочет автоматизировать путь кода от коммита до продакшена. Разберём принципы CI/CD, GitHub Actions и GitLab CI, работу с секретами и кэшем, прогон тестов в пайплайне, сборку и публикацию Docker-образов, безопасные стратегии деплоя (blue-green, canary) и откат при проблемах. Каждый концепт — с реальным YAML-примером.',
  level: 'Средний',
  tags: ['CI/CD', 'DevOps', 'GitHub Actions'],
  accent: '#2088ff',
  icon: 'cicd',
  outcomes: [
    'Объяснять разницу между CI, CD и pipeline-стадиями',
    'Писать workflow на GitHub Actions и .gitlab-ci.yml',
    'Работать с секретами, кэшем и артефактами',
    'Запускать тесты и линтеры в CI на каждый PR',
    'Собирать и публиковать Docker-образы из CI',
    'Выбирать стратегию деплоя: blue-green, canary, rolling',
  ],
  requirements: ['Знание Git (курс Git)', 'Понимание Docker', 'Базовый Linux/CLI'],
  modules: [
    {
      id: 'cd-m1',
      title: 'Основы CI/CD',
      lessons: [
        {
          id: 'cd-l1',
          title: 'Что такое CI/CD',
          minutes: 25,
          steps: [
            {
              id: 'cd-l1-s1',
              title: 'Три буквы — три практики',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: `CI/CD — это не одна технология, а набор практик, которые автоматизируют путь кода от коммита до продакшена. Аббревиатура раскрывается по-разному, и это создаёт путаницу.`,
                },
                {
                  type: 'table',
                  caption: 'Что означают буквы',
                  head: ['Аббревиатура', 'Расшифровка', 'Что автоматизирует'],
                  rows: [
                    ['CI', 'Continuous Integration', 'Слияние кода в main + автотесты на каждый коммит'],
                    ['CD', 'Continuous Delivery', 'CI + автоматическая подготовка релиза, деплой — по кнопке'],
                    ['CD', 'Continuous Deployment', 'CI + автоматический деплой в прод без кнопки'],
                  ],
                },
                {
                  type: 'p',
                  text: `Continuous Integration — практика, при которой разработчики часто (несколько раз в день) сливают код в main, и каждый merge прогоняется через автотесты. Это ловит конфликты и регрессии в первые минуты, а не через недели.`,
                },
                {
                  type: 'p',
                  text: `Continuous Delivery — CI + автоматическая сборка артефакта (Docker-образ, jar, wheel) и подготовка к релизу. Деплой в прод — по нажатию кнопки. Так работают 90% команд: тесты и сборка — автоматом, прод — под контролем человека.`,
                },
                {
                  type: 'p',
                  text: `Continuous Deployment — следующий шаг: если все тесты прошли, изменения сразу едут в прод без человека. Так работают Amazon, Google, Netflix — но это требует очень зрелого процесса (feature flags, canary, мониторинг). Начинать с этого — плохая идея.`,
                },
                {
                  type: 'note',
                  text: `Главная ценность CI/CD — не «модно», а «быстрая обратная связь». Чем раньше вы узнаёте, что что-то сломали, тем дешевле исправить. Коммит, который упал через 5 минут после пуша, стоит 15 минут работы. Тот же баг, найденный в проде через неделю — дни и репутация.`,
                },
              ],
            },
            {
              id: 'cd-l1-s2',
              title: 'Типичный pipeline',
              type: 'theory',
              blocks: [
                {
                  type: 'mermaid',
                  caption: 'Стадии CI/CD pipeline',
                  code: `graph LR
                    Commit["Commit / PR"] --> Lint["Lint"]
                    Lint --> Unit["Unit-тесты"]
                    Unit --> Build["Build"]
                    Build --> Integ["Integration"]
                    Integ --> E2E["E2E"]
                    E2E --> Publish["Publish<br/>(registry)"]
                    Publish --> Staging["Deploy<br/>staging"]
                    Staging --> Smoke["Smoke<br/>staging"]
                    Smoke --> Prod["Deploy<br/>prod"]`
                },
                {
                  type: 'list',
                  items: [
                    'Fast feedback first: дешёвые проверки (lint) — раньше, дорогие (e2e) — позже',
                    'Fail fast: упало на lint — не тратим 15 минут на e2e',
                    'Параллельно, где можно: unit + lint + typecheck одновременно',
                    'Артефакты: собранный образ/бинарь передаётся между стадиями, а не пересобирается',
                    'Общее время PR-пайплайна — 10–15 минут, не больше',
                  ],
                },
                {
                  type: 'note',
                  text: `Правило «10–15 минут на PR» — не догма, а эмпирика. Если CI идёт дольше, разработчики перестают ждать и мержат «на глаз». Лучше меньше тестов в PR + полный прогон ночью, чем 40-минутный CI, который все игнорируют.`,
                },
              ],
            },
            {
              id: 'cd-l1-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Чем Continuous Delivery отличается от Continuous Deployment?',
                options: [
                  { id: 'a', text: 'Ничем, это синонимы' },
                  { id: 'b', text: 'Delivery — деплой по кнопке (approve), Deployment — автоматически без человека' },
                  { id: 'c', text: 'Delivery — только для Docker, Deployment — для всего' },
                  { id: 'd', text: 'Delivery быстрее' },
                ],
                correct: ['b'],
                explanation:
                  'Delivery = «всё готово к деплою, но прод — по кнопке». Deployment = «прод автоматически, если тесты прошли». 90% команд используют Delivery: прод под контролем человека, но всё остальное — автоматом. Deployment требует зрелого процесса (canary, feature flags, мониторинг).',
              },
            },
          ],
        },
        {
          id: 'cd-l2',
          title: 'GitHub Actions: workflow, jobs, steps',
          minutes: 30,
          steps: [
            {
              id: 'cd-l2-s1',
              title: 'Структура workflow',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: `GitHub Actions — встроенный CI/CD в GitHub. Workflow — YAML-файл в .github/workflows/. Он описывает: когда запускаться (триггеры), что делать (jobs), из каких шагов (steps).`,
                },
                {
                  type: 'mermaid',
                  caption: 'Зависимости между job-ами через needs',
                  code: `graph LR
                    Trigger["on:<br/>push / pull_request"] --> Lint["lint<br/>ruff check ."]
                    Lint -->|"needs: [lint]"| Test["test<br/>pytest + matrix"]
                    Test -->|"needs: [test]<br/>if: github.ref == main"| Deploy["deploy"]`
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: '.github/workflows/ci.yml',
                  code: `name: CI

# Когда запускать
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

# Что делать
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.12'
      - run: pip install ruff
      - run: ruff check .

  test:
    runs-on: ubuntu-latest
    needs: lint                # ждём lint — если упал, test не запустится
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.12'
      - run: pip install -r requirements.txt
      - run: pytest -v --junitxml=report.xml
      - uses: actions/upload-artifact@v4
        if: always()           # выгрузить отчёт, даже если тесты упали
        with:
          name: test-report
          path: report.xml`,
                },
                {
                  type: 'list',
                  items: [
                    'name — как назвать workflow (видно в UI)',
                    'on — триггеры: push, pull_request, schedule (cron), workflow_dispatch (кнопка), release',
                    'jobs — параллельные задачи. Каждая на своём runner-е',
                    'runs-on — образ runner-а: ubuntu-latest, windows-latest, macos-latest',
                    'steps — последовательные шаги внутри job',
                    'uses — готовый action из Marketplace (actions/checkout)',
                    'run — команда shell',
                    'needs — зависимость: test ждёт lint',
                  ],
                },
              ],
            },
            {
              id: 'cd-l2-s2',
              title: 'Jobs, steps и зависимости',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'Матрица версий и параллелизм',
                  code: `jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false        # если одна версия упала, остальные продолжают
      matrix:
        python-version: ['3.10', '3.11', '3.12']
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: \${{ matrix.python-version }}
      - run: pip install -r requirements.txt
      - run: pytest

# Создаст 3 параллельных job-а: test (3.10), test (3.11), test (3.12)
# fail-fast: false — упала 3.10, но 3.11 и 3.12 всё равно прогонятся
# → полная картина совместимости`,
                },
                {
                  type: 'note',
                  text: `Матрица — главный способ проверить совместимость: несколько версий Python, Node, Go, ОС (ubuntu + windows + macos). Для Open Source — стандарт: PR должен проходить на всех поддерживаемых версиях. Для внутреннего проекта — обычно 1–2 версии, не 10.`,
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'Последовательные и параллельные job',
                  code: `jobs:
  # Параллельно (по умолчанию)
  lint: { runs-on: ubuntu-latest, steps: [...] }
  typecheck: { runs-on: ubuntu-latest, steps: [...] }

  # Ждёт оба
  test:
    needs: [lint, typecheck]
    runs-on: ubuntu-latest
    steps: [...]

  # Ждёт test
  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'    # только для main
    steps: [...]`,
                },
              ],
            },
            {
              id: 'cd-l2-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что делает `strategy.matrix.python-version: [3.10, 3.11, 3.12]`?',
                options: [
                  { id: 'a', text: 'Устанавливает все три версии в один runner' },
                  { id: 'b', text: 'Запускает три параллельных job-а, по одному на каждую версию' },
                  { id: 'c', text: 'Проверяет, какая версия новее' },
                  { id: 'd', text: 'Это невалидный синтаксис' },
                ],
                correct: ['b'],
                explanation:
                  'Matrix — комбинаторный запуск. python-version: [3.10, 3.11, 3.12] = 3 job-а, каждый со своей версией. С матрицей из двух осей (python × os) — 6 job-ов. Каждый job — отдельный runner, параллельно. Fail-fast: false — упала одна, остальные продолжают.',
              },
            },
          ],
        },
        {
          id: 'cd-l3',
          title: 'GitLab CI и .gitlab-ci.yml',
          minutes: 25,
          steps: [
            {
              id: 'cd-l3-s1',
              title: 'Основы GitLab CI',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: `GitLab CI — встроенный CI/CD в GitLab. Конфиг — .gitlab-ci.yml в корне репозитория. Идеология похожа на GitHub Actions, но синтаксис другой: stages (этапы) + jobs внутри них.`,
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: '.gitlab-ci.yml',
                  code: `stages:
  - lint
  - test
  - build
  - deploy

variables:
  PIP_CACHE_DIR: "\$CI_PROJECT_DIR/.cache/pip"

# Job-ы запускаются в порядке stages.
# Внутри одного stage — параллельно.

lint:
  stage: lint
  image: python:3.12-slim
  script:
    - pip install ruff
    - ruff check .
  cache:
    key: pip
    paths:
      - .cache/pip

test:
  stage: test
  image: python:3.12-slim
  script:
    - pip install -r requirements.txt
    - pytest --junitxml=report.xml
  artifacts:
    when: always
    reports:
      junit: report.xml
    expire_in: 1 week
  needs:
    - lint

build:
  stage: build
  image: docker:24
  services:
    - docker:24-dind        # Docker-in-Docker
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA

deploy:
  stage: deploy
  script:
    - kubectl set image deployment/app app=$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
  when: manual              # ручной запуск (approve)
  only:
    - main`,
                },
                {
                  type: 'list',
                  items: [
                    'stages — этапы pipeline, job-ы идут по порядку этапов',
                    'Внутри stage — параллельно; между stage — последовательно',
                    'image — Docker-образ для job-а (всё выполняется в контейнере)',
                    'services — вспомогательные контейнеры (Docker-in-Docker, PostgreSQL, Redis)',
                    'cache — переиспользовать между job-ами (pip, npm, go)',
                    'artifacts — передать файлы из job-а в следующие / в UI',
                    'needs — ускорить: запустить job, не дожидаясь всего stage',
                    'when: manual — деплой по кнопке (для прода)',
                  ],
                },
                {
                  type: 'note',
                  text: 'GitLab CI встроенные переменные — $CI_COMMIT_SHA, $CI_PROJECT_DIR, $CI_REGISTRY_IMAGE, $CI_COMMIT_BRANCH. Полный список — в docs.gitlab.com. В GitHub Actions аналог — ${{ github.sha }}, ${{ github.repository }}, ${{ secrets.X }}.',
                },
              ],
            },
            {
              id: 'cd-l3-s2',
              title: 'GitHub Actions vs GitLab CI',
              type: 'theory',
              blocks: [
                {
                  type: 'table',
                  caption: 'Сравнение',
                  head: ['Аспект', 'GitHub Actions', 'GitLab CI'],
                  rows: [
                    ['Файл', '.github/workflows/*.yml', '.gitlab-ci.yml (один)'],
                    ['Единица', 'workflow → jobs → steps', 'stages → jobs → script'],
                    ['Параллелизм', 'jobs по умолчанию параллельны', 'внутри stage — параллельно'],
                    ['Зависимости', 'needs: [job1]', 'needs: [job] (ускоряет), иначе по stages'],
                    ['Runner', 'actions/runner (hosted или self-hosted)', 'GitLab Runner (hosted или self-hosted)'],
                    ['Секреты', 'Settings → Secrets → ${{ secrets.X }}', 'Settings → CI/CD → $VAR'],
                    ['Кэш', 'actions/cache@v4', 'cache:'],
                    ['Артефакты', 'actions/upload-artifact@v4', 'artifacts:'],
                    ['Docker', 'просто docker build', 'services: docker:dind'],
                  ],
                },
                {
                  type: 'note',
                  text: `GitHub Actions — стандарт в Open Source (бесплатно для публичных репозиториев). GitLab CI — часто в enterprise (self-hosted, интеграция с GitLab). Синтаксис разный, идеи одинаковые: stages → jobs → steps, кэш, артефакты, секреты, матрицы. Зная одно, второе осваивается за час.`,
                },
              ],
            },
            {
              id: 'cd-l3-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте концепцию GitHub Actions и аналог в GitLab CI',
                pairs: [
                  { left: 'workflow (.github/workflows/*.yml)', right: '.gitlab-ci.yml' },
                  { left: 'job', right: 'job внутри stage' },
                  { left: '${{ secrets.X }}', right: '$X (из CI/CD Settings)' },
                  { left: 'actions/cache@v4', right: 'cache:' },
                ],
                explanation:
                  'Идеи одинаковые, синтаксис разный. workflow ↔ .gitlab-ci.yml (один файл). job ↔ job. Секреты: ${{ secrets.X }} ↔ $X. Кэш: actions/cache ↔ cache:. Зная одно, второе — вопрос привычки.',
              },
            },
          ],
        },
        {
          id: 'cd-l4',
          title: 'Секреты, кэш, артефакты',
          minutes: 30,
          steps: [
            {
              id: 'cd-l4-s1',
              title: 'Секреты: как не утечь',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: `Секреты (токены, пароли, API-ключи) не должны быть в коде. CI/CD даёт механизм «переменных окружения», которые подставляются во время выполнения и маскируются в логах.`,
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'GitHub Actions',
                  code: `# 1. Settings → Secrets and variables → Actions → New repository secret
#    Имя: DATABASE_URL, Значение: postgres://...

# 2. Использование в workflow
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy
        env:
          DATABASE_URL: \${{ secrets.DATABASE_URL }}
          API_KEY: \${{ secrets.API_KEY }}
        run: |
          ./deploy.sh
# В логах значение будет *** (masked)`,
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'GitLab CI',
                  code: `# 1. Settings → CI/CD → Variables → Add variable
#    Ключ: DATABASE_URL, Значение: ..., Masked: ✓, Protected: ✓

# 2. Использование
deploy:
  script:
    - echo "Deploying..."
    - ./deploy.sh
  variables:
    DATABASE_URL: $DATABASE_URL   # или просто использовать $DATABASE_URL в script

# Masked — значение скрыто в логах
# Protected — доступно только в protected branches (main, tags)`,
                },
                {
                  type: 'note',
                  text: `Правила: (1) никогда не echo секрет — маскирование работает, но лучше не проверять; (2) не передавайте секреты в PR из fork — GitHub по умолчанию их не даёт, но не отключайте это; (3) ротация: раз в N месяцев меняйте токены; (4) OIDC вместо долгоживущих ключей — GitHub Actions может получать временные креды в AWS/GCP без хранения ключей.`,
                },
              ],
            },
            {
              id: 'cd-l4-s2',
              title: 'Кэш и артефакты',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'actions/cache — ускорение установки',
                  code: `- uses: actions/cache@v4
  with:
    path: |
      ~/.cache/pip
      ~/.cache/uv
    key: \${{ runner.os }}-pip-\${{ hashFiles('**/requirements*.txt') }}
    restore-keys: |
      \${{ runner.os }}-pip-

# key — уникальный ключ кэша
# hashFiles — хэш файла; изменился requirements.txt — новый кэш
# restore-keys — fallback: если точного нет, взять частичное совпадение`,
                },
                {
                  type: 'note',
                  text: `Кэш и артефакты — разные вещи. Кэш — «переиспользовать между запусками» (pip-пакеты, node_modules). Артефакт — «передать из job-а в job / в UI / в релиз» (собранный jar, Docker-образ, отчёт тестов). Не путайте.`,
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'Артефакты — передача между job-ами',
                  code: `jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: pip install build && python -m build
      - uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: dist
          path: dist/
      - run: ./deploy.sh dist/*.whl`,
                },
              ],
            },
            {
              id: 'cd-l4-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Чем артефакт отличается от кэша в CI?',
                options: [
                  { id: 'a', text: 'Ничем' },
                  { id: 'b', text: 'Артефакт — результат сборки, передаётся между job-ами; кэш — ускорение повторных запусков' },
                  { id: 'c', text: 'Кэш — для Docker, артефакт — для тестов' },
                  { id: 'd', text: 'Артефакт — платный' },
                ],
                correct: ['b'],
                explanation:
                  'Артефакт = «продукт»: собранный jar, Docker-образ, отчёт тестов. Кэш = «ускоритель»: pip-пакеты, node_modules, go-модули. Артефакт передаётся из job-а в job через upload/download. Кэш переиспользуется между запусками workflow. Не путайте — это разные механизмы с разными ключами.',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'cd-m2',
      title: 'Тесты, Docker и деплой',
      lessons: [
        {
          id: 'cd-l5',
          title: 'Тесты в CI: pytest, Playwright, репорты',
          minutes: 30,
          steps: [
            {
              id: 'cd-l5-s1',
              title: 'pytest в CI',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'Полный CI для Python-проекта',
                  code: `name: CI
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        python-version: ['3.11', '3.12']
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-python@v5
        with:
          python-version: \${{ matrix.python-version }}
          cache: 'pip'

      - run: pip install -r requirements-dev.txt

      - name: Lint
        run: ruff check .

      - name: Type check
        run: mypy src/

      - name: Tests
        run: pytest -v --junitxml=report.xml --cov=src --cov-report=xml

      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: reports-\${{ matrix.python-version }}
          path: |
            report.xml
            coverage.xml`,
                },
                {
                  type: 'list',
                  items: [
                    'cache: pip — встроенный кэш setup-python, не нужен actions/cache',
                    '--junitxml — отчёт в формате JUnit (GitHub/GitLab покажут тесты в UI)',
                    '--cov — покрытие (coverage), --cov-report=xml — для Codecov/SonarQube',
                    'if: always() на upload-artifact — сохранить отчёты, даже если тесты упали',
                    'fail-fast: false — упала одна версия Python, остальные продолжают',
                  ],
                },
                {
                  type: 'note',
                  text: `JUnit XML — стандарт отчётов о тестах. Почти все CI-системы его понимают: показывают «5 passed, 2 failed» в PR, с ссылками на упавшие тесты. Без --junitxml вы видите только «Exit code 1» в логе. С ним — структурированный отчёт.`,
                },
              ],
            },
            {
              id: 'cd-l5-s2',
              title: 'Playwright в CI',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'E2E-тесты с Playwright',
                  code: `jobs:
  e2e:
    runs-on: ubuntu-latest
    timeout-minutes: 20
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: '3.12' }

      - run: pip install -r requirements-dev.txt

      - name: Install Playwright browsers
        run: playwright install --with-deps chromium

      - name: Run E2E tests
        env:
          BASE_URL: \${{ secrets.STAGING_URL }}
        run: pytest tests/e2e/ -n 4 --tracing=retain-on-failure

      - name: Upload traces
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-traces
          path: test-results/
          retention-days: 7`,
                },
                {
                  type: 'list',
                  items: [
                    'playwright install --with-deps — установить браузеры + системные зависимости',
                    '-n 4 — pytest-xdist, 4 параллельных теста (в 4 раза быстрее)',
                    '--tracing=retain-on-failure — trace сохранится только для упавших тестов',
                    'if: failure() на upload — не тратить место, если тесты прошли',
                    'timeout-minutes — общий таймаут job-а (защита от «зависших» тестов)',
                  ],
                },
                {
                  type: 'note',
                  text: `Playwright в CI — отдельная боль. Браузеры ~500 МБ, требуют libnss3, libatk, libgtk и т.д. --with-deps ставит их через apt. Без этого — «browser not found» или «cannot open shared object». На Ubuntu-latest всё работает, на self-hosted нужны Docker-образы mcr.microsoft.com/playwright/python:v1.48.0.`,
                },
              ],
            },
            {
              id: 'cd-l5-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Зачем в pytest добавлять флаг `--junitxml=report.xml` в CI?',
                options: [
                  { id: 'a', text: 'Ускоряет тесты' },
                  { id: 'b', text: 'CI-система покажет структурированный отчёт: сколько тестов, какие упали, ссылки на ошибки' },
                  { id: 'c', text: 'Заменяет coverage' },
                  { id: 'd', text: 'Это требование pytest' },
                ],
                correct: ['b'],
                explanation:
                  'Без --junitxml вы видите только «exit code 1» в логе — и ищите глазами, что упало. С JUnit XML GitHub/GitLab парсят отчёт и показывают «5 passed, 2 failed» прямо в PR, с именами тестов и сообщениями. Это стандарт.',
              },
            },
          ],
        },
        {
          id: 'cd-l6',
          title: 'Docker в CI: сборка и публикация',
          minutes: 30,
          steps: [
            {
              id: 'cd-l6-s1',
              title: 'Сборка и пуш в registry',
              type: 'theory',
              blocks: [
                {
                  type: 'mermaid',
                  caption: 'Сборка и публикация образа с кэшем',
                  code: `graph LR
                    Checkout["checkout"] --> Buildx["setup-buildx"]
                    Buildx --> Login["login to GHCR"]
                    Login --> Build["build-push-action"]
                    Build <-->|"cache-from / cache-to"| Cache[("GHA cache")]
                    Build -->|"push: main / tags"| Registry[("ghcr.io")]
                    Build -.->|"push: false на PR"| OnlyBuild["только проверка<br/>сборки"]`
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'build-push-action в GitHub Actions',
                  code: `name: Build and push
on:
  push:
    branches: [main]
    tags: ['v*']

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4

      - uses: docker/setup-buildx-action@v3

      - name: Login to GHCR
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }}

      - name: Build and push
        uses: docker/build-push-action@v6
        with:
          context: .
          push: \${{ github.event_name != 'pull_request' }}
          tags: |
            ghcr.io/\${{ github.repository }}:\${{ github.sha }}
            ghcr.io/\${{ github.repository }}:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max`,
                },
                {
                  type: 'list',
                  items: [
                    'permissions: packages: write — GITHUB_TOKEN получает права на GHCR',
                    'setup-buildx — multi-platform и продвинутый кэш',
                    'login-action — логин в registry (GHCR, Docker Hub, ECR, GAR)',
                    'push: false на PR — не пушить из PR (только проверка сборки)',
                    'cache-from: type=gha — кэш слоёв в GitHub Actions (быстрее в разы)',
                    'Теги: git SHA (неизменный) + latest (плавающий)',
                  ],
                },
                {
                  type: 'note',
                  text: `Не пушить образ на каждый PR. Причина: засоряет registry, занимает место, может сломать «последний» тег. На PR — build с push: false (проверка, что Dockerfile собирается). Push — только в main и на теги v*.`,
                },
              ],
            },
            {
              id: 'cd-l6-s2',
              title: 'Стратегия тегов и версий',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'docker/metadata-action — авто-теги',
                  code: `- name: Docker metadata
  id: meta
  uses: docker/metadata-action@v5
  with:
    images: ghcr.io/\${{ github.repository }}
    tags: |
      type=ref,event=branch
      type=ref,event=pr
      type=semver,pattern={{version}}
      type=semver,pattern={{major}}.{{minor}}
      type=sha,prefix=sha-,format=short
      type=raw,value=latest,enable={{is_default_branch}}

- uses: docker/build-push-action@v6
  with:
    context: .
    push: true
    tags: \${{ steps.meta.outputs.tags }}
    labels: \${{ steps.meta.outputs.labels }}`,
                },
                {
                  type: 'table',
                  caption: 'Что создаст metadata-action при разных событиях',
                  head: ['Событие', 'Теги'],
                  rows: [
                    ['push в main', 'main, sha-abc1234, latest'],
                    ['push в feature/x', 'feature-x, sha-def5678'],
                    ['PR #42', 'pr-42'],
                    ['тег v1.4.2', '1.4.2, 1.4, sha-ghi9012, latest'],
                    ['тег v2.0.0-rc.1', '2.0.0-rc.1, sha-jkl3456'],
                  ],
                },
                {
                  type: 'note',
                  text: `metadata-action — стандарт индустрии. Не пишите теги руками: легко ошибиться, забыть latest, сделать невалидный semver. Action сам разбирает git-событие и генерирует правильные теги. Плюс labels — OCI-метаданные (source, revision, created, version) — для аудита.`,
                },
              ],
            },
            {
              id: 'cd-l6-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Почему на PR обычно ставят `push: false` при сборке Docker-образа?',
                options: [
                  { id: 'a', text: 'Docker не работает на PR' },
                  { id: 'b', text: 'PR не должен пушить в registry: засоряет место, может сломать latest; достаточно проверить, что собирается' },
                  { id: 'c', text: 'Это ускоряет сборку в 10 раз' },
                  { id: 'd', text: 'PR не имеет доступа к registry' },
                ],
                correct: ['b'],
                explanation:
                  'На PR — задача «проверить, что Dockerfile валиден». Push в registry на каждый PR засоряет место (образы копятся), может перезаписать тег latest, требует прав на запись. Push — только в main и на теги. Сборка без push занимает столько же времени, но не оставляет мусора.',
              },
            },
          ],
        },
        {
          id: 'cd-l7',
          title: 'Стратегии деплоя и rollback',
          minutes: 35,
          steps: [
            {
              id: 'cd-l7-s1',
              title: 'Rolling, blue-green, canary',
              type: 'theory',
              blocks: [
                {
                  type: 'table',
                  caption: 'Три стратегии',
                  head: ['Стратегия', 'Как работает', 'Откат'],
                  rows: [
                    ['Rolling update', 'Постепенно заменять старые поды новыми (K8s default)', 'kubectl rollout undo'],
                    ['Blue-green', 'Два окружения: blue (старое) и green (новое). Переключение трафика', 'Переключить обратно'],
                    ['Canary', '5% трафика на новую версию, потом 25%, 50%, 100%', 'Уменьшить долю до 0'],
                  ],
                },
                {
  type: 'mermaid',
  caption: 'Blue-green: переключение трафика',
  code: `graph LR
    subgraph Before["До деплоя"]
        LB1["LB"] -->|"100%"| B1["Blue v1.0"]
        LB1 -.->|"0%"| G1["Green — пусто"]
    end
    subgraph After["После деплоя"]
        LB2["LB"] -.->|"0%"| B2["Blue v1.0<br/>(откат за секунду)"]
        LB2 -->|"100%"| G2["Green v1.1"]
    end`
},
                {
  type: 'mermaid',
  caption: 'Canary: постепенная раскатка',
  code: `graph LR
    S1["5%"] --> S2["25%"]
    S2 --> S3["50%"]
    S3 --> S4["100%"]
    S1 -.->|"плохо"| Stop["0%<br/>(автооткат)"]
    S2 -.->|"плохо"| Stop
    S3 -.->|"плохо"| Stop`
},
              ],
            },
            {
              id: 'cd-l7-s2',
              title: 'Feature flags и rollback',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: `Feature flag (feature toggle) — «переключатель» в коде, который включает/выключает функциональность без деплоя. Позволяет деплоить «выключенным», включать для 1% пользователей, откатывать за секунды.`,
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Feature flag в коде',
                  code: `from launchdarkly import LDClient

ld = LDClient(sdk_key=os.environ["LD_SDK_KEY"])

def new_checkout(user):
    if ld.variation("new-checkout-flow", user, default=False):
        return new_flow(user)   # новая версия
    return old_flow(user)       # старая версия

# В LaunchDarkly UI: включить для 5% → 25% → 100%
# Если плохо — выключить за секунды, без деплоя и rollback
`,
                },
                {
                  type: 'list',
                  items: [
                    'Деплой ≠ релиз. Код в проде, но «выключен» флагом',
                    'Rollback за секунды — переключить флаг',
                    'A/B-тесты: 50% на новую, 50% на старую',
                    'Feature flags — это технический долг: удаляйте после полного раската',
                    'Инструменты: LaunchDarkly, Unleash, Flagsmith (Open Source), GrowthBook',
                  ],
                },
                {
                  type: 'note',
                  text: `Canary + feature flags — стандарт крупных компаний. Canary — для инфраструктурных изменений (новый сервер, новая БД). Feature flags — для бизнес-фич. Вместе: «деплой в прод выключенным → canary для инфраструктуры → флаг для фичи → 1% → 100%».`,
                },
              ],
            },
            {
              id: 'cd-l7-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте стратегию деплоя и её особенность',
                pairs: [
                  { left: 'Rolling update', right: 'Постепенная замена подов, K8s default' },
                  { left: 'Blue-green', right: 'Два окружения, мгновенное переключение трафика' },
                  { left: 'Canary', right: '5% → 25% → 100% с проверкой метрик' },
                  { left: 'Feature flag', right: 'Включение фичи в рантайме, без деплоя' },
                ],
                explanation:
                  'Rolling — стандарт K8s (быстро, но нет «мгновенного» отката). Blue-green — два окружения, откат за секунду, дорого (двойные ресурсы). Canary — постепенная раскатка с метриками. Feature flag — «деплой ≠ релиз», выключено в проде, включается по необходимости. На собеседовании DevOps это спрашивают.',
              },
            },
          ],
        },
      ],
    },
        {
      id: 'cd-m3',
      title: 'Практикум',
      lessons: [
        {
          id: 'cd-l8',
          title: 'Практика: пайплайны и деплой',
          minutes: 35,
          steps: [
            {
              id: 'cd-l8-s1',
              title: 'Delivery vs Deployment',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Чем Continuous Delivery отличается от Continuous Deployment?',
                options: [
                  { id: 'a', text: 'Delivery — деплой по кнопке, Deployment — автоматически' },
                  { id: 'b', text: 'Delivery — для Docker, Deployment — для серверов' },
                  { id: 'c', text: 'Ничем' },
                  { id: 'd', text: 'Delivery — это CI' },
                ],
                correct: ['a'],
                explanation: 'Delivery — всё готово, но деплой в прод требует ручного approve. Deployment — автоматом в прод, если тесты прошли.',
              },
            },
            {
              id: 'cd-l8-s2',
              title: 'Стадии pipeline',
              type: 'quiz',
              quiz: {
                kind: 'sorting',
                question: 'Расставьте стадии CI/CD в правильном порядке (от самого быстрого к самому долгому)',
                items: ['Lint', 'Unit-тесты', 'Build (Docker)', 'E2E-тесты', 'Deploy'],
                correct: ['Lint', 'Unit-тесты', 'Build (Docker)', 'E2E-тесты', 'Deploy'],
                explanation: 'Сначала быстрые проверки (lint, unit), потом сборка, потом долгие E2E, и только потом деплой.',
              },
            },
            {
              id: 'cd-l8-s3',
              title: 'Триггер GitHub Actions',
              type: 'quiz',
              quiz: {
                kind: 'cloze',
                question: 'Заполните YAML для запуска workflow на push и pull_request',
                text: 'name: CI\n____:\n  ____: [push, pull_request]',
                blanks: [
                  { accepted: ['on'], hint: 'когда запускать' },
                  { accepted: ['on'], hint: 'события' },
                ],
                explanation: 'on: [push, pull_request] — стандартный триггер для проверки каждого пуша и PR. (В YAML `on` — ключевое слово).',
              },
            },
            {
              id: 'cd-l8-s4',
              title: 'Секреты',
              type: 'quiz',
              quiz: {
                kind: 'fill',
                question: 'Как обратиться к секрету `DB_PASSWORD` в GitHub Actions?',
                accepted: ['${{ secrets.DB_PASSWORD }}', '${{secrets.DB_PASSWORD}}'],
                placeholder: '${{ ... }}',
                hint: 'secrets и имя',
                explanation: '${{ secrets.DB_PASSWORD }} — стандартный синтаксис. Значение будет замаскировано в логах.',
              },
            },
            {
              id: 'cd-l8-s5',
              title: 'Стратегии деплоя',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте стратегию деплоя и её суть',
                pairs: [
                  { left: 'Blue-Green', right: 'Два окружения, переключение трафика' },
                  { left: 'Canary', right: '5% → 25% → 100% трафика' },
                  { left: 'Rolling', right: 'Постепенная замена подов' },
                  { left: 'Feature flag', right: 'Включение фичи в рантайме' },
                ],
                explanation: 'Blue-Green — два окружения. Canary — постепенная раскатка с метриками. Rolling — стандарт K8s. Feature flag — деплой ≠ релиз.',
              },
            },
            {
              id: 'cd-l8-s6',
              title: 'Время PR-пайплайна',
              type: 'quiz',
              quiz: {
                kind: 'number',
                question: 'Какое максимальное время выполнения CI на PR считается комфортным (в минутах)?',
                correct: 15,
                explanation: 'Оптимум — 10–15 минут. Если дольше, разработчики перестают ждать и мержат вслепую.',
              },
            },
            {
              id: 'cd-l8-s7',
              title: 'Что блокирует merge',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Что стоит делать обязательной проверкой (required check) в PR?',
                options: [
                  { id: 'a', text: 'Lint' },
                  { id: 'b', text: 'Unit-тесты' },
                  { id: 'c', text: 'Полный нагрузочный тест (30 минут)' },
                  { id: 'd', text: 'Smoke E2E (5 минут)' },
                ],
                correct: ['a', 'b', 'd'],
                explanation: 'Lint, unit, smoke E2E — быстрые проверки. Полный нагрузочный тест — только ночью, он не должен блокировать PR.',
              },
            },
            {
              id: 'cd-l8-s8',
              title: 'Кэш vs артефакт',
              type: 'quiz',
              quiz: {
                kind: 'table',
                question: 'Отметьте, что верно для каждого механизма',
                columns: ['Кэш', 'Артефакт'],
                rows: [
                  { label: 'Ускоряет повторные запуски', correct: ['Кэш'] },
                  { label: 'Передаёт файлы между job-ами', correct: ['Артефакт'] },
                  { label: 'Содержит, например, node_modules', correct: ['Кэш'] },
                  { label: 'Содержит собранный jar/Docker-образ', correct: ['Артефакт'] },
                ],
                explanation: 'Кэш — ускоряет (pip, npm). Артефакт — результат сборки, передаётся между job.',
              },
            },
            {
              id: 'cd-l8-s9',
              title: 'Шаг в GitHub Actions',
              type: 'quiz',
              quiz: {
                kind: 'code',
                question: 'Напишите шаг (step) в GitHub Actions, который запускает команду `pytest -v`.',
                starterCode: '- name: Run tests\n  ',
                mustInclude: [
                  { pattern: 'run:\\s*pytest -v', message: 'Нужен ключ run с командой pytest -v' },
                ],
                explanation: '- name: Run tests\n  run: pytest -v',
              },
            },
            {
              id: 'cd-l8-s10',
              title: 'Docker в CI',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Зачем на PR обычно ставят `push: false` при сборке Docker-образа?',
                options: [
                  { id: 'a', text: 'Docker не работает на PR' },
                  { id: 'b', text: 'Чтобы проверить сборку, но не засорять registry и не ломать latest' },
                  { id: 'c', text: 'Это ускоряет сборку в 10 раз' },
                  { id: 'd', text: 'Чтобы не платить за Docker Hub' },
                ],
                correct: ['b'],
                explanation: 'На PR достаточно проверить, что Dockerfile собирается. Push в registry — только для main и тегов.',
              },
            },
          ],
        },
      ],
    },
  ],
};